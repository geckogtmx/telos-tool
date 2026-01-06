# TELOS Tool - Claude Code Documentation

## Project Overview

**Name:** TELOS Tool v1.0
**Purpose:** Production-ready TELOS generation platform supporting Individual, Organization, and Agent entity types
**Framework:** Next.js 14+ with App Router, TypeScript, and Tailwind CSS
**Status:** Phases 1-5 complete (Question flow for Individual entity working)

## What is TELOS?

TELOS (Teleological Operating System) is a framework for documenting an entity's identity, mission, values, and operating principles. This tool generates TELOS files automatically using Claude AI based on user inputs (CV uploads, organization info, or agent system prompts).

## Tech Stack

### Core Dependencies
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4
- **Database:** Supabase (PostgreSQL with RLS)
- **Auth:** Supabase Auth
- **File Storage:** Vercel Blob Storage (planned)
- **AI:** Anthropic Claude API Sonnet 4 (planned)

### Key Packages
```json
{
  "@supabase/ssr": "^0.8.0",
  "@supabase/supabase-js": "^2.89.0",
  "next": "16.1.1",
  "react": "19.2.3",
  "mammoth": "^1.9.1",
  "pdf2json": "^4.0.0",
  "react-dropzone": "^14.2.3"
}
```

## Project Structure

```
telos-tool/
├── app/
│   ├── page.tsx                      # Landing page
│   ├── layout.tsx                    # Root layout with nav
│   ├── globals.css                   # Global styles
│   ├── auth/
│   │   ├── login/page.tsx            # Login page
│   │   ├── signup/page.tsx           # Signup page
│   │   └── callback/route.ts         # Supabase auth callback
│   ├── generate/
│   │   ├── page.tsx                  # Entity type selector
│   │   ├── individual/page.tsx       # Individual entity flow
│   │   ├── organization/page.tsx     # Organization entity flow
│   │   └── agent/page.tsx            # Agent entity flow
│   ├── dashboard/
│   │   ├── page.tsx                  # User's TELOS files list
│   │   └── layout.tsx                # Dashboard layout
│   └── t/
│       └── [id]/page.tsx             # Public TELOS viewer (planned)
├── components/
│   ├── ui/                           # Reusable UI components
│   ├── EntitySelector.tsx            # Entity type chooser
│   ├── FileUpload.tsx                # CV upload with drag-drop
│   ├── QuestionFlow.tsx              # Dynamic question renderer with validation
│   ├── NavigationBar.tsx             # Top navigation
│   └── ProtectedRoute.tsx            # Auth guard
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Browser Supabase client
│   │   └── server.ts                 # Server Supabase client
│   └── parsers/
│       ├── cv-parser.ts              # CV text extraction (PDF/DOCX/TXT)
│       └── pii-scrubber.ts           # PII detection and removal
├── types/
│   └── index.ts                      # TypeScript type definitions
├── config/
│   ├── constants.ts                  # App-wide constants
│   └── questions/
│       └── individual.ts             # Individual entity questions (7 total)
└── middleware.ts                     # Auth middleware
```

## Current Implementation Status

### Phase 1: Foundation ✅
- [x] Landing page with hero section
- [x] Entity type selector (Individual, Organization, Agent)
- [x] Navigation structure
- [x] TypeScript configuration
- [x] Tailwind CSS setup
- [x] Basic routing

### Phase 2: Authentication ✅
- [x] Supabase client initialization
- [x] Sign up flow UI
- [x] Login flow UI
- [x] Auth callback route
- [x] Protected routes (middleware)
- [x] Session management working

### Phase 3: File Upload ✅ (FIXED - pdf2json)
- [x] CV upload component (drag-and-drop)
- [x] Text extraction (PDF via pdf2json, DOCX via mammoth, TXT)
- [x] File validation (size, format)
- [x] Error handling
- [x] UI with preview
- [x] PDF parsing fixed with pdf2json library
- [x] DOCX parsing fixed with proper Buffer conversion

### Phase 4: PII Scrubbing ✅
- [x] PII detection (7 types: phone, email, SSN, credit card, address, tax ID, passport)
- [x] Automatic PII removal
- [x] User notification (summary only, no actual PII values)
- [x] Verified with tests (6/6 PII items removed)
- [x] Zero PII leakage to client

### Phase 5: Question Flow ✅
- [x] QuestionFlow component with dynamic rendering
- [x] 7 questions for Individual entity type
- [x] Form validation (required fields, min length)
- [x] Progress tracking and visual indicators
- [x] Question navigation (jump to any question)
- [x] Skip button for optional question #7
- [x] Real-time inline validation
- [x] Integration with Individual page flow
- [x] Answers stored in component state
- [x] Build succeeds with no TypeScript errors

### Phase 6-11: Pending
- Claude API integration
- TELOS generation
- Hosting options
- Dashboard functionality
- Update flows

## Environment Variables

Required in `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Anthropic (not yet implemented)
ANTHROPIC_API_KEY=your_anthropic_api_key

# Vercel Blob (not yet implemented)
BLOB_READ_WRITE_TOKEN=your_blob_token

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Key Features

### Entity Types Supported

1. **Individual**
   - Starting input: CV upload (.pdf, .docx, .txt)
   - 7 questions about problems, mission, values, work style
   - Generates personal TELOS with identity, mission, values, work style

2. **Organization**
   - Starting input: About page URL or text
   - 7 questions about organizational mission, values, operations
   - Generates org TELOS with identity, mission, processes, initiatives

3. **Agent**
   - Starting input: System prompt or config
   - 7 questions about function, parameters, constraints
   - Generates agent TELOS with purpose, parameters, communication style

### Security Features

- **PII Scrubbing:** Automatic removal of phone numbers, emails, SSN, addresses, etc.
- **Row Level Security:** Supabase RLS policies ensure users only see their own data
- **Protected Routes:** Middleware guards authenticated pages
- **Password-Protected Hosting:** Optional encrypted hosting for sensitive TELOS files

## Database Schema

### telos_files Table

```sql
CREATE TABLE telos_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('individual', 'organization', 'agent')),
  entity_name TEXT NOT NULL,
  raw_input JSONB NOT NULL,
  generated_content TEXT NOT NULL,
  public_id TEXT UNIQUE NOT NULL,
  hosting_type TEXT NOT NULL CHECK (hosting_type IN ('open', 'encrypted', 'private')),
  password_hash TEXT,
  blob_url TEXT,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Development Guidelines

### Must Follow

1. **TypeScript strict mode** - No `any` types
2. **Tailwind only** - No custom CSS unless absolutely necessary
3. **Server components by default** - Client components only when needed
4. **Error boundaries** - Wrap risky operations
5. **Loading states** - Show feedback for all async operations
6. **Verify before committing** - Run `npm run build` first
7. **One feature per branch** - Keep changes focused
8. **Test locally** - Verify in browser before pushing

### Never Do

1. Don't commit broken builds
2. Don't skip verification checkpoints
3. Don't push to main directly (use dev branch)
4. Don't hardcode secrets (use env vars)
5. Don't ignore TypeScript errors
6. Don't build without testing

## Common Commands

```bash
# Development
npm run dev              # Start dev server on localhost:3000
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Git workflow
git checkout -b feature/feature-name    # Create feature branch
git add .
git commit -m "Description"
git push origin feature/feature-name
```

## API Routes

### `/api/parse-cv` - CV Text Extraction + PII Removal ✅
- Accepts file upload
- Extracts text from PDF/DOCX/TXT
- Runs PII scrubbing
- Returns cleaned text + summary

### `/api/generate-telos` - TELOS Generation
- Receives entity type, parsed input, user answers
- Calls Claude API with appropriate template
- Returns formatted markdown

### `/api/save-telos` - Database Storage
- Saves to database
- Uploads to Vercel Blob
- Generates public ID
- Returns hosted URL

### `/api/update-telos` - Update Existing TELOS
- Loads existing data
- Re-generates with new answers
- Increments version
- Updates hosted version

## Testing Checklist

After each phase, verify:
- [ ] TypeScript compiles (`npm run build`)
- [ ] No console errors
- [ ] UI matches design
- [ ] Mobile responsive
- [ ] Auth works (if applicable)
- [ ] Database operations succeed (if applicable)
- [ ] Error states display correctly

## Known Issues / Debugging Notes

### Current Status
- All phases 1-5 working correctly
- Build passes with no errors
- PII protection verified and tested
- Question flow fully functional for Individual entity type

### Technical Debt
- Next.js 16 middleware deprecation warning (non-breaking, migrate to "proxy" convention later)
- Consider adding unit tests for file parsers and question flow (currently manual testing only)
- Question flows for Organization and Agent entity types not yet implemented (Phase 5 only covers Individual)

### Bug Fixes (Phase 3)
- Fixed PDF parsing by switching from pdf-parse to pdf2json with `needRawText: true`
- Fixed DOCX parsing by converting ArrayBuffer to Buffer before passing to mammoth
- Both PDF and DOCX extraction now working correctly

### Phase 5 Implementation Details
- 7 questions configured per build spec Section V
- Question types: 6 required + 1 optional (life context)
- Validation: min 10 chars for textarea, min 5 chars for text input
- Navigation: progress bar, question navigator (numbered buttons), previous/next/skip
- Visual feedback: answered (green), error (red), current (blue)
- Skip button only shown for optional questions
- Inline validation with error messages
- "Generate TELOS" button appears when all required questions answered

## Reference Documents

1. `TELOS_TOOL_V1_BUILD_SPEC.md` - Complete technical specification
2. `PHASE_1_COMPLETE.md` - Phase 1 completion notes
3. `PHASE_2_COMPLETE.md` - Phase 2 completion notes
4. `PHASE_3_COMPLETE.md` - Phase 3 & 4 completion notes (file upload + PII scrubbing)
5. Daniel Miessler's TELOS Framework: https://github.com/danielmiessler/Telos

## Git Workflow

```
main           # Production-ready code only
└── dev        # Integration branch (current: auth debugging)
```

### Recent Commits
- `58c5773` Phase 2: Auth implementation (debugging in progress)
- `e2ae8c7` Add .env files to gitignore
- `9a11268` Phase 1: Foundation - landing page, entity selector, navigation
- `b37fb1d` Add v1.0 complete build specification
- `3212abe` Initial Next.js setup with TypeScript and Tailwind

## Deployment

**Target:** Vercel
**Status:** Not yet deployed
**Domain:** TBD

### Pre-Deployment Checklist
- [ ] All environment variables set in Vercel
- [ ] Supabase production mode enabled
- [ ] RLS policies tested
- [ ] Database migrations run
- [ ] Error tracking enabled

## Success Criteria (v1.0)

- [ ] All 3 entity types functional
- [ ] CV parsing with PII removal works
- [ ] Question flows complete
- [ ] TELOS generation produces quality output
- [ ] Hosting (open + encrypted) works
- [ ] User accounts and dashboard functional
- [ ] Update flow works
- [ ] Public viewer works
- [ ] No critical bugs
- [ ] TypeScript compiles clean
- [ ] Deployed to Vercel
- [ ] Beta tested with 5+ users

## Contact & Support

**Repository:** https://github.com/geckogtmx/telos-tool
**Framework:** Based on Daniel Miessler's TELOS framework
**AI Model:** Claude Sonnet 4.5

---

**Last Updated:** 2026-01-06
**Current Phase:** 5 Complete (Question Flow for Individual Entity)
**Next Milestone:** Phase 6 - Claude API Integration & TELOS Generation
