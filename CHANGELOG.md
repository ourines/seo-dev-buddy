# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Framework-agnostic integration utilities
- React Hook (`useSeoDevBuddy`) for easy React integration
- Vue 3 plugin support with Composition API
- Angular service factory for Angular applications
- Vanilla JavaScript integration for any environment
- Auto-initialization for development environments
- Global instance management to prevent multiple instances
- Comprehensive TypeScript support

### Changed

- Updated main entry point to export framework integration utilities
- Enhanced README with detailed usage examples for all frameworks

### Fixed

- Fixed TypeScript linter errors in framework integration module
- Improved return type definitions for better type safety

## [0.0.1] - 2024-01-XX

### Added

- Initial release of SEO Dev Buddy
- Real-time SEO analysis during development
- Google Search best practices compliance
- Responsive floating panel interface
- Zero-configuration setup with auto-detection
- Comprehensive SEO checks including:
  - Basic meta tags (title, description, viewport)
  - Open Graph protocol support
  - Twitter Cards validation
  - Structured data (JSON-LD) checking
  - Technical SEO analysis
  - Image alt attributes validation
  - Heading hierarchy structure
  - Internal linking analysis
- Beautiful UI components built with Radix UI and Tailwind CSS
- Customizable configuration options
- Development environment detection
- Performance optimized with minimal bundle size

### Dependencies

- React 16.8+ support
- Modern browser compatibility
- TypeScript support out of the box
