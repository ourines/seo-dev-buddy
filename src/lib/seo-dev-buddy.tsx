import React, { useState, useEffect } from 'react';
// Use relative paths for components within the same package
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/ui/popover';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { SearchCode, AlertCircle, CheckCircle, MinusCircle, XCircle } from 'lucide-react';


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

// New interface for Twitter Card info
interface TwitterCardInfo {
  card: string | null;
  title: string | null;
  description: string | null;
  image: string | null;
}

// New interface for Image Alt info
interface ImageAltInfo {
  total: number;
  missingAlt: number;
}

// Basic SEO checks utility
const checkDescriptionLength = (desc: string | undefined | null): string => {
  if (!desc) return 'Missing';
  if (desc.length < 50) return `Too short (${desc.length} chars)`; // Example thresholds
  if (desc.length > 160) return `Too long (${desc.length} chars)`;
  return 'Good';
};

// Helper to get meta tag content by name or property
const getMetaContent = (selector: string): string | null => {
  const element = document.querySelector<HTMLMetaElement>(selector);
  return element?.content ?? null;
};

export function SeoDevBuddy() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string | null>(null);
  const [descriptionStatus, setDescriptionStatus] = useState<string>('N/A');
  const [h1Info, setH1Info] = useState<H1Info>({ count: 0, texts: [] });
  const [canonicalUrl, setCanonicalUrl] = useState<string | null>(null);
  const [metaRobots, setMetaRobots] = useState<string | null>(null);
  const [ogInfo, setOgInfo] = useState<OpenGraphInfo>({
    title: null,
    description: null,
    image: null,
    url: null,
    type: null,
  });
  // New state variables
  const [twitterInfo, setTwitterInfo] = useState<TwitterCardInfo>({
    card: null,
    title: null,
    description: null,
    image: null,
  });
  const [imageAltInfo, setImageAltInfo] = useState<ImageAltInfo>({
    total: 0,
    missingAlt: 0,
  });

  // Effect to run analysis when the popover opens
  useEffect(() => {
    if (isOpen) {
      // Title
      setTitle(document.title);

      // Meta Description
      const descContent = getMetaContent('meta[name="description"]');
      setDescription(descContent);
      setDescriptionStatus(checkDescriptionLength(descContent));

      // H1 Tags
      const h1Elements = document.querySelectorAll('h1');
      const h1Texts = Array.from(h1Elements).map(h => h.textContent?.trim() ?? '');
      setH1Info({ count: h1Elements.length, texts: h1Texts });

      // Canonical URL
      const canonicalElement = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      setCanonicalUrl(canonicalElement?.href ?? null);

      // Meta Robots
      setMetaRobots(getMetaContent('meta[name="robots"]'));

      // Open Graph Tags
      setOgInfo({
        title: getMetaContent('meta[property="og:title"]'),
        description: getMetaContent('meta[property="og:description"]'),
        image: getMetaContent('meta[property="og:image"]'),
        url: getMetaContent('meta[property="og:url"]'),
        type: getMetaContent('meta[property="og:type"]'),
      });

      // Twitter Card Tags
      setTwitterInfo({
        card: getMetaContent('meta[name="twitter:card"]'),
        title: getMetaContent('meta[name="twitter:title"]'),
        description: getMetaContent('meta[name="twitter:description"]'),
        image: getMetaContent('meta[name="twitter:image"]'),
      });

      // Image Alt Texts
      const images = document.querySelectorAll('img');
      const totalImages = images.length;
      let missingAltCount = 0;
      images.forEach(img => {
        // Consider an image missing alt if alt attribute is absent OR empty string
        if (!img.hasAttribute('alt') || img.alt === '') {
          missingAltCount++;
        }
      });
      setImageAltInfo({ total: totalImages, missingAlt: missingAltCount });
    }
  }, [isOpen]);

  // Effect to prevent body scroll when popover is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = ''; // Cleanup on unmount
    };
  }, [isOpen]);

  // Updated renderStatusIcon logic to use XCircle for errors
  const renderStatusIcon = (label: string, status: any, goodCondition?: boolean | number | string) => {
    const valueString = String(status ?? '');

    if (status === null || status === undefined) {
      return goodCondition !== undefined ? <AlertCircle className="h-4 w-4 text-yellow-500" /> : <MinusCircle className="h-4 w-4 text-gray-400" />;
    }

    // Specific check for robots - Use XCircle for error
    if (label === 'Robots') {
      if (valueString.includes('noindex') || valueString.includes('nofollow') || valueString.includes('none')) {
        return <XCircle className="h-4 w-4 text-red-500" />; // Use XCircle for error
      }
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }

    // Specific check for Image Alt - Use XCircle for error
    if (label === 'Image Alts') {
      const imgInfo = status as ImageAltInfo;
      if (imgInfo.total === 0) return <MinusCircle className="h-4 w-4 text-gray-400" />;
      if (imgInfo.missingAlt === 0) return <CheckCircle className="h-4 w-4 text-green-500" />;
      if (imgInfo.missingAlt === imgInfo.total) return <XCircle className="h-4 w-4 text-red-500" />; // Use XCircle for error
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }

    // General checks based on goodCondition
    if (goodCondition !== undefined) {
      if (typeof goodCondition === 'number' && status === goodCondition) return <CheckCircle className="h-4 w-4 text-green-500" />;
      if (typeof goodCondition === 'boolean' && goodCondition) return <CheckCircle className="h-4 w-4 text-green-500" />;
      if (typeof goodCondition === 'string' && status === goodCondition) return <CheckCircle className="h-4 w-4 text-green-500" />;

      // If a goodCondition was provided but not met, show a generic warning/alert
      if (status !== 'Missing' && !(typeof status === 'string' && status.startsWith('Too'))) {
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      }
    }

    // Specific Status String Checks
    if (status === 'Missing') return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    if (typeof status === 'string' && status.startsWith('Too')) return <AlertCircle className="h-4 w-4 text-yellow-500" />;

    // Fallback
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  // Helper to render a single check item - NO icon here
  const renderCheckItem = (label: string, value: string | number | null | undefined) => (
    <div className="grid grid-cols-[auto,1fr] items-start gap-x-3 gap-y-0.5 py-1 border-b border-border/50 last:border-b-0"> {/* Adjusted padding/gap */}
      {/* Label */}
      <span className="font-medium text-foreground/90 whitespace-nowrap mt-px">{label}</span>
      {/* Value - Allow wrapping */}
      <span className="text-foreground break-words overflow-hidden">
        {value ?? <span className="text-muted-foreground/70">N/A</span>}
      </span>
      {/* Icon column removed */}
    </div>
  );

  // Function to determine the overall status of a category
  const getCategoryStatus = (category: 'core' | 'content' | 'og' | 'twitter'): 'error' | 'warning' | 'success' | 'neutral' => {
    let hasError = false;
    let hasWarning = false;
    let hasSuccess = false;

    switch (category) {
      case 'core':
        // Errors
        if (metaRobots?.includes('noindex') || metaRobots?.includes('nofollow') || metaRobots?.includes('none')) hasError = true;
        // Warnings
        if (!title) hasWarning = true;
        if (descriptionStatus && descriptionStatus !== 'Good') hasWarning = true;
        if (h1Info.count !== 1) hasWarning = true;
        if (!canonicalUrl) hasWarning = true;
        // Success (presence checks implicitly handled by warning logic)
        if (title && descriptionStatus === 'Good' && h1Info.count === 1 && canonicalUrl && metaRobots && !hasError) hasSuccess = true;
        break;
      case 'content':
        if (imageAltInfo.total > 0) {
          if (imageAltInfo.missingAlt === imageAltInfo.total) hasError = true;
          else if (imageAltInfo.missingAlt > 0) hasWarning = true;
          else hasSuccess = true;
        }
        break;
      case 'og':
        if (!ogInfo.title || !ogInfo.description || !ogInfo.image || !ogInfo.url || !ogInfo.type) hasWarning = true;
        if (ogInfo.title && ogInfo.description && ogInfo.image && ogInfo.url && ogInfo.type) hasSuccess = true;
        break;
      case 'twitter':
        if (!twitterInfo.card || !twitterInfo.title || !twitterInfo.description || !twitterInfo.image) hasWarning = true;
        if (twitterInfo.card && twitterInfo.title && twitterInfo.description && twitterInfo.image) hasSuccess = true;
        break;
    }

    if (hasError) return 'error';
    if (hasWarning) return 'warning';
    if (hasSuccess) return 'success';
    return 'neutral';
  };

  // Updated renderCategoryIcon to use XCircle for errors
  const renderCategoryIcon = (category: 'core' | 'content' | 'og' | 'twitter') => {
    const status = getCategoryStatus(category);
    switch (status) {
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />; // Use XCircle for error
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <MinusCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  // Helper to determine title class based on category status
  const getCategoryTitleClassName = (category: 'core' | 'content' | 'og' | 'twitter'): string => {
    const status = getCategoryStatus(category);
    switch (status) {
      case 'error': return "text-xs font-semibold text-red-500 uppercase tracking-wider";
      case 'warning': return "text-xs font-semibold text-yellow-500 uppercase tracking-wider";
      default: return "text-xs font-semibold text-muted-foreground uppercase tracking-wider";
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      {/* ... PopoverTrigger ... */}
      <PopoverTrigger asChild>
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 border border-primary-foreground/20"
        >
          <SearchCode className="h-6 w-6" />
          <span className="sr-only">Open 22 SEO Dev Buddy</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        style={{ maxWidth: '420px' }} // Keep adjusted max-width
        className="mr-4 mb-2 bg-background shadow-xl border-2 border-border/40 rounded-lg text-foreground text-sm max-h-[60vh] overflow-y-auto p-0"
        side="top"
        align="end"
        onOpenAutoFocus={(e: Event) => e.preventDefault()}
      >
        <div className="flex flex-col">
          {/* Header */}
          <div className="p-3 pb-2 space-y-1 border-b border-border/50">
            <h4 className="font-semibold leading-none text-lg">SEO 223 3Dev Buddy</h4>
            <p className="text-xs text-muted-foreground">
              On-page analysis (Dev Mode)
            </p>
          </div>

          {/* Content Area with Padding */}
          <div className="p-3 flex flex-col gap-4"> {/* Gap between sections */}

            {/* Section: Essentials */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <h5 className={getCategoryTitleClassName('core')}>Essentials (基础必备)</h5>
                {renderCategoryIcon('core')}
              </div>
              {/* Grid for items within the category */}
              <div className="grid grid-cols-[auto,1fr] gap-x-2 gap-y-1 text-xs">
                <span className="font-medium text-foreground/80 whitespace-nowrap">Title</span>
                <span className="text-foreground break-words overflow-hidden">{title ?? <span className="text-muted-foreground/70">N/A</span>}</span>

                <span className="font-medium text-foreground/80 whitespace-nowrap">Description</span>
                <span className="text-foreground break-words overflow-hidden">{description ?? <span className="text-muted-foreground/70">N/A</span>}</span>
                {/* Description status on new line if needed */}
                {descriptionStatus !== 'N/A' && descriptionStatus !== 'Good' && (
                  <span className="col-start-2 text-yellow-500/90">(Status: {descriptionStatus})</span>
                )}

                <span className="font-medium text-foreground/80 whitespace-nowrap">H1 Count</span>
                <span className="text-foreground break-words overflow-hidden">{h1Info.count}</span>
                {/* H1 content on new line */}
                {h1Info.texts.length > 0 && (
                  <span className="col-start-2 text-muted-foreground/80" title={h1Info.texts.join(', ')}>
                    Content: {h1Info.texts[0]} {h1Info.texts.length > 1 ? `(+${h1Info.texts.length - 1} more)` : ''}
                  </span>
                )}

                <span className="font-medium text-foreground/80 whitespace-nowrap">Canonical</span>
                <span className="text-foreground break-words overflow-hidden">{canonicalUrl ?? <span className="text-muted-foreground/70">N/A</span>}</span>

                <span className="font-medium text-foreground/80 whitespace-nowrap">Robots</span>
                <span className="text-foreground break-words overflow-hidden">{metaRobots ?? <span className="text-muted-foreground/70">N/A</span>}</span>
              </div>
            </div>

            {/* Section: Rich Results & Sharing */}
            <div>
              <div className="flex items-center gap-1.5 mb-2 mt-3">
                <h5 className={getCategoryTitleClassName('og') + " " + getCategoryTitleClassName('twitter') /* Combine classes - crude approach */}>Rich Results & Sharing</h5>
                {/* Maybe show combined icon? Or remove? For now, remove */}
              </div>
              {/* Grid for items within the category */}
              <div className="grid grid-cols-[auto,1fr] gap-x-2 gap-y-1 text-xs">
                {/* OG */}
                <span className="font-medium text-foreground/80 whitespace-nowrap col-span-2 pt-1">Open Graph:</span>
                <span className="font-medium text-foreground/80 whitespace-nowrap">OG Title</span>
                <span className="text-foreground break-words overflow-hidden">{ogInfo.title ?? <span className="text-muted-foreground/70">N/A</span>}</span>
                <span className="font-medium text-foreground/80 whitespace-nowrap">OG Desc</span>
                <span className="text-foreground break-words overflow-hidden">{ogInfo.description ?? <span className="text-muted-foreground/70">N/A</span>}</span>
                <span className="font-medium text-foreground/80 whitespace-nowrap">OG Image</span>
                <span className="text-foreground break-words overflow-hidden">{ogInfo.image ?? <span className="text-muted-foreground/70">N/A</span>}</span>
                <span className="font-medium text-foreground/80 whitespace-nowrap">OG URL</span>
                <span className="text-foreground break-words overflow-hidden">{ogInfo.url ?? <span className="text-muted-foreground/70">N/A</span>}</span>
                <span className="font-medium text-foreground/80 whitespace-nowrap">OG Type</span>
                <span className="text-foreground break-words overflow-hidden">{ogInfo.type ?? <span className="text-muted-foreground/70">N/A</span>}</span>
                {/* Twitter */}
                <span className="font-medium text-foreground/80 whitespace-nowrap col-span-2 pt-2">Twitter Card:</span>
                <span className="font-medium text-foreground/80 whitespace-nowrap">Twitter Card</span>
                <span className="text-foreground break-words overflow-hidden">{twitterInfo.card ?? <span className="text-muted-foreground/70">N/A</span>}</span>
                <span className="font-medium text-foreground/80 whitespace-nowrap">Twitter Title</span>
                <span className="text-foreground break-words overflow-hidden">{twitterInfo.title ?? <span className="text-muted-foreground/70">N/A</span>}</span>
                <span className="font-medium text-foreground/80 whitespace-nowrap">Twitter Desc</span>
                <span className="text-foreground break-words overflow-hidden">{twitterInfo.description ?? <span className="text-muted-foreground/70">N/A</span>}</span>
                <span className="font-medium text-foreground/80 whitespace-nowrap">Twitter Image</span>
                <span className="text-foreground break-words overflow-hidden">{twitterInfo.image ?? <span className="text-muted-foreground/70">N/A</span>}</span>
              </div>
            </div>

            {/* Section: Content & Accessibility */}
            <div>
              <div className="flex items-center gap-1.5 mb-2 mt-3">
                <h5 className={getCategoryTitleClassName('content')}>Content & Accessibility</h5>
                {renderCategoryIcon('content')}
              </div>
              {/* Grid for items within the category */}
              <div className="grid grid-cols-[auto,1fr] gap-x-2 gap-y-1 text-xs">
                <span className="font-medium text-foreground/80 whitespace-nowrap">Image Alts</span>
                <span className="text-foreground break-words overflow-hidden">{`${imageAltInfo.missingAlt} missing / ${imageAltInfo.total} total`}</span>
              </div>
            </div>

          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

//