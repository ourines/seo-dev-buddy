import React, { useState, useEffect } from 'react';
// Use relative paths for components within the same package
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/ui/popover';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { SearchCode, AlertCircle, CheckCircle, MinusCircle } from 'lucide-react';

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
  const [metaRobots, setMetaRobots] = useState<string | null>(null); // New state for meta robots
  const [ogInfo, setOgInfo] = useState<OpenGraphInfo>({ // New state for OG tags
    title: null,
    description: null,
    image: null,
    url: null,
    type: null,
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
    }
  }, [isOpen]); // Re-run analysis if popover is opened again

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

  // Updated renderStatusIcon logic
  const renderStatusIcon = (label: string, status: string | number | null | undefined, goodCondition?: boolean | number | string) => {
    const valueString = String(status ?? '');

    if (status === null || status === undefined) {
      // If goodCondition is explicitly set (meaning existence is required), show warning if missing.
      // Otherwise (goodCondition undefined), missing is neutral.
      return goodCondition !== undefined ? <AlertCircle className="h-4 w-4 text-yellow-500" /> : <MinusCircle className="h-4 w-4 text-gray-400" />;
    }

    // Specific check for robots
    if (label === 'Robots') {
      if (valueString.includes('noindex') || valueString.includes('nofollow') || valueString.includes('none')) {
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      }
      return <CheckCircle className="h-4 w-4 text-green-500" />;
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

  // Helper to render a single check item - Allows wrapping
  const renderCheckItem = (label: string, value: string | number | null | undefined, statusValue: any = value, statusGoodCondition?: boolean | number | string) => (
    // Use items-start for better alignment with multi-line text
    <div className="grid grid-cols-[auto,minmax(0,1fr),auto] items-start gap-x-2 gap-y-0">
      <span className="font-semibold text-foreground mt-px whitespace-nowrap">{label}</span>
      {/* Allow wrapping and hide overflow to help enforce wrapping */}
      <span className="col-span-1 text-foreground/90 break-words overflow-hidden">
        {value ?? 'N/A'}
      </span>
      {renderStatusIcon(label, statusValue, statusGoodCondition)}
    </div>
  );

  return (
    <div className='max-w-2xs'>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
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
          style={{ maxWidth: '320px' }}
          className="mr-4 mb-2 bg-background shadow-xl border-2 border-foreground/20 rounded-lg text-foreground text-sm max-h-[75vh] overflow-y-auto"
          side="top"
          align="end"
          onOpenAutoFocus={(e: Event) => e.preventDefault()}
        >
          <div className="flex flex-col gap-3 p-3">
            {/* Header */}
            <div className="space-y-1">
              <h4 className="font-semibold leading-none text-lg">SEO 223 3Dev Buddy</h4>
              <p className="text-xs text-muted-foreground">
                On-page analysis (Dev Mode)
              </p>
            </div>

            {/* Use a 2-column grid with reduced gap */}
            <div className="grid grid-cols-2 gap-x-2 gap-y-2">
              {/* Column 1: Core Meta Group */}
              <div className="flex flex-col gap-1.5">
                <Separator />
                <h5 className="font-medium text-foreground/80 text-xs my-1">Core Meta</h5> {/* Use my-1 for spacing */}
                {/* Use standard renderCheckItem, passing correct status checks */}
                {renderCheckItem('Title', title, title, true)} {/* Check for existence */}
                {renderCheckItem('Description', description, descriptionStatus, 'Good')}
                {descriptionStatus !== 'N/A' && descriptionStatus !== 'Good' && (
                  <p className="text-xs text-yellow-500/90 -mt-1 ml-1">Status: {descriptionStatus}</p>
                )}
                {renderCheckItem('H1 Count', h1Info.count, h1Info.count, 1)}
                {h1Info.texts.length > 0 && (
                  <p className="text-xs text-muted-foreground/80 mt-0 ml-1" title={h1Info.texts.join(', ')}>
                    Content: {h1Info.texts[0]} {h1Info.texts.length > 1 ? `(+${h1Info.texts.length - 1} more)` : ''}
                  </p>
                )}
                {renderCheckItem('Canonical', canonicalUrl, canonicalUrl, true)} {/* Check for existence */}
                {renderCheckItem('Robots', metaRobots, metaRobots)} {/* Let icon logic handle robots status */}
              </div>

              {/* Column 2: Open Graph Group */}
              <div className="flex flex-col gap-1.5">
                <Separator />
                <h5 className="font-medium text-foreground/80 text-xs my-1">Social Preview (Open Graph)</h5> {/* Use my-1 */}
                {renderCheckItem('OG Title', ogInfo.title, ogInfo.title, true)}
                {renderCheckItem('OG Desc', ogInfo.description, ogInfo.description, true)}
                {renderCheckItem('OG Image', ogInfo.image, ogInfo.image, true)}
                {renderCheckItem('OG URL', ogInfo.url, ogInfo.url, true)}
                {renderCheckItem('OG Type', ogInfo.type, ogInfo.type, true)}
              </div>

            </div>

          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default SeoDevBuddy;
