# TELOS Tool - Claude Code Documentation

## Project Overview

**Name:** TELOS Tool v1.0
**Purpose:** Production-ready TELOS generation platform supporting Individual, Organization, and Agent entity types
**Framework:** Next.js 14+ with App Router, TypeScript, and Tailwind CSS
**Status:** Phases 1-15 complete (Release Candidate Ready)

## What is TELOS?

TELOS (Teleological Operating System) is a framework for documenting an entity's identity, mission, values, and operating principles. This tool generates TELOS files automatically using AI based on user inputs (CV uploads, organization info, or agent system prompts).

## Tech Stack

### Core Dependencies
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4
- **Database:** Supabase (PostgreSQL with RLS)
- **Auth:** Supabase Auth
- **File Storage:** Vercel Blob Storage (planned)
- **AI Providers:** 
  - Anthropic Claude API (Sonnet 3.5) ✅
  - Google Gemini API (2.0 Flash) ✅

### Key Packages
```json
{
  "@anthropic-ai/sdk": "latest",
  "@google/generative-ai": "latest",
  "@supabase/ssr": "^0.8.0",
  "@supabase/supabase-js": "^2.89.0",
  "next": "16.1.1",
  "react": "19.2.3",
  "mammoth": "^1.9.1",
  "pdf-parse": "^1.1.1",
  "react-dropzone": "^14.2.3",
  "date-fns": "^4.1.0"
}
```

## Project Structure

```
telos-tool/
├── app/
│   ├── page.tsx                      # Landing page
│   ├── layout.tsx                    # Root layout with nav
│   ├── globals.css                   # Global styles
│   ├── auth/...                      # Authentication pages
│   ├── generate/
│   │   ├── page.tsx                  # Entity type selector
│   │   ├── individual/page.tsx       # Individual entity flow (Create/Edit)
│   │   ├── organization/page.tsx     # Organization entity flow (Planned)
│   │   └── agent/page.tsx            # Agent entity flow (Planned)
│   ├── dashboard/
│   │   ├── page.tsx                  # User's TELOS files list
│   │   └── layout.tsx                # Dashboard layout
│   └── t/
│       └── [id]/page.tsx             # Public TELOS viewer (Open/Encrypted/Private)
├── components/
│   ├── ui/                           # Reusable UI components
│   ├── HostingOptions.tsx            # Hosting selection (Open/Encrypted/Private)
│   ├── TELOSViewer.tsx               # Secure file viewer with password protection
│   ├── TELOSPreview.tsx              # Markdown previewer
│   ├── QuestionFlow.tsx              # Dynamic question renderer
│   ├── DashboardFileList.tsx         # List of user files with filtering
│   └── DashboardFileCard.tsx         # Individual file card with actions
├── lib/
│   ├── generators/
│   │   ├── claude-api.ts             # Anthropic API wrapper
│   │   ├── gemini-api.ts             # Google Gemini API wrapper
│   │   └── telos-generator.ts        # Main generation logic (switches providers)
│   ├── storage/
│   │   └── encryption.ts             # bcrypt password hashing
│   ├── supabase/
│   │   ├── admin.ts                  # Service role client
│   │   ├── client.ts                 # Browser client
│   │   └── server.ts                 # Server client
│   └── ...
├── config/
│   ├── ai-model.ts                   # AI provider configuration
│   └── ...
└── ...
```

## Current Implementation Status

### Phase 1: Foundation ✅
- [x] Landing page, entity selector, navigation
- [x] TypeScript & Tailwind setup

### Phase 2: Authentication ✅
- [x] Supabase Auth (Login, Signup, Protected Routes)

### Phase 3-4: File Upload & PII Scrubbing ✅
- [x] CV parsing (PDF/DOCX/TXT)
- [x] PII detection and removal (Phone, Email, SSN, etc.)

### Phase 5-6: Question Flow & Generation ✅
- [x] Dynamic question flow with validation
- [x] "Skip" logic for optional questions
- [x] Generation via Claude or Gemini
- [x] Markdown rendering

### Phase 7: Preview & Download ✅
- [x] Raw/Preview modes, Print, Download .md

### Phase 8: Hosting Options ✅
- [x] Database schema (`telos_files`)
- [x] Save API (`/api/save-telos`)
- [x] Hosting types: Open, Encrypted, Private
- [x] Password protection with bcrypt

### Phase 9: Public Viewer & Gemini Integration ✅
- [x] Public viewer route (`/t/[id]`)
- [x] Secure fetching logic (Service Role)
- [x] Password unlock UI with visibility toggle
- [x] Gemini API integration (`lib/generators/gemini-api.ts`)

### Phase 10: Dashboard ✅
- [x] File listing with filtering
- [x] Delete functionality
- [x] Redesigned card UI with top-aligned badges

### Phase 11: Update Flow & Refinements ✅
- [x] Edit existing TELOS files
- [x] Version tracking
- [x] Refined UX (hidden finish button on edit, pre-selected hosting status)
- [x] **Refinement:** Anonymized example questions (removed specific names)
- [x] **Refinement:** Improved entity name extraction (uses generated header)

### Phase 12: Organization Entity Type ✅
- [x] Parser & Upload (Text/URL/File)
- [x] Question Flow (Mission, Values, KPIs)
- [x] AI Generation Template (Claude/Gemini)

### Phase 13: Agent Entity Type ✅
- [x] Parser & Upload (System Prompts)
- [x] Question Flow (Purpose, Constraints, Persona)
- [x] AI Generation Template

### Phase 14: Testing Suite ✅
- [x] Infrastructure (Vitest, Playwright)
- [x] Unit Tests (Generators, PII Scrubber)
- [x] E2E Tests (Core flows verified)

### Phase 15: Production Polish ✅
- [x] Performance: Dashboard query optimization
- [x] Performance: Gated debug logging
- [x] Environment & Config cleanup

## Next Milestone
- Release v1.0

## Environment Variables

Required in `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# AI Providers
AI_PROVIDER=gemini # or 'claude'
ANTHROPIC_API_KEY=...
GEMINI_API_KEY=...

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Security Audit Findings (January 2026)

### Outstanding Issues

| # | Issue | Severity | Location | Status |
|---|-------|----------|----------|--------|
| 1 | XSS in Print View | High | `components/TELOSPreview.tsx` (`handlePrint`) | **DONE** |
| 2 | SSRF DNS Rebinding | Medium | `app/api/parse-url/route.ts` | **DONE** |
| 3 | Debug Logging in Prod | Low | `app/auth/signup/page.tsx` | **DONE** |
| 4 | Secret History Check | Low | Git history | **DONE** (verified clean) |

### Issue Details

**1. XSS in Print View**
- `handlePrint()` builds HTML with raw `content` string without sanitization
- AI-generated content could contain malicious HTML if user prompts model to emit it
- Fix: Wrap content in `DOMPurify.sanitize()` before injection

**2. SSRF DNS Rebinding**
- Current SSRF protection checks hostname strings only
- Malicious domain could resolve to internal IP after validation
- Fix: Resolve DNS first, then validate resulting IP addresses

**3. Debug Logging**
- Console logs in signup page expose email and config details
- Fix: Gate logs behind `NODE_ENV !== 'production'`

**4. Secret History**
- One-time check: ensure no `.env*` files were ever committed
- Run: `git log --all -- .env* .env.local`

### Remediation Plan

```
Step 1: Fix Print View XSS
  - Read components/TELOSPreview.tsx
  - Locate handlePrint() function
  - Add DOMPurify.sanitize() to content before HTML injection
  - Test print functionality

Step 2: Harden SSRF Protection
  - Read app/api/parse-url/route.ts
  - Add DNS resolution step before fetch
  - Validate resolved IPs against blocklist
  - Test with internal/external URLs

Step 3: Gate Debug Logging
  - Read app/auth/signup/page.tsx
  - Wrap console.log calls in NODE_ENV check
  - Verify no sensitive data logged in production

Step 4: Verify Secret History
  - Run git log command to check for committed secrets
  - Document result (clean or needs rotation)
```

### Additional Audit (2026-01-08)

**Dependencies:** `npm audit` returned 0 vulnerabilities

| # | Issue | Severity | Location | Status |
|---|-------|----------|----------|--------|
| 5 | Weak Password Policy | High | `app/api/save-telos/route.ts:40`, `HostingOptions.tsx:27` | **DONE** |
| 6 | No Rate Limiting | Medium | All API routes | **DONE** |
| 7 | Open Redirect | Medium | `app/auth/callback/route.ts:13` | **DONE** |
| 8 | Missing Security Headers | Low | `next.config.ts` | **DONE** |
| 9 | Entity Name Validation | Low | `app/api/save-telos/route.ts:9` | **DONE** |

**5. Weak Password Policy** *(FIXED)*
- ~~Encrypted TELOS files only require 4-character passwords~~
- Now requires 12+ characters with uppercase, lowercase, and number

**6. No Rate Limiting** *(FIXED)*
- ~~API endpoints have no request throttling~~
- Added in-memory rate limiting with sliding window algorithm (`lib/rate-limit.ts`)
- Three tiers: `authLimiter` (5/min for password attempts), `strictLimiter` (10/min for AI/file ops), `standardLimiter` (60/min)

**7. Open Redirect** *(FIXED)*
- ~~Auth callback accepts `next` param without validation~~
- Now validates `next` param is a safe relative path (rejects absolute URLs, protocol-relative URLs, encoded bypasses)

**8. Missing Security Headers** *(FIXED)*
- ~~No CSP, X-Frame-Options, X-Content-Type-Options configured~~
- Added comprehensive headers in `next.config.ts`: CSP, X-Frame-Options (DENY), X-Content-Type-Options (nosniff), Referrer-Policy, Permissions-Policy

**9. Entity Name Validation** *(FIXED)*
- ~~Only validates `.min(1)` - no max length or character restrictions~~
- Now validates `.max(255)` with sanitization (strips `<>"'\`&;{}()[]\/`)

### Security Strengths Observed
- SQL injection: Protected (Supabase SDK handles parameterization)
- XSS: DOMPurify sanitization in place
- Password hashing: bcrypt with salt=10
- File uploads: Magic number validation, size limits, MIME restrictions
- Authorization: Proper ownership checks before updates/views
- Secrets: API keys kept server-side only

### Final Audit (2026-01-08)

**npm audit:** 0 vulnerabilities
**ESLint:** Passing

| # | Issue | Severity | Location | Status |
|---|-------|----------|----------|--------|
| 10 | Debug Logging in Parsers | Info | `lib/parsers/*.ts`, `app/api/parse-cv/route.ts` | **DONE** |
| 11 | Dashboard Over-fetching | Info | `components/DashboardFileList.tsx:25` | **DONE** |
| 12 | Middleware Deprecation | Info | `middleware.ts` | **Optional** |

**10. Debug Logging in Parsers** *(FIXED)*
- ~~Verbose console.log statements~~
- Gated behind `NODE_ENV !== 'production'` check

**11. Dashboard Over-fetching** *(FIXED)*
- ~~`DashboardFileList.tsx` used `select('*')`~~
- Optimize to select only required metadata fields

**12. Middleware Deprecation**
- Next.js 16 deprecates middleware convention in favor of proxy
- Not a security issue, but may require migration in future versions

### All Critical/High/Medium Issues Resolved

All 9 security issues from the original audit have been fixed:
- 2 High severity (XSS, Weak Passwords)
- 3 Medium severity (SSRF, Rate Limiting, Open Redirect)
- 4 Low severity (Debug Logging, Secret History, Security Headers, Entity Validation)

---

**Last Updated:** 2026-01-08
**Current Phase:** 11 Complete (Refinements & Bug Fixes)
**Security Status:** All critical issues resolved
**Next Milestone:** Organization & Agent Entity Types