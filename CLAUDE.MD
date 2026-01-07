# TELOS Tool - Claude Code Documentation

## Project Overview

**Name:** TELOS Tool v1.0
**Purpose:** Production-ready TELOS generation platform supporting Individual, Organization, and Agent entity types
**Framework:** Next.js 14+ with App Router, TypeScript, and Tailwind CSS
**Status:** Phases 1-9 complete (Hosting, Public Viewer & Gemini Integration)

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
│   ├── auth/...                      # Authentication pages
│   ├── generate/
│   │   ├── page.tsx                  # Entity type selector
│   │   ├── individual/page.tsx       # Individual entity flow
│   │   ├── organization/page.tsx     # Organization entity flow
│   │   └── agent/page.tsx            # Agent entity flow
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
│   └── ...
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
- [x] Conditional UI (hide nav/edit buttons for public visitors)
- [x] Gemini API integration (`lib/generators/gemini-api.ts`)
- [x] AI Provider configuration (`config/ai-model.ts`)

### Phase 10-11: Pending
- Dashboard functionality
- Update flows
- Organization and Agent entity types

## Environment Variables

Required in `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# AI Providers (Select one via AI_PROVIDER)
AI_PROVIDER=claude # or 'gemini'
ANTHROPIC_API_KEY=...
GEMINI_API_KEY=...

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## AI Configuration

To switch between AI providers, update `config/ai-model.ts` or set `AI_PROVIDER` in `.env.local`.

```typescript
// config/ai-model.ts
export const AI_CONFIG = {
  provider: 'gemini', // or 'claude'
  claudeModel: 'claude-3-5-sonnet-20240620',
  geminiModel: 'gemini-2.0-flash',
};
```

---

**Last Updated:** 2026-01-06
**Current Phase:** 9 Complete (Hosting, Viewer & Gemini)
**Next Milestone:** Phase 10 - Dashboard Functionality
