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
 * Enhanced error messages with detailed recommendations and action steps
 */
export const SEO_MESSAGES = {
  TITLE: {
    missing: {
      message: 'Page title is missing. Add a descriptive <title> tag.',
      recommendation: 'Add a unique, descriptive title that accurately represents the page content.',
      actionSteps: [
        'Add a <title> tag in the <head> section',
        'Keep it between 30-60 characters',
        'Include your primary keyword near the beginning',
        'Make it unique for each page',
        'Write for users, not just search engines'
      ],
      priority: 'critical',
      impact: 'high',
      effort: 'low'
    },
    tooShort: {
      message: `Title is too short (under ${TITLE_RULES.MIN_LENGTH} characters). Consider adding more descriptive text.`,
      recommendation: 'Expand your title to provide more context and include relevant keywords.',
      actionSteps: [
        'Add descriptive words that explain what the page is about',
        'Include your primary keyword if not already present',
        'Consider adding your brand name at the end',
        'Aim for 50-60 characters for optimal display'
      ],
      priority: 'high',
      impact: 'medium',
      effort: 'low'
    },
    tooLong: {
      message: `Title is too long (over ${TITLE_RULES.MAX_LENGTH} characters). Google may truncate it in search results.`,
      recommendation: 'Shorten your title while keeping the most important keywords at the beginning.',
      actionSteps: [
        'Remove unnecessary words and filler text',
        'Keep the most important keywords at the start',
        'Consider moving brand name to the end or removing it',
        'Test how it appears in search results'
      ],
      priority: 'medium',
      impact: 'medium',
      effort: 'low'
    },
    optimal: {
      message: 'Title length is optimal for search results.',
      recommendation: 'Your title follows best practices. Ensure it accurately represents your content.',
      actionSteps: [
        'Verify the title matches your page content',
        'Consider A/B testing different variations',
        'Monitor click-through rates in search results'
      ],
      priority: 'low',
      impact: 'low',
      effort: 'low'
    }
  },
  DESCRIPTION: {
    missing: {
      message: 'Meta description is missing. Add a compelling description to improve click-through rates.',
      recommendation: 'Write a compelling meta description that summarizes your page content and encourages clicks.',
      actionSteps: [
        'Add a <meta name="description" content="..."> tag',
        'Write 150-160 characters of compelling copy',
        'Include your primary keyword naturally',
        'Focus on benefits and value proposition',
        'Include a call-to-action when appropriate'
      ],
      priority: 'critical',
      impact: 'high',
      effort: 'low'
    },
    tooShort: {
      message: `Description is too short (under ${DESCRIPTION_RULES.MIN_LENGTH} characters). Add more detail to entice users.`,
      recommendation: 'Expand your description to provide more compelling reasons for users to click.',
      actionSteps: [
        'Add more details about what users will find on the page',
        'Include benefits and value propositions',
        'Mention key features or unique selling points',
        'Use action-oriented language'
      ],
      priority: 'medium',
      impact: 'medium',
      effort: 'low'
    },
    tooLong: {
      message: `Description is too long (over ${DESCRIPTION_RULES.MAX_LENGTH} characters). Google may truncate it.`,
      recommendation: 'Shorten your description while keeping the most compelling information at the beginning.',
      actionSteps: [
        'Move the most important information to the beginning',
        'Remove redundant or less important details',
        'Ensure the truncated version still makes sense',
        'Test how it appears in search results'
      ],
      priority: 'medium',
      impact: 'medium',
      effort: 'low'
    },
    optimal: {
      message: 'Meta description length is optimal.',
      recommendation: 'Your description length is good. Ensure it\'s compelling and relevant.',
      actionSteps: [
        'Review if it accurately represents your content',
        'Consider testing different variations',
        'Monitor click-through rates from search results'
      ],
      priority: 'low',
      impact: 'low',
      effort: 'low'
    }
  },
  H1: {
    missing: {
      message: 'No H1 tag found. Add a main heading to structure your content.',
      recommendation: 'Add a single, descriptive H1 tag that clearly indicates what the page is about.',
      actionSteps: [
        'Add an <h1> tag with your main page topic',
        'Make it descriptive and include your primary keyword',
        'Ensure it\'s different from your title tag',
        'Use only one H1 per page',
        'Follow with H2, H3 tags for content hierarchy'
      ],
      priority: 'critical',
      impact: 'high',
      effort: 'low'
    },
    multiple: {
      message: 'Multiple H1 tags found. Use only one H1 per page for better SEO.',
      recommendation: 'Convert additional H1 tags to H2 or H3 tags to create proper heading hierarchy.',
      actionSteps: [
        'Keep only the most important H1 tag',
        'Convert other H1 tags to H2 or H3',
        'Ensure proper heading hierarchy (H1 > H2 > H3)',
        'Make sure each heading is descriptive',
        'Review content structure for logical flow'
      ],
      priority: 'high',
      impact: 'medium',
      effort: 'low'
    },
    optimal: {
      message: 'H1 structure is optimal.',
      recommendation: 'Your H1 structure follows best practices. Ensure it accurately represents your content.',
      actionSteps: [
        'Verify H1 content matches page topic',
        'Check that it includes relevant keywords',
        'Ensure it\'s engaging for users'
      ],
      priority: 'low',
      impact: 'low',
      effort: 'low'
    }
  },
  CONTENT: {
    tooShort: {
      message: `Content is too short (under ${CONTENT_RULES.MIN_WORD_COUNT} words). Consider adding more valuable content.`,
      recommendation: 'Expand your content to provide more comprehensive information on your topic.',
      actionSteps: [
        'Add more detailed explanations and examples',
        'Include relevant subtopics and related information',
        'Add supporting data, statistics, or case studies',
        'Consider adding FAQ sections',
        'Ensure all content adds value for users'
      ],
      priority: 'medium',
      impact: 'high',
      effort: 'high'
    },
    optimal: {
      message: 'Content length meets recommended guidelines.',
      recommendation: 'Your content length is good. Focus on quality and user value.',
      actionSteps: [
        'Ensure content is well-structured and scannable',
        'Add relevant internal and external links',
        'Include multimedia elements when appropriate',
        'Regularly update content to keep it fresh'
      ],
      priority: 'low',
      impact: 'medium',
      effort: 'medium'
    }
  },
  IMAGES: {
    missingAlt: {
      message: 'Some images are missing alt text. Add descriptive alt attributes for accessibility and SEO.',
      recommendation: 'Add descriptive alt text to all images to improve accessibility and help search engines understand your content.',
      actionSteps: [
        'Add alt="" attributes to all <img> tags',
        'Write descriptive text that explains what\'s in the image',
        'Include relevant keywords naturally',
        'Keep alt text under 125 characters',
        'Use empty alt="" for decorative images'
      ],
      priority: 'medium',
      impact: 'medium',
      effort: 'medium'
    },
    optimal: {
      message: 'All images have appropriate alt text.',
      recommendation: 'Your image optimization is good. Ensure alt text is descriptive and relevant.',
      actionSteps: [
        'Review alt text for accuracy and relevance',
        'Ensure alt text includes relevant keywords naturally',
        'Consider adding captions for important images'
      ],
      priority: 'low',
      impact: 'low',
      effort: 'low'
    }
  },
  ROBOTS: {
    noindex: {
      message: 'Page is set to noindex. This prevents search engines from indexing the page.',
      recommendation: 'Remove noindex directive if you want this page to appear in search results.',
      actionSteps: [
        'Remove or modify the robots meta tag',
        'Change "noindex" to "index" if appropriate',
        'Verify this page should be indexed',
        'Check for conflicting directives in robots.txt',
        'Monitor indexing status in Search Console'
      ],
      priority: 'critical',
      impact: 'high',
      effort: 'low'
    },
    nofollow: {
      message: 'Page is set to nofollow. This prevents search engines from following links.',
      recommendation: 'Remove nofollow directive if you want search engines to follow links on this page.',
      actionSteps: [
        'Remove or modify the robots meta tag',
        'Change "nofollow" to "follow" if appropriate',
        'Review if this setting is intentional',
        'Consider impact on link equity distribution'
      ],
      priority: 'medium',
      impact: 'medium',
      effort: 'low'
    },
    optimal: {
      message: 'Robots meta tag allows proper indexing.',
      recommendation: 'Your robots configuration is appropriate for search engine indexing.',
      actionSteps: [
        'Monitor indexing status in Search Console',
        'Ensure robots.txt doesn\'t conflict with meta robots',
        'Review periodically for any needed changes'
      ],
      priority: 'low',
      impact: 'low',
      effort: 'low'
    }
  },
  CANONICAL: {
    missing: {
      message: 'Canonical URL is missing. Add a canonical tag to prevent duplicate content issues.',
      recommendation: 'Add a canonical link tag to specify the preferred version of this page.',
      actionSteps: [
        'Add <link rel="canonical" href="..."> in the <head>',
        'Use the full, absolute URL',
        'Ensure it points to the preferred version',
        'Use HTTPS if available',
        'Include trailing slashes consistently'
      ],
      priority: 'medium',
      impact: 'medium',
      effort: 'low'
    },
    invalid: {
      message: 'Canonical URL appears to be invalid or malformed.',
      recommendation: 'Fix the canonical URL to ensure it points to a valid, accessible page.',
      actionSteps: [
        'Verify the canonical URL is accessible',
        'Use absolute URLs instead of relative ones',
        'Ensure proper URL encoding',
        'Check for typos in the URL',
        'Test the canonical URL in a browser'
      ],
      priority: 'high',
      impact: 'medium',
      effort: 'low'
    },
    optimal: {
      message: 'Canonical URL is properly configured.',
      recommendation: 'Your canonical URL setup helps prevent duplicate content issues.',
      actionSteps: [
        'Verify canonical URLs are accessible',
        'Monitor for any crawl errors in Search Console',
        'Ensure consistency across similar pages'
      ],
      priority: 'low',
      impact: 'low',
      effort: 'low'
    }
  },
  VIEWPORT: {
    missing: {
      message: 'Viewport meta tag is missing. Add it for mobile-friendly display.',
      recommendation: 'Add a viewport meta tag to ensure your page displays correctly on mobile devices.',
      actionSteps: [
        'Add <meta name="viewport" content="width=device-width, initial-scale=1"> to <head>',
        'Test page display on various mobile devices',
        'Ensure responsive design works properly',
        'Use Mobile-Friendly Test tool to verify'
      ],
      priority: 'high',
      impact: 'high',
      effort: 'low'
    },
    optimal: {
      message: 'Viewport meta tag is properly configured for mobile devices.',
      recommendation: 'Your mobile configuration follows best practices.',
      actionSteps: [
        'Test on various mobile devices and screen sizes',
        'Ensure touch targets are appropriately sized',
        'Verify text is readable without zooming'
      ],
      priority: 'low',
      impact: 'low',
      effort: 'low'
    }
  },
  SOCIAL: {
    ogMissing: {
      message: 'Open Graph tags are missing. Add them to improve social media sharing.',
      recommendation: 'Add Open Graph meta tags to control how your page appears when shared on social media.',
      actionSteps: [
        'Add og:title, og:description, og:image, og:url meta tags',
        'Use compelling titles and descriptions for social sharing',
        'Include high-quality images (1200x630px recommended)',
        'Test sharing appearance on Facebook and LinkedIn'
      ],
      priority: 'medium',
      impact: 'medium',
      effort: 'medium'
    },
    twitterMissing: {
      message: 'Twitter Card tags are missing. Add them to improve Twitter sharing.',
      recommendation: 'Add Twitter Card meta tags to optimize how your page appears when shared on Twitter.',
      actionSteps: [
        'Add twitter:card, twitter:title, twitter:description meta tags',
        'Include twitter:image for visual appeal',
        'Choose appropriate card type (summary, summary_large_image)',
        'Test with Twitter Card Validator'
      ],
      priority: 'low',
      impact: 'medium',
      effort: 'medium'
    }
  },
  STRUCTURED_DATA: {
    missing: {
      message: 'No structured data found. Consider adding Schema.org markup.',
      recommendation: 'Add structured data to help search engines understand your content better.',
      actionSteps: [
        'Identify appropriate Schema.org types for your content',
        'Add JSON-LD structured data to your page',
        'Include required and recommended properties',
        'Test with Google\'s Rich Results Test tool',
        'Monitor for rich snippet opportunities'
      ],
      priority: 'low',
      impact: 'medium',
      effort: 'high'
    },
    invalid: {
      message: 'Structured data contains errors or invalid markup.',
      recommendation: 'Fix structured data errors to ensure search engines can process it correctly.',
      actionSteps: [
        'Use Google\'s Rich Results Test to identify errors',
        'Fix syntax errors in JSON-LD markup',
        'Ensure all required properties are included',
        'Validate against Schema.org specifications',
        'Test after making corrections'
      ],
      priority: 'medium',
      impact: 'medium',
      effort: 'medium'
    }
  }
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
