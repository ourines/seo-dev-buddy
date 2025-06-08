/**
 * Framework-agnostic integration utilities for SEO Dev Buddy
 *
 * This module provides integration methods for various frontend frameworks
 * and vanilla JavaScript environments.
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { SeoDevBuddy } from './seo-dev-buddy';
import type { SEODevBuddyConfig } from '../types';

/**
 * Global instance tracker to prevent multiple instances
 */
let globalInstance: { root: ReturnType<typeof createRoot>; container: HTMLElement } | null = null;

/**
 * Initialize SEO Dev Buddy in any environment
 *
 * @param config - Optional configuration object
 * @returns Cleanup function to remove the instance
 */
export function initSeoDevBuddy(config?: Partial<SEODevBuddyConfig>): () => void {
  // Prevent multiple instances
  if (globalInstance) {
    console.warn('[SEO Dev Buddy] Instance already exists. Use destroy() first.');
    return () => {
      // No-op: instance already exists
    };
  }

  // Only initialize in browser environment
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    console.warn('[SEO Dev Buddy] Browser environment required.');
    return () => {
      // No-op: not in browser environment
    };
  }

  // Create container element
  const container = document.createElement('div');
  container.id = 'seo-dev-buddy-root';
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '999999';

  // Append to body
  document.body.appendChild(container);

  // Create React root and render
  const root = createRoot(container);
  root.render(React.createElement(SeoDevBuddy));

  // Store global instance
  globalInstance = { root, container };

  // Return cleanup function
  return () => {
    if (globalInstance) {
      globalInstance.root.unmount();
      if (globalInstance.container.parentNode) {
        globalInstance.container.parentNode.removeChild(globalInstance.container);
      }
      globalInstance = null;
    }
  };
}

/**
 * Destroy the current SEO Dev Buddy instance
 */
export function destroySeoDevBuddy(): void {
  if (globalInstance) {
    globalInstance.root.unmount();
    if (globalInstance.container.parentNode) {
      globalInstance.container.parentNode.removeChild(globalInstance.container);
    }
    globalInstance = null;
  }
}

/**
 * Check if SEO Dev Buddy is currently active
 */
export function isSeoDevBuddyActive(): boolean {
  return globalInstance !== null;
}

/**
 * Auto-initialization for development environments
 * This will automatically initialize SEO Dev Buddy if certain conditions are met
 */
export function autoInit(): (() => void) | null {
  // Only auto-init in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  // Check for common development indicators
  const isDev =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.includes('.local') ||
    window.location.port !== '';

  if (isDev) {
    console.log('[SEO Dev Buddy] Development environment detected, auto-initializing...');
    return initSeoDevBuddy();
  }

  return null;
}

/**
 * React Hook for SEO Dev Buddy
 * Use this in React applications for better integration
 */
export function useSeoDevBuddy(config?: Partial<SEODevBuddyConfig>) {
  React.useEffect(() => {
    const cleanup = initSeoDevBuddy(config);
    return cleanup;
  }, []);
}

/**
 * Vue 3 Composition API integration
 */
export function createSeoDevBuddyPlugin(config?: Partial<SEODevBuddyConfig>) {
  return {
    install(app: { config: { globalProperties: Record<string, any> } }) {
      let cleanup: (() => void) | null = null;

      app.config.globalProperties.$seoDevBuddy = {
        init: () => {
          cleanup = initSeoDevBuddy(config);
        },
        destroy: () => {
          if (cleanup) {
            cleanup();
            cleanup = null;
          }
        }
      };

      // Auto-init in development
      if (process.env.NODE_ENV === 'development') {
        cleanup = initSeoDevBuddy(config);
      }

      // Cleanup on app unmount
      app.config.globalProperties.$seoDevBuddy._cleanup = cleanup;
    }
  };
}

/**
 * Angular integration service factory
 */
export function createAngularSeoDevBuddyService() {
  return class SeoDevBuddyService {
    public cleanup: (() => void) | null = null;

    init(config?: Partial<SEODevBuddyConfig>): void {
      this.cleanup = initSeoDevBuddy(config);
    }

    destroy(): void {
      if (this.cleanup) {
        this.cleanup();
        this.cleanup = null;
      }
    }

    isActive(): boolean {
      return isSeoDevBuddyActive();
    }
  };
}

/**
 * Vanilla JavaScript integration
 * Can be used with any framework or no framework at all
 */
export const SeoDevBuddyVanilla = {
  init: initSeoDevBuddy,
  destroy: destroySeoDevBuddy,
  isActive: isSeoDevBuddyActive,
  autoInit
};

// Auto-initialization for script tag usage
if (typeof window !== 'undefined') {
  // Expose to global scope for script tag usage
  (window as Record<string, any>).SeoDevBuddy = SeoDevBuddyVanilla;

  // Auto-init if data attribute is present
  if (document.currentScript && document.currentScript.hasAttribute('data-auto-init')) {
    document.addEventListener('DOMContentLoaded', () => {
      autoInit();
    });
  }
}
