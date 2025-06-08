/**
 * SEO Dev Buddy - Core Type Definitions
 *
 * This file contains all the TypeScript interfaces and types used throughout
 * the SEO Dev Buddy plugin, following Google Search best practices.
 */

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

/**
 * SEO check status levels based on severity
 */
export type SEOStatusLevel = 'error' | 'warning' | 'success' | 'info';

/**
 * SEO check categories for organizing different types of checks
 */
export type SEOCheckCategory =
  | 'essentials'      // Title, Description, H1, etc.
  | 'content'         // Content quality, word count, headings
  | 'accessibility'   // Alt text, lang attributes, etc.
  | 'social'          // Open Graph, Twitter Cards
  | 'technical'       // Canonical, robots, structured data
  | 'performance'     // Page speed related SEO factors
  | 'mobile'          // Mobile-friendliness
  | 'links';          // Internal/external links

/**
 * Supported structured data types
 */
export type StructuredDataType =
  | 'Article'
  | 'Product'
  | 'Organization'
  | 'Person'
  | 'WebSite'
  | 'BreadcrumbList'
  | 'FAQ'
  | 'HowTo'
  | 'Recipe'
  | 'Event'
  | 'LocalBusiness'
  | 'Review'
  | 'VideoObject'
  | 'ImageObject';

// ============================================================================
// BASIC DATA STRUCTURES
// ============================================================================

/**
 * Basic information about HTML headings (H1-H6)
 */
export interface HeadingInfo {
  /** Heading level (1-6) */
  level: number;
  /** Text content of the heading */
  text: string;
  /** Whether the heading has proper hierarchy */
  hasProperHierarchy: boolean;
  /** Position in the document (for ordering) */
  position: number;
}

/**
 * Information about H1 tags specifically
 */
export interface H1Info {
  /** Number of H1 tags found */
  count: number;
  /** Text content of all H1 tags */
  texts: string[];
  /** Whether H1 count follows best practices (should be 1) */
  isOptimal: boolean;
}

/**
 * Heading structure analysis
 */
export interface HeadingStructure {
  /** H1 information */
  h1: H1Info;
  /** Count of H2 tags */
  h2: number;
  /** Count of H3 tags */
  h3: number;
  /** Count of H4 tags */
  h4: number;
  /** Count of H5 tags */
  h5: number;
  /** Count of H6 tags */
  h6: number;
  /** All headings with detailed info */
  allHeadings: HeadingInfo[];
  /** Whether heading hierarchy is logical */
  hasLogicalHierarchy: boolean;
}

/**
 * Image accessibility information
 */
export interface ImageAltInfo {
  /** Total number of images */
  total: number;
  /** Number of images missing alt text */
  missingAlt: number;
  /** Number of images with empty alt text */
  emptyAlt: number;
  /** Number of images with descriptive alt text */
  descriptiveAlt: number;
  /** Percentage of images with proper alt text */
  altTextCoverage: number;
}

/**
 * Link analysis information
 */
export interface LinkInfo {
  /** Total number of internal links */
  internal: number;
  /** Total number of external links */
  external: number;
  /** Number of broken links (if detectable) */
  broken?: number;
  /** Links without descriptive text */
  nonDescriptive: number;
  /** Links that open in new window/tab */
  newWindow: number;
}

/**
 * Content analysis metrics
 */
export interface ContentMetrics {
  /** Total word count */
  wordCount: number;
  /** Reading time estimate (minutes) */
  readingTime: number;
  /** Content density score */
  density: number;
  /** Whether content meets minimum length requirements */
  meetsMinLength: boolean;
}

// ============================================================================
// META DATA STRUCTURES
// ============================================================================

/**
 * Open Graph meta data
 */
export interface OpenGraphInfo {
  /** OG title */
  title: string | null;
  /** OG description */
  description: string | null;
  /** OG image URL */
  image: string | null;
  /** OG URL */
  url: string | null;
  /** OG type (website, article, etc.) */
  type: string | null;
  /** OG site name */
  siteName: string | null;
  /** OG locale */
  locale: string | null;
}

/**
 * Twitter Card meta data
 */
export interface TwitterCardInfo {
  /** Twitter card type */
  card: string | null;
  /** Twitter title */
  title: string | null;
  /** Twitter description */
  description: string | null;
  /** Twitter image URL */
  image: string | null;
  /** Twitter site handle */
  site: string | null;
  /** Twitter creator handle */
  creator: string | null;
}

/**
 * Basic meta tag information
 */
export interface MetaTagInfo {
  /** Page title */
  title: string;
  /** Meta description */
  description: string | null;
  /** Meta keywords (deprecated but still checked) */
  keywords: string | null;
  /** Meta robots directives */
  robots: string | null;
  /** Canonical URL */
  canonical: string | null;
  /** HTML lang attribute */
  htmlLang: string | null;
  /** Viewport meta tag */
  viewport: string | null;
  /** Character encoding */
  charset: string | null;
}

// ============================================================================
// STRUCTURED DATA
// ============================================================================

/**
 * Structured data item
 */
export interface StructuredDataItem {
  /** Schema.org type */
  type: StructuredDataType;
  /** Raw JSON-LD data */
  data: Record<string, any>;
  /** Whether the structured data is valid */
  isValid: boolean;
  /** Validation errors if any */
  errors: string[];
  /** Position in the document */
  position: number;
}

/**
 * Structured data analysis
 */
export interface StructuredDataInfo {
  /** Whether any structured data is present */
  hasStructuredData: boolean;
  /** All structured data items found */
  items: StructuredDataItem[];
  /** Count by type */
  typeCount: Record<StructuredDataType, number>;
  /** Overall validation status */
  isValid: boolean;
  /** Global validation errors */
  globalErrors: string[];
}

// ============================================================================
// SEO CHECK RESULTS
// ============================================================================

/**
 * Individual SEO check result
 */
export interface SEOCheckResult {
  /** Unique identifier for the check */
  id: string;
  /** Human-readable label */
  label: string;
  /** Check category */
  category: SEOCheckCategory;
  /** Status level */
  status: SEOStatusLevel;
  /** Current value */
  value: any;
  /** Display value (formatted for UI) */
  displayValue: string;
  /** Detailed explanation */
  description: string;
  /** Recommendation for improvement */
  recommendation: string;
  /** Whether this check is critical for SEO */
  isCritical: boolean;
  /** Additional details or context */
  details?: Record<string, any>;
  /** Help URL for more information */
  helpUrl?: string;
}

/**
 * SEO analysis report
 */
export interface SEOReport {
  /** Timestamp of the analysis */
  timestamp: Date;
  /** URL that was analyzed */
  url: string;
  /** Page title */
  pageTitle: string;
  /** Overall SEO score (0-100) */
  overallScore: number;
  /** All individual check results */
  checks: SEOCheckResult[];
  /** Grouped checks by category */
  checksByCategory: Record<SEOCheckCategory, SEOCheckResult[]>;
  /** Summary statistics */
  summary: {
    total: number;
    passed: number;
    warnings: number;
    errors: number;
    critical: number;
  };
  /** Raw data used for analysis */
  rawData: {
    metaTags: MetaTagInfo;
    headings: HeadingStructure;
    images: ImageAltInfo;
    links: LinkInfo;
    content: ContentMetrics;
    openGraph: OpenGraphInfo;
    twitterCard: TwitterCardInfo;
    structuredData: StructuredDataInfo;
  };
}

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Configuration for individual SEO checks
 */
export interface SEOCheckConfig {
  /** Whether this check is enabled */
  enabled: boolean;
  /** Custom thresholds or parameters */
  params?: Record<string, any>;
  /** Custom error messages */
  messages?: {
    error?: string;
    warning?: string;
    success?: string;
  };
}

/**
 * Plugin configuration options
 */
export interface SEODevBuddyConfig {
  /** Whether the plugin is enabled */
  enabled: boolean;
  /** Position of the floating button */
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** Theme preference */
  theme: 'light' | 'dark' | 'auto';
  /** Whether to show the plugin in production */
  showInProduction: boolean;
  /** Custom CSS selector for main content area */
  contentSelector?: string;
  /** Minimum word count threshold */
  minWordCount: number;
  /** Maximum meta description length */
  maxDescriptionLength: number;
  /** Maximum title length */
  maxTitleLength: number;
  /** Configuration for individual checks */
  checks: Record<string, SEOCheckConfig>;
  /** Custom rules or overrides */
  customRules?: Record<string, any>;
  /** Debug mode */
  debug: boolean;
}

/**
 * Default configuration
 */
export const DEFAULT_CONFIG: SEODevBuddyConfig = {
  enabled: true,
  position: 'bottom-right',
  theme: 'auto',
  showInProduction: false,
  minWordCount: 300,
  maxDescriptionLength: 160,
  maxTitleLength: 60,
  checks: {},
  debug: false,
};

// ============================================================================
// PLUGIN API
// ============================================================================

/**
 * Plugin initialization options
 */
export interface PluginOptions {
  /** Plugin configuration */
  config?: Partial<SEODevBuddyConfig>;
  /** Custom check implementations */
  customChecks?: Record<string, (data: any) => SEOCheckResult>;
  /** Event callbacks */
  callbacks?: {
    onAnalysisStart?: () => void;
    onAnalysisComplete?: (report: SEOReport) => void;
    onError?: (error: Error) => void;
  };
}

/**
 * Plugin instance interface
 */
export interface SEODevBuddyInstance {
  /** Initialize the plugin */
  init(options?: PluginOptions): void;
  /** Run SEO analysis */
  analyze(): Promise<SEOReport>;
  /** Get current configuration */
  getConfig(): SEODevBuddyConfig;
  /** Update configuration */
  updateConfig(config: Partial<SEODevBuddyConfig>): void;
  /** Show/hide the plugin UI */
  toggle(visible?: boolean): void;
  /** Destroy the plugin instance */
  destroy(): void;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Utility type for partial SEO report (used during analysis)
 */
export type PartialSEOReport = Partial<SEOReport>;

/**
 * Utility type for check result without computed fields
 */
export type SEOCheckInput = Omit<SEOCheckResult, 'status' | 'displayValue'>;

/**
 * Event types for plugin lifecycle
 */
export type SEOEventType =
  | 'init'
  | 'analysis-start'
  | 'analysis-complete'
  | 'analysis-error'
  | 'config-update'
  | 'destroy';

/**
 * Event data structure
 */
export interface SEOEvent<T = any> {
  type: SEOEventType;
  timestamp: Date;
  data?: T;
}

// ============================================================================
// EXPORTS
// ============================================================================

// All types are already exported above with their definitions
// No need for re-export since they're already exported individually
