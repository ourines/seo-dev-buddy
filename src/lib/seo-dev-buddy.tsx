import React, { useState, useEffect, useCallback, ReactNode } from 'react';
// Use relative paths for components within the same package
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/ui/tooltip';
import { Button } from '../components/ui/button';
import { SearchCode, HelpCircle } from 'lucide-react';

interface H1Info {
  count: number;
  texts: string[];
}

interface OpenGraphInfo {
  title: string | null;
  description: string | null;
  image: string | null;
  url: string | null;
  type: string | null;
}

interface TwitterCardInfo {
  card: string | null;
  title: string | null;
  description: string | null;
  image: string | null;
}

interface ImageAltInfo {
  total: number;
  missingAlt: number;
}

interface HeadingStructure {
  h2: number;
  h3: number;
  h4: number;
  h5: number;
  h6: number;
}

type StatusLevel = 'error' | 'warning' | 'success';

// Helper to get meta tag content by name or property
const getMetaContent = (selector: string): string | null => {
  const element = document.querySelector<HTMLMetaElement>(selector);
  return element?.content ?? null;
};

// Helper to check description length
const checkDescriptionLength = (desc: string | undefined | null): string => {
  if (!desc) return 'Missing';
  const len = desc.length;
  if (len < 50) return `Too short (${len} chars)`;
  if (len > 160) return `Too long (${len} chars)`;
  return 'Good';
};

// Helper to format heading counts
const formatHeadingCounts = (headings: HeadingStructure): string => {
  return `H2:${headings.h2} H3:${headings.h3} H4:${headings.h4} H5:${headings.h5} H6:${headings.h6}`;
};

// Reusable Section Component
interface SeoCheckSectionProps {
  title: string;
  children: ReactNode;
}

const SeoCheckSection: React.FC<SeoCheckSectionProps> = ({ title, children }) => {
  return (
    <div
      className={`p-3 rounded-md border border-border/50`}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</h5>
      </div>
      <div className="flex flex-col text-xs">
        {children}
      </div>
    </div>
  );
};

const initialState = {
  title: '',
  description: null as string | null,
  descriptionStatus: 'N/A',
  h1Info: { count: 0, texts: [] } as H1Info,
  canonicalUrl: null as string | null,
  metaRobots: null as string | null,
  ogInfo: { title: null, description: null, image: null, url: null, type: null } as OpenGraphInfo,
  twitterInfo: { card: null, title: null, description: null, image: null } as TwitterCardInfo,
  imageAltInfo: { total: 0, missingAlt: 0 } as ImageAltInfo,
  htmlLang: null as string | null,
  viewportMeta: null as string | null,
  hasStructuredData: false,
  headingStructure: { h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 } as HeadingStructure,
  publicationDate: null as string | null,
  internalLinkCount: 0,
  externalLinkCount: 0,
  wordCount: 0,
};

// --- Explanations for Check Items ---
const itemExplanations: Record<string, string> = {
  'Title': 'The page title (<title> tag) is crucial for SEO. It appears in search results and browser tabs. Keep it concise, relevant, and include target keywords near the beginning. Aim for 50-60 characters.',
  'Description': 'The meta description provides a summary of the page in search results. Write compelling descriptions (150-160 chars) to encourage clicks. Include relevant keywords.',
  'H1 Count': 'The H1 tag should represent the main heading of the page. Best practice is to use only one H1 per page. Ensure it accurately reflects the page content.',
  'Canonical': 'A canonical URL tells search engines the preferred version of a page if multiple URLs show similar content. Helps consolidate link equity and prevent duplicate content issues.',
  'Robots': 'The meta robots tag instructs search engine crawlers (e.g., \'noindex\' to prevent indexing, \'nofollow\' to prevent following links). \'noindex\' or \'nofollow\' can severely impact visibility.',
  'HTML Lang': 'Declares the primary language of the page (e.g., \'en\' for English). Helps search engines and assistive technologies understand the content.',
  'Image Alts': 'Alt text describes images for visually impaired users and search engines. Missing alt text is bad for accessibility and SEO. Describe the image concisely.',
  'Headings': 'Heading tags (H2-H6) structure your content, making it easier to read for users and search engines. Use headings logically to outline topics. Aim for H2s under the main H1.',
  'Internal Links': 'Links to other pages on your own website. Helps users navigate and distributes link equity. A good internal linking structure is important for SEO.',
  'External Links': 'Links to pages on other websites. Can provide context and credibility, but excessive irrelevant external links might be negative. Consider \'nofollow\' for untrusted links.',
  'Word Count': 'While not a direct ranking factor, very thin content (e.g., <300 words) often struggles to rank for competitive topics. Ensure content is comprehensive and valuable.',
  'OG Title': 'Open Graph title: How the page title appears when shared on social media (e.g., Facebook). Should be compelling and accurate.',
  'OG Desc': 'Open Graph description: The summary shown when shared on social media. Aim for ~200 characters.',
  'OG Image': 'Open Graph image: The image displayed when shared on social media. Use a high-quality, relevant image (recommended 1200x630px).',
  'OG URL': 'Open Graph URL: The canonical URL of the content being shared.',
  'OG Type': 'Open Graph type: Describes the type of content (e.g., \'website\', \'article\').',
  'Twitter Card': 'Specifies the type of Twitter card to use when shared (e.g., \'summary\', \'summary_large_image\').',
  'Twitter Title': 'Title used specifically for Twitter shares. Defaults to OG Title if not set.',
  'Twitter Desc': 'Description used for Twitter shares. Defaults to OG Description if not set.',
  'Twitter Image': 'Image used for Twitter shares. Defaults to OG Image if not set.',
  'Viewport': 'The viewport meta tag controls the page layout on mobile browsers. Essential for mobile-friendliness.',
  'Structured Data': 'Schema markup (like JSON-LD) helps search engines understand the content context, potentially enabling rich snippets in search results.',
  'Publication Date': 'Indicates when an article was published (often using \'article:published_time\'). Useful for time-sensitive content and helps Google understand freshness.',
};
// --- End Explanations ---

export function SeoDevBuddy() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [seoData, setSeoData] = useState(initialState);

  // Fetch and analyze data when popover opens
  useEffect(() => {
    let timer: NodeJS.Timeout | number | undefined;

    if (isOpen) {
      setIsLoading(true);
      setSeoData(initialState);

      timer = setTimeout(() => {
        try {
          const descContent = getMetaContent('meta[name="description"]');
          const h1Elements = document.querySelectorAll('h1');
          const h1Texts = Array.from(h1Elements).map(h => h.textContent?.trim() ?? '');
          const canonicalElement = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
          const images = document.querySelectorAll('img');
          const totalImages = images.length;
          let missingAltCount = 0;
          images.forEach(img => {
            if (!img.hasAttribute('alt') || img.alt === '') {
              missingAltCount++;
            }
          });

          // --- Link Counting Logic ---
          const links = document.querySelectorAll('a');
          let internalLinks = 0;
          let externalLinks = 0;
          const currentHostname = window.location.hostname;

          links.forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
              try {
                const url = new URL(href, window.location.origin); // Resolve relative URLs
                if (url.hostname === currentHostname || href.startsWith('/') || href.startsWith('#')) {
                  internalLinks++;
                } else if (href.startsWith('http://') || href.startsWith('https://')) {
                  externalLinks++;
                }
                // Ignore mailto:, tel:, etc.
              } catch (e) {
                // Ignore invalid URLs
                if (href.startsWith('/') || href.startsWith('#')) {
                  internalLinks++; // Treat relative paths/fragments as internal
                } else if (!href.startsWith('mailto:') && !href.startsWith('tel:') && href !== '#') {
                  // Basic check for external if URL parsing failed but looks like a link
                  console.warn(`[SEO Dev Buddy] Could not parse URL: ${href}`);
                }
              }
            }
          });
          // --- End Link Counting Logic ---

          // --- Word Count Logic ---
          let mainContentElement: HTMLElement | null = null;
          const selectors = [
            'main',
            'article[role="main"]',
            'div[role="main"]',
            '#content', // Common IDs
            '#main',
            '#main-content',
            '#primary'
          ];

          for (const selector of selectors) {
            mainContentElement = document.querySelector(selector);
            if (mainContentElement) break;
          }

          let textContent = '';
          if (mainContentElement) {
            textContent = mainContentElement.innerText || mainContentElement.textContent || '';
          } else {
            // Fallback to body, trying to exclude common non-content areas
            const bodyClone = document.body.cloneNode(true) as HTMLElement;
            bodyClone.querySelectorAll('header, footer, nav, script, style, noscript, svg, aside').forEach(el => el.remove());
            textContent = bodyClone.innerText || bodyClone.textContent || '';
          }

          const wordCount = textContent.trim().split(/\s+/).filter(Boolean).length;
          // --- End Word Count Logic ---

          setSeoData({
            title: document.title,
            description: descContent,
            descriptionStatus: checkDescriptionLength(descContent),
            h1Info: { count: h1Elements.length, texts: h1Texts },
            canonicalUrl: canonicalElement?.href ?? null,
            metaRobots: getMetaContent('meta[name="robots"]'),
            ogInfo: {
              title: getMetaContent('meta[property="og:title"]'),
              description: getMetaContent('meta[property="og:description"]'),
              image: getMetaContent('meta[property="og:image"]'),
              url: getMetaContent('meta[property="og:url"]'),
              type: getMetaContent('meta[property="og:type"]'),
            },
            twitterInfo: {
              card: getMetaContent('meta[name="twitter:card"]'),
              title: getMetaContent('meta[name="twitter:title"]'),
              description: getMetaContent('meta[name="twitter:description"]'),
              image: getMetaContent('meta[name="twitter:image"]'),
            },
            imageAltInfo: { total: totalImages, missingAlt: missingAltCount },
            htmlLang: document.documentElement.getAttribute('lang'),
            viewportMeta: getMetaContent('meta[name="viewport"]'),
            hasStructuredData: !!document.querySelector('script[type="application/ld+json"]'),
            publicationDate: getMetaContent('meta[property="article:published_time"]'),
            headingStructure: {
              h2: document.querySelectorAll('h2').length,
              h3: document.querySelectorAll('h3').length,
              h4: document.querySelectorAll('h4').length,
              h5: document.querySelectorAll('h5').length,
              h6: document.querySelectorAll('h6').length,
            },
            internalLinkCount: internalLinks,
            externalLinkCount: externalLinks,
            wordCount: wordCount,
          });
        } catch (error) {
          console.error("[SEO Dev Buddy] Error during analysis:", error);
        } finally {
          setIsLoading(false);
        }
      }, 150);

      return () => {
        if (timer) {
          clearTimeout(timer);
        }
      };
    } else {
      setSeoData(initialState);
      setIsLoading(true);
    }
  }, [isOpen]);

  // Effect to prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Function to determine status level based on label and value
  const getItemStatusLevel = useCallback((label: string, statusValue: any): StatusLevel => {
    // Define mandatory fields that trigger a warning if missing
    const mandatoryFields = [
      'Title', 'Description', 'H1 Count', 'Canonical', 'Robots',
      'OG Title', 'OG Desc', 'OG Image', 'OG URL', 'OG Type',
      'Twitter Card', 'Twitter Title', 'Twitter Desc', 'Twitter Image',
      'HTML Lang', 'Viewport'
    ];

    // Check for missing/null/undefined status
    if (statusValue === null || statusValue === undefined || statusValue === 'Missing') {
      // Special case for description where 'Missing' is derived, not just null/undefined
      if (label === 'Description' && statusValue === 'Missing') return 'warning';
      return mandatoryFields.includes(label) ? 'warning' : 'success';
    }

    // Specific Checks
    switch (label) {
      case 'Title':
        return statusValue ? 'success' : 'warning';
      case 'Description':
        return statusValue === 'Good' ? 'success' : 'warning';
      case 'H1 Count':
        return statusValue === 1 ? 'success' : 'warning';
      case 'Robots':
        const valueString = String(statusValue).toLowerCase();
        return (valueString.includes('noindex') || valueString.includes('nofollow') || valueString.includes('none')) ? 'error' : 'success';
      case 'Image Alts':
        const info = statusValue as ImageAltInfo;
        if (info.total === 0) return 'success';
        if (info.missingAlt === info.total && info.total > 0) return 'error';
        if (info.missingAlt > 0) return 'warning';
        return 'success';
      case 'HTML Lang':
      case 'Viewport':
      case 'Canonical':
      case 'OG Title':
      case 'OG Desc':
      case 'OG Image':
      case 'OG URL':
      case 'OG Type':
      case 'Twitter Card':
      case 'Twitter Title':
      case 'Twitter Desc':
      case 'Twitter Image':
        return statusValue ? 'success' : 'warning';
      case 'Structured Data':
        return statusValue ? 'success' : 'warning'; // Warn if not detected
      case 'Headings':
        // Add warning if H1 exists but no H2 tags are found
        const headings = statusValue as HeadingStructure;
        const h1Exists = seoData.h1Info.count > 0; // Check if H1 exists from seoData state
        if (h1Exists && headings.h2 === 0) {
          return 'warning';
        }
        return 'success';
      case 'Publication Date':
        return statusValue ? 'success' : 'success'; // Success if present, also success (neutral) if absent
      case 'Internal Links':
      case 'External Links':
        return 'success';
      case 'Word Count':
        return statusValue >= 300 ? 'success' : 'warning'; // Warn if less than 300 words
      default:
        return 'success';
    }
  }, [seoData.h1Info.count]);

  // Function to render a single check item
  const renderCheckItem = useCallback((
    label: string,
    displayValue: string | number | null | undefined,
    details?: ReactNode
  ) => {
    // --- Calculate item status ---
    // Determine the correct value to check for status
    let valueToCheck: any;
    if (label === 'Description') {
      valueToCheck = seoData.descriptionStatus;
    } else if (label === 'H1 Count') {
      valueToCheck = seoData.h1Info.count;
    } else if (label === 'Image Alts') {
      valueToCheck = seoData.imageAltInfo;
    } else {
      // Simplification: Find the corresponding value in seoData based on label
      // This is a basic mapping, might need refinement for complex cases
      const keyMap: { [key: string]: keyof typeof seoData | null } = {
        'Title': 'title',
        'Canonical': 'canonicalUrl',
        'Robots': 'metaRobots',
        'HTML Lang': 'htmlLang',
        'Headings': 'headingStructure', // Value needed for status check, not display
        'OG Title': 'ogInfo',
        'OG Desc': 'ogInfo',
        'OG Image': 'ogInfo',
        'OG URL': 'ogInfo',
        'OG Type': 'ogInfo',
        'Twitter Card': 'twitterInfo',
        'Twitter Title': 'twitterInfo',
        'Twitter Desc': 'twitterInfo',
        'Twitter Image': 'twitterInfo',
        'Viewport': 'viewportMeta',
        'Structured Data': 'hasStructuredData',
        'Publication Date': 'publicationDate',
        'Internal Links': 'internalLinkCount',
        'External Links': 'externalLinkCount',
        'Word Count': 'wordCount',
      };
      const dataKey = keyMap[label];

      if (dataKey) {
        if (label.startsWith('OG')) {
          valueToCheck = seoData.ogInfo[label.split(' ')[1].toLowerCase() as keyof OpenGraphInfo];
        } else if (label.startsWith('Twitter')) {
          valueToCheck = seoData.twitterInfo[label.split(' ')[1].toLowerCase() as keyof TwitterCardInfo];
        } else {
          valueToCheck = seoData[dataKey as keyof typeof initialState];
        }
      } else {
        valueToCheck = displayValue; // Fallback if no specific logic
      }

    }
    const itemStatus = getItemStatusLevel(label, valueToCheck);
    // --- End item status calculation ---

    const finalDisplayValue = displayValue ?? <span className="text-muted-foreground/70">N/A</span>;
    const explanation = itemExplanations[label]; // Get explanation text

    return (
      <div
        className={`flex flex-col px-2 py-2 border-b border-border/50 last:border-b-0`}
        style={{
          backgroundColor: itemStatus === 'error' ? 'rgba(254, 202, 202, 0.4)' : itemStatus === 'warning' ? 'rgba(254, 240, 138, 0.4)' : undefined,
        }}
      >
        <div className="flex items-start gap-x-2">
          {/* Label and Optional Tooltip */}
          <span className="font-medium text-foreground/80 flex-shrink-0 whitespace-nowrap pt-px flex items-center gap-1">
            {label}:
            {explanation && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3 w-3 text-muted-foreground hover:text-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent
                  className="break-words text-xs bg-popover text-popover-foreground border border-border p-2 rounded shadow-lg"
                  style={{ width: '300px' }}
                >
                  <p>{explanation}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </span>
          {/* Value */}
          <span className="text-foreground break-words overflow-hidden flex-grow pt-px text-left">
            {finalDisplayValue}
          </span>
        </div>
        {details && (
          <div className="pl-[calc(1em+8px)] mt-0.5 text-xs">
            {details}
          </div>
        )}
      </div>
    );
  }, [getItemStatusLevel, seoData]);

  // --- Prepare details nodes (only when not loading) ---
  const descriptionDetails = !isLoading && seoData.descriptionStatus !== 'N/A' && seoData.descriptionStatus !== 'Good' && (
    <div className="text-yellow-600 dark:text-yellow-400 text-[11px]">(Status: {seoData.descriptionStatus})</div>
  );

  const h1Details = !isLoading && seoData.h1Info.texts.length > 0 && (
    // Only show details if count is not 1 (warning/error state for count)
    (getItemStatusLevel('H1 Count', seoData.h1Info.count) !== 'success') && (
      <div className="text-muted-foreground/80 text-[11px]" title={seoData.h1Info.texts.join(', ')}>
        Content: {seoData.h1Info.texts[0]}{seoData.h1Info.texts.length > 1 ? ` (+${seoData.h1Info.texts.length - 1} more)` : ''}
      </div>
    )
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 border border-primary-foreground/20"
          aria-label="Open SEO Dev Buddy"
        >
          <SearchCode className="h-6 w-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        style={{ maxWidth: '420px' }}
        className="mr-4 mb-2 bg-background shadow-xl border border-border rounded-lg text-foreground text-sm max-h-[60vh] overflow-y-auto p-0"
        side="top"
        align="end"
        onOpenAutoFocus={(e: Event) => e.preventDefault()}
      >
        <div className="flex flex-col">
          {/* Header */}
          <div className="p-3 pb-2 space-y-1 border-b border-border sticky top-0 bg-background z-10">
            <h4 className="font-semibold leading-none text-lg">SEO Dev Buddy</h4>
            <p className="text-xs text-muted-foreground">
              On-page analysis (Dev Mode)
            </p>
          </div>

          {/* Conditional Rendering based on isLoading */}
          {isLoading ? (
            <div className="p-6 text-center text-muted-foreground">
              Analyzing...
            </div>
          ) : (
            <TooltipProvider delayDuration={300}>
              <div className="p-3 flex flex-col gap-3">
                <SeoCheckSection title="Essentials">
                  {renderCheckItem('Title', seoData.title)}
                  {renderCheckItem('Description', seoData.description, descriptionDetails)}
                  {renderCheckItem('H1 Count', seoData.h1Info.count, h1Details)}
                  {renderCheckItem('Canonical', seoData.canonicalUrl)}
                  {renderCheckItem('Robots', seoData.metaRobots)}
                  {renderCheckItem('HTML Lang', seoData.htmlLang)}
                </SeoCheckSection>

                <SeoCheckSection title="Content & Accessibility">
                  {renderCheckItem('Image Alts', `${seoData.imageAltInfo.missingAlt} missing / ${seoData.imageAltInfo.total} total`)}
                  {renderCheckItem('Headings', formatHeadingCounts(seoData.headingStructure))}
                  {renderCheckItem('Internal Links', seoData.internalLinkCount)}
                  {renderCheckItem('External Links', seoData.externalLinkCount)}
                  {renderCheckItem('Word Count', seoData.wordCount)}
                </SeoCheckSection>

                <SeoCheckSection title="Open Graph">
                  {renderCheckItem('OG Title', seoData.ogInfo.title)}
                  {renderCheckItem('OG Desc', seoData.ogInfo.description)}
                  {renderCheckItem('OG Image', seoData.ogInfo.image)}
                  {renderCheckItem('OG URL', seoData.ogInfo.url)}
                  {renderCheckItem('OG Type', seoData.ogInfo.type)}
                </SeoCheckSection>

                <SeoCheckSection title="Twitter Card">
                  {renderCheckItem('Twitter Card', seoData.twitterInfo.card)}
                  {renderCheckItem('Twitter Title', seoData.twitterInfo.title)}
                  {renderCheckItem('Twitter Desc', seoData.twitterInfo.description)}
                  {renderCheckItem('Twitter Image', seoData.twitterInfo.image)}
                </SeoCheckSection>

                <SeoCheckSection title="Technical SEO">
                  {renderCheckItem('Viewport', seoData.viewportMeta)}
                  {renderCheckItem('Structured Data', seoData.hasStructuredData ? 'Detected' : 'Not Detected')}
                  {renderCheckItem('Publication Date', seoData.publicationDate)}
                </SeoCheckSection>
              </div>
            </TooltipProvider>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
