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

// Basic SEO checks utility
const checkDescriptionLength = (desc: string | undefined | null): string => {
  if (!desc) return 'Missing';
  if (desc.length < 50) return `Too short (${desc.length} chars)`; // Example thresholds
  if (desc.length > 160) return `Too long (${desc.length} chars)`;
  return 'Good';
};

export function SeoDevBuddy() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string | null>(null);
  const [descriptionStatus, setDescriptionStatus] = useState<string>('N/A');
  const [h1Info, setH1Info] = useState<H1Info>({ count: 0, texts: [] });
  const [canonicalUrl, setCanonicalUrl] = useState<string | null>(null);

  // Effect to run analysis when the popover opens
  useEffect(() => {
    if (isOpen) {
      // Title
      setTitle(document.title);

      // Meta Description
      const descElement = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      const descContent = descElement?.content;
      setDescription(descContent ?? null);
      setDescriptionStatus(checkDescriptionLength(descContent));

      // H1 Tags
      const h1Elements = document.querySelectorAll('h1');
      const h1Texts = Array.from(h1Elements).map(h => h.textContent?.trim() ?? '');
      setH1Info({ count: h1Elements.length, texts: h1Texts });

      // Canonical URL
      const canonicalElement = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      setCanonicalUrl(canonicalElement?.href ?? null);
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

  const renderStatusIcon = (status: string | number | null | undefined, goodCondition: boolean | number = 1) => {
    if (status === null || status === undefined) return <MinusCircle className="h-4 w-4 text-gray-400" />;
    if (typeof goodCondition === 'number' && status === goodCondition) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (typeof goodCondition === 'boolean' && goodCondition) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (status === 'Good') return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <AlertCircle className="h-4 w-4 text-yellow-500" />;
  };

  return (
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
        className="w-[33vw] max-w-md mr-4 mb-2 bg-background shadow-xl border-2 border-foreground/20 rounded-lg text-foreground"
        side="top"
        align="end"
        onOpenAutoFocus={(e: Event) => e.preventDefault()}
      >
        <div className="flex flex-col gap-2 p-3">
          <div className="space-y-1">
            <h4 className="font-semibold leading-none text-lg">SEO 223 Dev Buddy</h4>
            <p className="text-sm text-muted-foreground">
              On-page analysis (Dev Mode)
            </p>
          </div>
          <Separator />
          <div className="grid gap-1.5 text-sm">
            <div className="grid grid-cols-[auto,minmax(0,1fr),auto] items-center gap-2">
              <span className="font-semibold text-foreground">Title</span>
              <span className="col-span-1 text-foreground/90 truncate" title={title}>
                {title || 'N/A'}
              </span>
              {renderStatusIcon(title ? 1 : 0, 1)}
            </div>

            <div className="grid grid-cols-[auto,minmax(0,1fr),auto] items-center gap-2">
              <span className="font-semibold text-foreground">Description</span>
              <span className="col-span-1 text-foreground/90 truncate" title={description ?? ''}>
                {description || 'N/A'}
              </span>
              {renderStatusIcon(descriptionStatus)}
            </div>
            <p className="text-xs text-muted-foreground/80">Status: {descriptionStatus}</p>

            <div className="grid grid-cols-[auto,minmax(0,1fr),auto] items-center gap-2">
              <span className="font-semibold text-foreground">H1 Count</span>
              <span className="col-span-1 text-foreground/90">
                {h1Info.count}
              </span>
              {renderStatusIcon(h1Info.count, 1)}
            </div>
            {h1Info.texts.length > 0 && (
              <p className="text-xs text-muted-foreground/80 truncate" title={h1Info.texts.join(', ')}>
                Content: {h1Info.texts[0]} {h1Info.texts.length > 1 ? `(+${h1Info.texts.length - 1} more)` : ''}
              </p>
            )}

            <div className="grid grid-cols-[auto,minmax(0,1fr),auto] items-center gap-2">
              <span className="font-semibold text-foreground">Canonical</span>
              <span className="col-span-1 text-foreground/90 truncate" title={canonicalUrl ?? ''}>
                {canonicalUrl || 'N/A'}
              </span>
              {renderStatusIcon(canonicalUrl ? 1 : 0, 1)}
            </div>

          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default SeoDevBuddy;
