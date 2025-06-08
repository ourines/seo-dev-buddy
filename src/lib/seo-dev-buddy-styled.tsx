import React, { useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { SearchCode, ClipboardCopy, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { styles, getThemedStyle, isDarkMode } from './styles';

// 类型定义
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

// 辅助函数
const getMetaContent = (selector: string): string | null => {
  if (typeof document === 'undefined') return null;
  const element = document.querySelector(selector);
  return element ? element.getAttribute('content') : null;
};

const checkDescriptionLength = (desc: string | undefined | null): StatusLevel => {
  if (!desc) return 'error';
  const length = desc.length;
  if (length < 120 || length > 160) return 'warning';
  return 'success';
};

const formatHeadingCounts = (headings: HeadingStructure): string => {
  return `H2:${headings.h2} H3:${headings.h3} H4:${headings.h4} H5:${headings.h5} H6:${headings.h6}`;
};

// 简化的 Popover 组件


// 简化的 Button 组件
interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
  style?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({ onClick, disabled, children, style }) => {
  const [isDark, setIsDark] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsDark(isDarkMode());
  }, []);

  const buttonStyle = {
    ...styles.button,
    ...getThemedStyle({}, styles.buttonDark, isDark),
    ...(isHovered ? getThemedStyle(styles.buttonHover, styles.buttonDarkHover, isDark) : {}),
    ...(disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
    ...style,
  };

  return (
    <button
      style={buttonStyle}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
};

// 章节组件
interface SeoCheckSectionProps {
  title: string;
  children: ReactNode;
}

const SeoCheckSection: React.FC<SeoCheckSectionProps> = ({ title, children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(isDarkMode());
  }, []);

  return (
    <div style={styles.section}>
      <h5 style={getThemedStyle(styles.sectionTitle, styles.sectionTitleDark, isDark)}>
        {title}
      </h5>
      <div>
        {children}
      </div>
    </div>
  );
};

// 检查项组件
interface CheckItemProps {
  label: string;
  value: string;
  status: StatusLevel;
  isLast?: boolean;
}

const CheckItem: React.FC<CheckItemProps> = ({ label, value, status, isLast }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(isDarkMode());
  }, []);

  const getStatusStyle = () => {
    switch (status) {
      case 'success':
        return styles.statusSuccess;
      case 'warning':
        return styles.statusWarning;
      case 'error':
        return styles.statusError;
      default:
        return styles.statusSuccess;
    }
  };

  const itemStyle = {
    ...styles.checkItem,
    ...getThemedStyle({}, styles.checkItemDark, isDark),
    ...(isLast ? styles.checkItemLast : {}),
  };

  return (
    <div style={itemStyle}>
      <span style={getThemedStyle(styles.label, styles.labelDark, isDark)}>
        {label}
      </span>
      <span style={getThemedStyle(styles.value, styles.valueDark, isDark)}>
        {value}
      </span>
      <div
        style={{
          ...styles.statusIndicator,
          ...getStatusStyle(),
        }}
      />
    </div>
  );
};

// 主组件
export function SeoDevBuddy() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [copyStatus, setCopyStatus] = useState('Copy JSON');
  const [isDark, setIsDark] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  // SEO 数据状态
  const [seoData, setSeoData] = useState({
    title: '',
    description: '',
    descriptionStatus: 'error' as StatusLevel,
    h1Info: { count: 0, texts: [] } as H1Info,
    canonicalUrl: '',
    metaRobots: '',
    htmlLang: '',
    imageAltInfo: { total: 0, missingAlt: 0 } as ImageAltInfo,
    headingStructure: { h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 } as HeadingStructure,
    internalLinkCount: 0,
    externalLinkCount: 0,
    wordCount: 0,
    ogInfo: { title: null, description: null, image: null, url: null, type: null } as OpenGraphInfo,
    twitterInfo: { card: null, title: null, description: null, image: null } as TwitterCardInfo,
    viewportMeta: '',
    hasStructuredData: false,
    publicationDate: '',
  });

  useEffect(() => {
    setIsDark(isDarkMode());

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => setIsDark(mediaQuery.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // 分析 SEO 数据
  const analyzeSeoData = useCallback(() => {
    if (typeof document === 'undefined') return;

    setIsLoading(true);

    setTimeout(() => {
      try {
        // 基本 meta 信息
        const title = document.title || '';
        const description = getMetaContent('meta[name="description"]') || '';
        const descriptionStatus = checkDescriptionLength(description);

        // H1 信息
        const h1Elements = Array.from(document.querySelectorAll('h1'));
        const h1Info = {
          count: h1Elements.length,
          texts: h1Elements.map(el => el.textContent || '').slice(0, 3),
        };

        // 其他 meta 信息
        const canonicalUrl = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
        const metaRobots = getMetaContent('meta[name="robots"]') || '';
        const htmlLang = document.documentElement.lang || '';
        const viewportMeta = getMetaContent('meta[name="viewport"]') || '';

        // 图片 alt 信息
        const images = Array.from(document.querySelectorAll('img'));
        const imageAltInfo = {
          total: images.length,
          missingAlt: images.filter(img => !img.alt || img.alt.trim() === '').length,
        };

        // 标题结构
        const headingStructure = {
          h2: document.querySelectorAll('h2').length,
          h3: document.querySelectorAll('h3').length,
          h4: document.querySelectorAll('h4').length,
          h5: document.querySelectorAll('h5').length,
          h6: document.querySelectorAll('h6').length,
        };

        // 链接统计
        const links = Array.from(document.querySelectorAll('a[href]'));
        const currentDomain = window.location.hostname;
        let internalLinkCount = 0;
        let externalLinkCount = 0;

        links.forEach(link => {
          const href = link.getAttribute('href') || '';
          if (href.startsWith('http')) {
            const linkDomain = new URL(href).hostname;
            if (linkDomain === currentDomain) {
              internalLinkCount++;
            } else {
              externalLinkCount++;
            }
          } else if (href.startsWith('/') || !href.includes('://')) {
            internalLinkCount++;
          }
        });

        // 字数统计
        const bodyText = document.body.textContent || '';
        const wordCount = bodyText.trim().split(/\s+/).length;

        // Open Graph 信息
        const ogInfo = {
          title: getMetaContent('meta[property="og:title"]'),
          description: getMetaContent('meta[property="og:description"]'),
          image: getMetaContent('meta[property="og:image"]'),
          url: getMetaContent('meta[property="og:url"]'),
          type: getMetaContent('meta[property="og:type"]'),
        };

        // Twitter Card 信息
        const twitterInfo = {
          card: getMetaContent('meta[name="twitter:card"]'),
          title: getMetaContent('meta[name="twitter:title"]'),
          description: getMetaContent('meta[name="twitter:description"]'),
          image: getMetaContent('meta[name="twitter:image"]'),
        };

        // 结构化数据检测
        const hasStructuredData = document.querySelectorAll('script[type="application/ld+json"]').length > 0;

        // 发布日期
        const publicationDate = getMetaContent('meta[property="article:published_time"]') ||
          getMetaContent('meta[name="date"]') || '';

        setSeoData({
          title,
          description,
          descriptionStatus,
          h1Info,
          canonicalUrl,
          metaRobots,
          htmlLang,
          imageAltInfo,
          headingStructure,
          internalLinkCount,
          externalLinkCount,
          wordCount,
          ogInfo,
          twitterInfo,
          viewportMeta,
          hasStructuredData,
          publicationDate,
        });
      } catch (error) {
        console.error('[SEO Dev Buddy] Error analyzing SEO data:', error);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  }, []);

  useEffect(() => {
    if (isOpen) {
      analyzeSeoData();
    }
  }, [isOpen, analyzeSeoData]);

  // 获取状态级别
  const getItemStatusLevel = useCallback((label: string, value: any): StatusLevel => {
    if (!value || value === 'N/A' || value === '') return 'error';

    switch (label) {
      case 'Description':
        return seoData.descriptionStatus;
      case 'H1 Count':
        return value === 1 ? 'success' : value === 0 ? 'error' : 'warning';
      case 'Image Alts':
        return seoData.imageAltInfo.missingAlt === 0 ? 'success' : 'warning';
      case 'Word Count':
        return value >= 300 ? 'success' : value >= 150 ? 'warning' : 'error';
      default:
        return 'success';
    }
  }, [seoData.descriptionStatus, seoData.imageAltInfo.missingAlt]);

  // 复制 JSON 数据
  const handleCopyJson = useCallback(async () => {
    try {
      const jsonString = JSON.stringify(seoData, null, 2);
      await navigator.clipboard.writeText(jsonString);
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus('Copy JSON'), 1500);
    } catch (err) {
      console.error('[SEO Dev Buddy] Failed to copy JSON:', err);
      setCopyStatus('Failed!');
      setTimeout(() => setCopyStatus('Copy JSON'), 1500);
    }
  }, [seoData]);

  const floatingButtonStyle = {
    ...styles.floatingButton,
    ...(isButtonHovered ? styles.floatingButtonHover : {}),
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* 浮动按钮 */}
      <button
        style={floatingButtonStyle}
        aria-label="Open SEO Dev Buddy"
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
        onClick={() => setIsOpen(!isOpen)}
      >
        <SearchCode style={styles.icon} />
      </button>

      {/* Popover 内容 */}
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 40,
            }}
            onClick={() => setIsOpen(false)}
          />
          {/* Popover 内容 */}
          <div
            style={{
              position: 'fixed',
              bottom: '5rem',
              right: '1rem',
              zIndex: 50,
              ...getThemedStyle(styles.popoverContent, styles.popoverContentDark, isDark),
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {/* 头部 */}
              <div style={getThemedStyle(styles.header, styles.headerDark, isDark)}>
                <div>
                  <h4 style={styles.title}>SEO Dev Buddy</h4>
                  <p style={getThemedStyle(styles.subtitle, styles.subtitleDark, isDark)}>
                    On-page analysis (Dev Mode)
                  </p>
                </div>
                <Button
                  onClick={handleCopyJson}
                  disabled={isLoading}
                >
                  <ClipboardCopy style={styles.iconSmall} />
                  {copyStatus}
                </Button>
              </div>

              {/* 内容 */}
              {isLoading ? (
                <div style={getThemedStyle(styles.loading, styles.loadingDark, isDark)}>
                  Analyzing...
                </div>
              ) : (
                <div style={styles.content}>
                  <SeoCheckSection title="Essentials">
                    <CheckItem label="Title" value={seoData.title || 'Missing'} status={getItemStatusLevel('Title', seoData.title)} />
                    <CheckItem label="Description" value={seoData.description || 'Missing'} status={getItemStatusLevel('Description', seoData.description)} />
                    <CheckItem label="H1 Count" value={String(seoData.h1Info.count)} status={getItemStatusLevel('H1 Count', seoData.h1Info.count)} />
                    <CheckItem label="Canonical" value={seoData.canonicalUrl || 'Missing'} status={getItemStatusLevel('Canonical', seoData.canonicalUrl)} />
                    <CheckItem label="Robots" value={seoData.metaRobots || 'Missing'} status={getItemStatusLevel('Robots', seoData.metaRobots)} />
                    <CheckItem label="HTML Lang" value={seoData.htmlLang || 'Missing'} status={getItemStatusLevel('HTML Lang', seoData.htmlLang)} isLast />
                  </SeoCheckSection>

                  <SeoCheckSection title="Content & Accessibility">
                    <CheckItem
                      label="Image Alts"
                      value={`${seoData.imageAltInfo.missingAlt} missing / ${seoData.imageAltInfo.total} total`}
                      status={getItemStatusLevel('Image Alts', seoData.imageAltInfo)}
                    />
                    <CheckItem
                      label="Headings"
                      value={formatHeadingCounts(seoData.headingStructure)}
                      status={getItemStatusLevel('Headings', seoData.headingStructure)}
                    />
                    <CheckItem label="Internal Links" value={String(seoData.internalLinkCount)} status={getItemStatusLevel('Internal Links', seoData.internalLinkCount)} />
                    <CheckItem label="External Links" value={String(seoData.externalLinkCount)} status={getItemStatusLevel('External Links', seoData.externalLinkCount)} />
                    <CheckItem label="Word Count" value={String(seoData.wordCount)} status={getItemStatusLevel('Word Count', seoData.wordCount)} isLast />
                  </SeoCheckSection>

                  <SeoCheckSection title="Open Graph">
                    <CheckItem label="OG Title" value={seoData.ogInfo.title || 'Missing'} status={getItemStatusLevel('OG Title', seoData.ogInfo.title)} />
                    <CheckItem label="OG Desc" value={seoData.ogInfo.description || 'Missing'} status={getItemStatusLevel('OG Desc', seoData.ogInfo.description)} />
                    <CheckItem label="OG Image" value={seoData.ogInfo.image || 'Missing'} status={getItemStatusLevel('OG Image', seoData.ogInfo.image)} />
                    <CheckItem label="OG URL" value={seoData.ogInfo.url || 'Missing'} status={getItemStatusLevel('OG URL', seoData.ogInfo.url)} />
                    <CheckItem label="OG Type" value={seoData.ogInfo.type || 'Missing'} status={getItemStatusLevel('OG Type', seoData.ogInfo.type)} isLast />
                  </SeoCheckSection>

                  <SeoCheckSection title="Twitter Card">
                    <CheckItem label="Twitter Card" value={seoData.twitterInfo.card || 'Missing'} status={getItemStatusLevel('Twitter Card', seoData.twitterInfo.card)} />
                    <CheckItem label="Twitter Title" value={seoData.twitterInfo.title || 'Missing'} status={getItemStatusLevel('Twitter Title', seoData.twitterInfo.title)} />
                    <CheckItem label="Twitter Desc" value={seoData.twitterInfo.description || 'Missing'} status={getItemStatusLevel('Twitter Desc', seoData.twitterInfo.description)} />
                    <CheckItem label="Twitter Image" value={seoData.twitterInfo.image || 'Missing'} status={getItemStatusLevel('Twitter Image', seoData.twitterInfo.image)} isLast />
                  </SeoCheckSection>

                  <SeoCheckSection title="Technical SEO">
                    <CheckItem label="Viewport" value={seoData.viewportMeta || 'Missing'} status={getItemStatusLevel('Viewport', seoData.viewportMeta)} />
                    <CheckItem label="Structured Data" value={seoData.hasStructuredData ? 'Detected' : 'Not Detected'} status={getItemStatusLevel('Structured Data', seoData.hasStructuredData)} />
                    <CheckItem label="Publication Date" value={seoData.publicationDate || 'Missing'} status={getItemStatusLevel('Publication Date', seoData.publicationDate)} isLast />
                  </SeoCheckSection>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
