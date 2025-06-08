/**
 * SEO Rules and Constants
 *
 * This file contains all the SEO rules, thresholds, and constants
 * based on Google Search best practices and industry standards.
 */

import type { SEOCheckCategory, StructuredDataType } from '../types';

// ============================================================================
// SEO THRESHOLDS & LIMITS
// ============================================================================

/**
 * Title tag optimization thresholds
 */
export const TITLE_RULES = {
  /** Minimum recommended title length */
  MIN_LENGTH: 30,
  /** Maximum recommended title length (Google typically shows ~60 chars) */
  MAX_LENGTH: 60,
  /** Optimal title length range */
  OPTIMAL_MIN: 50,
  OPTIMAL_MAX: 60,
} as const;

/**
 * Meta description optimization thresholds
 */
export const DESCRIPTION_RULES = {
  /** Minimum recommended description length */
  MIN_LENGTH: 120,
  /** Maximum recommended description length (Google typically shows ~160 chars) */
  MAX_LENGTH: 160,
  /** Optimal description length range */
  OPTIMAL_MIN: 150,
  OPTIMAL_MAX: 160,
} as const;

/**
 * Content optimization thresholds
 */
export const CONTENT_RULES = {
  /** Minimum word count for substantial content */
  MIN_WORD_COUNT: 300,
  /** Recommended minimum word count for competitive topics */
  RECOMMENDED_WORD_COUNT: 500,
  /** Average reading speed (words per minute) */
  READING_SPEED_WPM: 200,
  /** Maximum recommended content density (keywords/total words) */
  MAX_KEYWORD_DENSITY: 0.03, // 3%
} as const;

/**
 * Heading structure rules
 */
export const HEADING_RULES = {
  /** Recommended number of H1 tags (should be exactly 1) */
  OPTIMAL_H1_COUNT: 1,
  /** Maximum recommended H1 count */
  MAX_H1_COUNT: 1,
  /** Minimum recommended H2 count when H1 exists */
  MIN_H2_COUNT: 1,
  /** Maximum recommended heading depth */
  MAX_HEADING_DEPTH: 6,
} as const;

/**
 * Image optimization rules
 */
export const IMAGE_RULES = {
  /** Maximum acceptable percentage of images without alt text */
  MAX_MISSING_ALT_PERCENTAGE: 0.1, // 10%
  /** Minimum alt text length for descriptive text */
  MIN_ALT_TEXT_LENGTH: 10,
  /** Maximum recommended alt text length */
  MAX_ALT_TEXT_LENGTH: 125,
} as const;

/**
 * Link optimization rules
 */
export const LINK_RULES = {
  /** Minimum recommended internal links */
  MIN_INTERNAL_LINKS: 3,
  /** Maximum recommended external links (to avoid looking spammy) */
  MAX_EXTERNAL_LINKS: 10,
  /** Minimum anchor text length for descriptive links */
  MIN_ANCHOR_TEXT_LENGTH: 3,
} as const;

// ============================================================================
// SEO CHECK DEFINITIONS
// ============================================================================

/**
 * Core SEO check identifiers
 */
export const SEO_CHECK_IDS = {
  // Essential checks
  TITLE: 'title',
  DESCRIPTION: 'description',
  H1_COUNT: 'h1-count',
  H1_CONTENT: 'h1-content',
  CANONICAL: 'canonical',
  ROBOTS: 'robots',
  HTML_LANG: 'html-lang',
  CHARSET: 'charset',

  // Content checks
  WORD_COUNT: 'word-count',
  HEADING_STRUCTURE: 'heading-structure',
  CONTENT_QUALITY: 'content-quality',

  // Accessibility checks
  IMAGE_ALT: 'image-alt',
  VIEWPORT: 'viewport',

  // Social media checks
  OG_TITLE: 'og-title',
  OG_DESCRIPTION: 'og-description',
  OG_IMAGE: 'og-image',
  OG_URL: 'og-url',
  OG_TYPE: 'og-type',
  TWITTER_CARD: 'twitter-card',
  TWITTER_TITLE: 'twitter-title',
  TWITTER_DESCRIPTION: 'twitter-description',
  TWITTER_IMAGE: 'twitter-image',

  // Technical checks
  STRUCTURED_DATA: 'structured-data',
  PERFORMANCE: 'performance',
  MOBILE_FRIENDLY: 'mobile-friendly',

  // Link checks
  INTERNAL_LINKS: 'internal-links',
  EXTERNAL_LINKS: 'external-links',
  LINK_QUALITY: 'link-quality',
} as const;

/**
 * SEO check categories with their associated checks
 */
export const CHECK_CATEGORIES: Record<SEOCheckCategory, string[]> = {
  essentials: [
    SEO_CHECK_IDS.TITLE,
    SEO_CHECK_IDS.DESCRIPTION,
    SEO_CHECK_IDS.H1_COUNT,
    SEO_CHECK_IDS.CANONICAL,
    SEO_CHECK_IDS.ROBOTS,
    SEO_CHECK_IDS.HTML_LANG,
  ],
  content: [
    SEO_CHECK_IDS.WORD_COUNT,
    SEO_CHECK_IDS.HEADING_STRUCTURE,
    SEO_CHECK_IDS.CONTENT_QUALITY,
    SEO_CHECK_IDS.H1_CONTENT,
  ],
  accessibility: [
    SEO_CHECK_IDS.IMAGE_ALT,
    SEO_CHECK_IDS.VIEWPORT,
    SEO_CHECK_IDS.CHARSET,
  ],
  social: [
    SEO_CHECK_IDS.OG_TITLE,
    SEO_CHECK_IDS.OG_DESCRIPTION,
    SEO_CHECK_IDS.OG_IMAGE,
    SEO_CHECK_IDS.OG_URL,
    SEO_CHECK_IDS.OG_TYPE,
    SEO_CHECK_IDS.TWITTER_CARD,
    SEO_CHECK_IDS.TWITTER_TITLE,
    SEO_CHECK_IDS.TWITTER_DESCRIPTION,
    SEO_CHECK_IDS.TWITTER_IMAGE,
  ],
  technical: [
    SEO_CHECK_IDS.STRUCTURED_DATA,
    SEO_CHECK_IDS.CANONICAL,
    SEO_CHECK_IDS.ROBOTS,
  ],
  performance: [
    SEO_CHECK_IDS.PERFORMANCE,
  ],
  mobile: [
    SEO_CHECK_IDS.MOBILE_FRIENDLY,
    SEO_CHECK_IDS.VIEWPORT,
  ],
  links: [
    SEO_CHECK_IDS.INTERNAL_LINKS,
    SEO_CHECK_IDS.EXTERNAL_LINKS,
    SEO_CHECK_IDS.LINK_QUALITY,
  ],
};

/**
 * Critical SEO checks that significantly impact search rankings
 */
export const CRITICAL_CHECKS = [
  SEO_CHECK_IDS.TITLE,
  SEO_CHECK_IDS.DESCRIPTION,
  SEO_CHECK_IDS.H1_COUNT,
  SEO_CHECK_IDS.ROBOTS,
  SEO_CHECK_IDS.CANONICAL,
  SEO_CHECK_IDS.MOBILE_FRIENDLY,
] as const;

// ============================================================================
// STRUCTURED DATA SCHEMAS
// ============================================================================

/**
 * Common structured data types with their required properties
 */
export const STRUCTURED_DATA_SCHEMAS: Record<StructuredDataType, {
  required: string[];
  recommended: string[];
  description: string;
}> = {
  Article: {
    required: ['@type', 'headline', 'author', 'datePublished'],
    recommended: ['image', 'dateModified', 'publisher', 'mainEntityOfPage'],
    description: 'News, blog posts, and other editorial content',
  },
  Product: {
    required: ['@type', 'name'],
    recommended: ['image', 'description', 'brand', 'offers', 'aggregateRating'],
    description: 'Physical or digital products',
  },
  Organization: {
    required: ['@type', 'name'],
    recommended: ['url', 'logo', 'contactPoint', 'sameAs'],
    description: 'Companies, businesses, and organizations',
  },
  Person: {
    required: ['@type', 'name'],
    recommended: ['image', 'jobTitle', 'worksFor', 'sameAs'],
    description: 'Individual people',
  },
  WebSite: {
    required: ['@type', 'name', 'url'],
    recommended: ['potentialAction', 'sameAs'],
    description: 'Website information and search functionality',
  },
  BreadcrumbList: {
    required: ['@type', 'itemListElement'],
    recommended: [],
    description: 'Navigation breadcrumbs',
  },
  FAQ: {
    required: ['@type', 'mainEntity'],
    recommended: [],
    description: 'Frequently asked questions',
  },
  HowTo: {
    required: ['@type', 'name', 'step'],
    recommended: ['image', 'totalTime', 'estimatedCost', 'supply', 'tool'],
    description: 'Step-by-step instructions',
  },
  Recipe: {
    required: ['@type', 'name', 'recipeIngredient', 'recipeInstructions'],
    recommended: ['image', 'author', 'datePublished', 'description', 'prepTime', 'cookTime', 'nutrition'],
    description: 'Cooking recipes',
  },
  Event: {
    required: ['@type', 'name', 'startDate', 'location'],
    recommended: ['description', 'endDate', 'image', 'offers', 'performer', 'organizer'],
    description: 'Events and activities',
  },
  LocalBusiness: {
    required: ['@type', 'name', 'address'],
    recommended: ['telephone', 'openingHours', 'image', 'priceRange', 'aggregateRating'],
    description: 'Local businesses and services',
  },
  Review: {
    required: ['@type', 'itemReviewed', 'reviewRating', 'author'],
    recommended: ['datePublished', 'reviewBody'],
    description: 'Product or service reviews',
  },
  VideoObject: {
    required: ['@type', 'name', 'description', 'thumbnailUrl', 'uploadDate'],
    recommended: ['duration', 'contentUrl', 'embedUrl', 'interactionStatistic'],
    description: 'Video content',
  },
  ImageObject: {
    required: ['@type', 'contentUrl'],
    recommended: ['name', 'description', 'author', 'copyrightHolder'],
    description: 'Image content',
  },
};

// ============================================================================
// ERROR MESSAGES & RECOMMENDATIONS
// ============================================================================

/**
 * Standard error messages for SEO checks
 */
export const SEO_MESSAGES = {
  TITLE: {
    missing: 'Page title is missing. Add a descriptive <title> tag.',
    tooShort: `Title is too short (under ${TITLE_RULES.MIN_LENGTH} characters). Consider adding more descriptive text.`,
    tooLong: `Title is too long (over ${TITLE_RULES.MAX_LENGTH} characters). Google may truncate it in search results.`,
    optimal: 'Title length is optimal for search results.',
  },
  DESCRIPTION: {
    missing: 'Meta description is missing. Add a compelling description to improve click-through rates.',
    tooShort: `Description is too short (under ${DESCRIPTION_RULES.MIN_LENGTH} characters). Add more detail to entice users.`,
    tooLong: `Description is too long (over ${DESCRIPTION_RULES.MAX_LENGTH} characters). Google may truncate it.`,
    optimal: 'Meta description length is optimal.',
  },
  H1: {
    missing: 'No H1 tag found. Add a main heading to structure your content.',
    multiple: 'Multiple H1 tags found. Use only one H1 per page for better SEO.',
    optimal: 'H1 structure is optimal.',
  },
  CONTENT: {
    tooShort: `Content is too short (under ${CONTENT_RULES.MIN_WORD_COUNT} words). Consider adding more valuable content.`,
    optimal: 'Content length meets recommended guidelines.',
  },
  IMAGES: {
    missingAlt: 'Some images are missing alt text. Add descriptive alt attributes for accessibility and SEO.',
    optimal: 'All images have appropriate alt text.',
  },
  ROBOTS: {
    noindex: 'Page is set to noindex. This prevents search engines from indexing the page.',
    nofollow: 'Page is set to nofollow. This prevents search engines from following links.',
    optimal: 'Robots meta tag allows proper indexing.',
  },
} as const;

/**
 * Help URLs for SEO best practices
 */
export const HELP_URLS = {
  TITLE: 'https://developers.google.com/search/docs/appearance/title-link',
  DESCRIPTION: 'https://developers.google.com/search/docs/appearance/snippet',
  HEADINGS: 'https://developers.google.com/search/docs/appearance/structured-data',
  IMAGES: 'https://developers.google.com/search/docs/appearance/google-images',
  STRUCTURED_DATA: 'https://developers.google.com/search/docs/appearance/structured-data',
  MOBILE: 'https://developers.google.com/search/mobile-sites',
  PERFORMANCE: 'https://developers.google.com/search/docs/appearance/page-experience',
  CANONICAL: 'https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls',
  ROBOTS: 'https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag',
} as const;

// ============================================================================
// SCORING WEIGHTS
// ============================================================================

/**
 * Weights for calculating overall SEO score
 */
export const SCORE_WEIGHTS = {
  // Critical factors (higher weight)
  [SEO_CHECK_IDS.TITLE]: 15,
  [SEO_CHECK_IDS.DESCRIPTION]: 12,
  [SEO_CHECK_IDS.H1_COUNT]: 10,
  [SEO_CHECK_IDS.ROBOTS]: 10,
  [SEO_CHECK_IDS.CANONICAL]: 8,

  // Important factors (medium weight)
  [SEO_CHECK_IDS.WORD_COUNT]: 6,
  [SEO_CHECK_IDS.IMAGE_ALT]: 6,
  [SEO_CHECK_IDS.HEADING_STRUCTURE]: 5,
  [SEO_CHECK_IDS.STRUCTURED_DATA]: 5,
  [SEO_CHECK_IDS.VIEWPORT]: 5,

  // Social factors (lower weight)
  [SEO_CHECK_IDS.OG_TITLE]: 3,
  [SEO_CHECK_IDS.OG_DESCRIPTION]: 3,
  [SEO_CHECK_IDS.OG_IMAGE]: 2,
  [SEO_CHECK_IDS.TWITTER_CARD]: 2,

  // Technical factors (medium weight)
  [SEO_CHECK_IDS.HTML_LANG]: 4,
  [SEO_CHECK_IDS.INTERNAL_LINKS]: 3,
  [SEO_CHECK_IDS.EXTERNAL_LINKS]: 2,
} as const;

/**
 * Maximum possible score (sum of all weights)
 */
export const MAX_SCORE = Object.values(SCORE_WEIGHTS).reduce((sum, weight) => sum + weight, 0);

// ============================================================================
// EXPORTS
// ============================================================================

// All constants are already exported above with their definitions
