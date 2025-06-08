/**
 * Class Name Utility
 *
 * A utility function for merging CSS class names conditionally
 */

import { type ClassValue, clsx } from 'clsx';

/**
 * Merge class names conditionally
 * @param inputs - Class names to merge
 * @returns Merged class names
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
