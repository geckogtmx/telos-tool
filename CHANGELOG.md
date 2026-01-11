# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-01-11

### Added
- **Organization Entity Support**: Full parsing, generation, and template support for Organizations.
- **Agent Entity Support**: System prompt parsing and generation for AI Agents.
- **Testing Suite**: Implemented testing infrastructure with Vitest (Unit) and Playwright (E2E).
- **Security Hardening**:
  - Rate limiting (Auth, Strict, Standard tiers).
  - XSS protection in print views.
  - SSRF protection for URL parsing.
  - Security headers (CSP, etc.).
- **Dual AI Provider Support**: Anthropic Claude and Google Gemini integration.
- **Dashboard**: File management with filtering and deletion.

### Changed
- **Performance**: Optimized dashboard Supabase queries to reduce payload size.
- **Logging**: Gated verbose parser logs behind `NODE_ENV` checks.
- **Documentation**: Comprehensive updates to `README.md`, `CLAUDE.md`, and `DEVELOPMENT_PLAN_V1.md`.

### Fixed
- Resolved all 9 issues from Jan 2026 Security Audit.
- Fixed `pii-scrubber` output noise.
- Addressed Dashboard over-fetching.
