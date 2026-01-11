# TELOS Tool

> Generate, store, and share structured identity documents for individuals, organizations, and AI agents.

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?logo=supabase)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## What is TELOS?

**TELOS** (Teleological Operating System) is an open-source framework created by [Daniel Miessler](https://github.com/danielmiessler/Telos) for documenting an entity's purpose, mission, values, and operating principles.

This tool automates TELOS generation using AI (Claude or Gemini) based on your inputs—CVs, company information, or agent system prompts.

## Features

- **Three Entity Types**: Individual, Organization, and AI Agent
- **AI-Powered Generation**: Choose between Anthropic Claude or Google Gemini
- **Secure Hosting Options**:
  - **Open**: Publicly accessible via shareable link
  - **Encrypted**: Password-protected access
  - **Private**: Only visible to authenticated owner
- **Dashboard**: View, filter, update, and delete your TELOS files
- **Version Tracking**: Edit and regenerate while keeping the same shareable link
- **PII Scrubbing**: Automatic removal of sensitive information from CVs

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS 4 |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth |
| AI | Anthropic Claude / Google Gemini |
| Validation | Zod |

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Supabase project (free tier works)
- API key for Claude or Gemini

### Installation

```bash
# Clone the repository
git clone https://github.com/geckogtmx/telos-tool.git
cd telos-tool

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

### Environment Variables

Create `.env.local` with:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI Provider (choose one)
AI_PROVIDER=gemini  # or 'claude'
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=AIza...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Setup

Run the migrations in your Supabase SQL editor:

```bash
# Located in supabase/migrations/
20240106000000_initial_schema.sql
20240106000001_add_delete_policy.sql
20260107000000_v1_2_schema_updates.sql
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
telos-tool/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (generate, save, view, etc.)
│   ├── auth/              # Login, signup, callback
│   ├── dashboard/         # User's TELOS files
│   ├── generate/          # Entity type flows
│   └── t/[id]/            # Public TELOS viewer
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── QuestionFlow.tsx  # Dynamic question renderer
│   └── TELOSPreview.tsx  # Markdown preview & print
├── lib/
│   ├── generators/       # AI integration (Claude, Gemini)
│   ├── parsers/          # CV parsing, PII scrubbing
│   ├── supabase/         # Database clients
│   └── rate-limit.ts     # API rate limiting
├── config/               # App configuration
└── types/                # TypeScript interfaces
```

## Security

This project has undergone a comprehensive security audit. See [SECURITY_AUDIT.md](SECURITY_AUDIT.md) for details.

**Implemented protections:**
- DOMPurify for XSS prevention
- bcrypt password hashing
- Zod input validation
- Rate limiting (auth, strict, standard tiers)
- CSP and security headers
- Supabase RLS policies

## Contributing

Contributions are welcome! Please read the existing documentation:
- [CLAUDE.md](CLAUDE.md) - Development history and technical details
- [GEMINI.md](GEMINI.md) - AI provider integration

## Credits

- [Daniel Miessler](https://github.com/danielmiessler/Telos) - TELOS framework creator
- Built with [Claude](https://anthropic.com) and [Gemini](https://deepmind.google)

## License

MIT License - see [LICENSE](LICENSE) for details.
