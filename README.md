# seo-dev-buddy

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test seo-dev-buddy` to execute the unit tests via [Vitest](https://vitest.dev/).

## Future Enhancements

- **Optimize Status Checks**:
  - Add length checks for OG/Twitter descriptions (warn if < 100 chars).
  - Check if Canonical URL is an absolute path.
  - Warn about double slashes (`//`) in image URLs (`og:image`, `twitter:image`).
- **Improve Code Structure**:
  - Refactor `getItemStatusLevel` into smaller, focused functions or use a configuration object.
  - Create a helper function to avoid repetitive logic for retrieving data from `seoData` based on `label`.
- **Feature Enhancements**:
  - Basic keyword analysis (requires user input for target keywords).
  - Display basic performance metrics (e.g., LCP) using `window.performance`.
  - Attempt basic JSON-LD validation or link to external validators.
  - Add configuration options for warning thresholds (e.g., word count).
