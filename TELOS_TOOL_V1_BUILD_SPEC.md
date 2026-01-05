# TELOS Tool v1.0 - Complete Build Specification

## I. PROJECT OVERVIEW

**Goal:** Build a production-ready TELOS generation platform supporting Individual, Organization, and Agent entity types with full hosting, user accounts, and update flows.

**Timeline:** Phased build with verification checkpoints **Repository:** https://github.com/geckogtmx/telos-tool **Deployment:** Vercel **Framework:** Next.js 14+ with TypeScript and Tailwind CSS

---

## II. TECHNICAL STACK

### Core

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **File Storage:** Vercel Blob Storage
- **API:** Anthropic Claude API (Sonnet 4)

### Dependencies to Install

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "@anthropic-ai/sdk": "^0.27.0",
    "@vercel/blob": "^0.23.0",
    "mammoth": "^1.6.0",
    "pdf-parse": "^1.1.1",
    "nanoid": "^5.0.0",
    "react-dropzone": "^14.2.3",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/pdf-parse": "^1.1.4"
  }
}
```

---

## III. FILE STRUCTURE

```
telos-tool/
├── app/
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Landing page
│   ├── globals.css                   # Global styles
│   │
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── callback/route.ts         # Supabase auth callback
│   │
│   ├── generate/
│   │   ├── page.tsx                  # Entity type selector
│   │   ├── [entityType]/
│   │   │   ├── page.tsx              # Upload + questions flow
│   │   │   └── layout.tsx
│   │   └── preview/page.tsx          # Generated TELOS preview
│   │
│   ├── dashboard/
│   │   ├── page.tsx                  # User's TELOS files list
│   │   └── layout.tsx
│   │
│   ├── t/
│   │   └── [id]/page.tsx             # Public TELOS viewer (hosted version)
│   │
│   └── api/
│       ├── parse-cv/route.ts         # CV text extraction + PII removal
│       ├── generate-telos/route.ts   # Claude API integration
│       ├── save-telos/route.ts       # Save to database + blob storage
│       └── update-telos/route.ts     # Update existing TELOS
│
├── components/
│   ├── ui/                           # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Select.tsx
│   │   └── Textarea.tsx
│   │
│   ├── EntitySelector.tsx            # Choose entity type
│   ├── FileUpload.tsx                # CV/document upload
│   ├── QuestionFlow.tsx              # Dynamic question renderer
│   ├── TELOSPreview.tsx              # Markdown preview
│   ├── DownloadButton.tsx            # Download .md file
│   ├── HostingOptions.tsx            # Choose open vs encrypted
│   └── NavigationBar.tsx             # Top nav
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Supabase client (browser)
│   │   └── server.ts                 # Supabase client (server)
│   │
│   ├── parsers/
│   │   ├── cv-parser.ts              # Extract text from CV
│   │   ├── pii-scrubber.ts           # Remove sensitive data
│   │   ├── about-parser.ts           # Parse org about pages
│   │   └── prompt-parser.ts          # Parse agent system prompts
│   │
│   ├── generators/
│   │   ├── claude-api.ts             # Anthropic API wrapper
│   │   ├── telos-generator.ts        # Main generation logic
│   │   └── templates/
│   │       ├── individual.ts         # Individual TELOS template
│   │       ├── organization.ts       # Org TELOS template
│   │       └── agent.ts              # Agent TELOS template
│   │
│   ├── storage/
│   │   ├── blob.ts                   # Vercel Blob operations
│   │   └── encryption.ts             # Password protection logic
│   │
│   └── utils/
│       ├── validation.ts             # Zod schemas
│       ├── nanoid.ts                 # ID generation
│       └── markdown.ts               # Markdown utilities
│
├── types/
│   ├── index.ts                      # Shared TypeScript types
│   ├── entities.ts                   # Entity type definitions
│   ├── database.ts                   # Supabase types
│   └── api.ts                        # API request/response types
│
├── config/
│   ├── questions/
│   │   ├── individual.ts             # Individual questions
│   │   ├── organization.ts           # Org questions
│   │   └── agent.ts                  # Agent questions
│   │
│   └── constants.ts                  # App-wide constants
│
└── supabase/
    └── migrations/
        └── 001_initial_schema.sql    # Database schema
```

---

## IV. DATABASE SCHEMA

### Supabase Tables

```sql
-- Users table (handled by Supabase Auth)
-- No custom users table needed

-- TELOS Files
CREATE TABLE telos_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('individual', 'organization', 'agent')),
  entity_name TEXT NOT NULL,
  
  -- Content
  raw_input JSONB NOT NULL,              -- Original uploaded data + answers
  generated_content TEXT NOT NULL,        -- Full TELOS markdown
  
  -- Hosting
  public_id TEXT UNIQUE NOT NULL,         -- Short ID for URL (e.g., 'abc123')
  hosting_type TEXT NOT NULL CHECK (hosting_type IN ('open', 'encrypted', 'private')),
  password_hash TEXT,                     -- For encrypted hosting
  blob_url TEXT,                          -- Vercel Blob URL
  
  -- Metadata
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_telos_user ON telos_files(user_id);
CREATE INDEX idx_telos_public ON telos_files(public_id);
CREATE INDEX idx_telos_entity_type ON telos_files(entity_type);

-- RLS Policies
ALTER TABLE telos_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own TELOS files"
  ON telos_files FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own TELOS files"
  ON telos_files FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own TELOS files"
  ON telos_files FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Public TELOS files viewable by public_id"
  ON telos_files FOR SELECT
  USING (hosting_type = 'open');
```

---

## V. ENTITY TYPE CONFIGURATIONS

### Individual

**Starting Input:** CV upload (.pdf, .docx, .txt)

**Questions (7 total):**

1. What problems are you trying to solve? (textarea)
2. What's your mission in one sentence? (text input)
3. What are your top 3-5 values? (textarea)
4. What do you actively avoid or constrain? (textarea)
5. Describe your ideal work style and rhythm (textarea)
6. What are your current active projects? (textarea)
7. Any life context that affects your work? (textarea, optional)

**TELOS Template Sections:**

- I. Identity & History
- II. Problems & Mission
- III. Values & Constraints
- IV. Work Style & Preferences
- V. Active Projects & Challenges
- VI. Decision Log
- VII. Life Context Layer (optional)

---

### Organization

**Starting Input:** About page URL or text paste

**Questions (7 total):**

1. What problems does your organization solve? (textarea)
2. What's your organization's mission? (textarea)
3. What are your core organizational values? (textarea)
4. What does your organization explicitly avoid? (textarea)
5. How does your organization operate and make decisions? (textarea)
6. What are your current initiatives or programs? (textarea)
7. Who are your key stakeholders? (textarea, optional)

**TELOS Template Sections:**

- I. Identity & History
- II. Problems & Mission
- III. Values & Operating Principles
- IV. Decision-Making & Processes
- V. Active Initiatives
- VI. Organizational Evolution
- VII. Stakeholder Context (optional)

---

### Agent

**Starting Input:** System prompt or existing config

**Questions (7 total):**

1. What is this agent's primary function? (textarea)
2. What problems does this agent solve? (textarea)
3. What are this agent's operating parameters? (textarea)
4. What should this agent never do? (textarea)
5. How should this agent communicate? (textarea)
6. What are this agent's current active tasks? (textarea)
7. What system context affects this agent? (textarea, optional)

**TELOS Template Sections:**

- I. Agent Identity & Purpose
- II. Problems & Function
- III. Operating Parameters
- IV. Constraints & Prohibitions
- V. Communication Style
- VI. Active Tasks
- VII. System Context (optional)

---

## VI. PII SCRUBBING RULES

### Patterns to Detect and Remove

```typescript
const PII_PATTERNS = {
  // Phone numbers (US and international formats)
  phone: /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
  
  // Email addresses
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  
  // SSN (XXX-XX-XXXX)
  ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
  
  // Credit card numbers (basic pattern)
  creditCard: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
  
  // US addresses (simplified - street number + street name)
  address: /\b\d+\s+[\w\s]+(?:street|st|avenue|ave|road|rd|highway|hwy|square|sq|trail|trl|drive|dr|court|ct|parkway|pkwy|circle|cir|boulevard|blvd)\b/gi,
  
  // Tax IDs / EIN
  taxId: /\b\d{2}-\d{7}\b/g,
  
  // Passport numbers (simplified)
  passport: /\b[A-Z]{1,2}\d{6,9}\b/g
};

// Replacement strategy
function scrubPII(text: string): { cleaned: string; found: string[] } {
  let cleaned = text;
  const found: string[] = [];
  
  Object.entries(PII_PATTERNS).forEach(([type, pattern]) => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => found.push(`${type}: ${match}`));
      cleaned = cleaned.replace(pattern, `[${type.toUpperCase()}_REMOVED]`);
    }
  });
  
  return { cleaned, found };
}
```

### User Notification

When PII is detected and removed:

- Show summary: "Found and removed: 2 phone numbers, 1 email"
- Do NOT show the actual PII values
- Allow user to review cleaned text before proceeding
- Log PII removal events (type only, not values)

---

## VII. API INTEGRATION SPECS

### Claude API for CV Parsing

**Endpoint:** `/api/parse-cv`

**Flow:**

1. Extract text from uploaded file
2. Run PII scrubbing
3. Send to Claude API with structured prompt
4. Extract: name, background, skills, career trajectory, implicit values

**Prompt Template:**

```
Analyze this CV and extract structured information:

CV TEXT:
{cleaned_cv_text}

Extract and return as JSON:
{
  "name": "Full name",
  "background": "2-3 sentence career summary",
  "keySkills": ["skill1", "skill2", ...],
  "careerTrajectory": "Pattern of growth/pivots",
  "implicitValues": ["value1", "value2", ...]
}

Be concise. Focus on patterns, not just listing job titles.
```

---

### Claude API for TELOS Generation

**Endpoint:** `/api/generate-telos`

**Flow:**

1. Receive: entity type, parsed input, user answers
2. Select appropriate template
3. Send to Claude API with generation prompt
4. Return formatted markdown

**Prompt Template:**

```
Generate a TELOS file for a {entity_type}.

INPUT DATA:
{parsed_input}

USER ANSWERS:
{question_answers}

Generate a complete TELOS file following this structure:
{template_structure}

Rules:
- Use markdown formatting
- Be specific and actionable
- Maintain professional tone
- Keep sections focused
- Include all mandatory sections
- Make optional sections only if user provided relevant data

Return only the markdown content, no explanations.
```

---

## VIII. USER FLOW DIAGRAMS

### New TELOS Creation Flow

```
1. Landing Page
   ↓
2. Sign Up / Log In (if not authenticated)
   ↓
3. Select Entity Type (Individual / Organization / Agent)
   ↓
4. Upload Starting Input
   - Individual: CV file
   - Organization: About page URL or text
   - Agent: System prompt or config
   ↓
5. Review Parsed Data (with PII removal notice if applicable)
   ↓
6. Answer Entity-Specific Questions (7 questions)
   ↓
7. Generate TELOS (loading state, ~10-15 seconds)
   ↓
8. Preview Generated TELOS
   ↓
9. Choose Hosting Option:
   - Download only (no hosting)
   - Host as Open (public link)
   - Host as Encrypted (password-protected link)
   ↓
10. Save & Get Link (if hosted)
    ↓
11. Dashboard (view all TELOS files)
```

---

### Update Existing TELOS Flow

```
1. Dashboard
   ↓
2. Select TELOS File to Update
   ↓
3. Load Existing Data (pre-fill form)
   ↓
4. Question Flow with Skip Options
   - "Keep current answer" button for each question
   - Edit only what changed
   ↓
5. Re-generate TELOS
   ↓
6. Preview Updated Version
   ↓
7. Save (increments version number)
   ↓
8. Hosted link auto-updates (same URL)
```

---

## IX. VERIFICATION CHECKPOINTS

### Phase 1: Foundation (Build & Test Before Continuing)

- [ ] Landing page renders correctly
- [ ] Entity type selector works
- [ ] Navigation between pages functional
- [ ] TypeScript compiles with no errors
- [ ] Tailwind styles render correctly
- **Checkpoint:** `npm run build` succeeds, visual check passes

---

### Phase 2: Authentication (Build & Test)

- [ ] Supabase client initialized
- [ ] Sign up flow works
- [ ] Login flow works
- [ ] Protected routes redirect properly
- [ ] User session persists
- **Checkpoint:** Can create account, log in, log out

---

### Phase 3: File Upload (Build & Test)

- [ ] CV upload accepts .pdf, .docx, .txt
- [ ] Text extraction works for all formats
- [ ] File size limits enforced (max 5MB)
- [ ] Error states display correctly
- [ ] Extracted text shows in UI
- **Checkpoint:** Upload CV, see extracted text

---

### Phase 4: PII Scrubbing (Build & Test)

- [ ] PII patterns detected correctly
- [ ] PII removed from text
- [ ] User sees summary of removed items
- [ ] Cleaned text displays properly
- [ ] No actual PII shown to user
- **Checkpoint:** Upload CV with phone/email, verify removal

---

### Phase 5: Question Flow (Build & Test)

- [ ] Questions render for each entity type
- [ ] Form validation works
- [ ] User can skip optional questions
- [ ] Answers stored correctly
- [ ] Navigation between questions smooth
- **Checkpoint:** Complete question flow, verify data capture

---

### Phase 6: TELOS Generation (Build & Test)

- [ ] Claude API integration works
- [ ] Parsed CV data sent correctly
- [ ] User answers included
- [ ] Markdown generated properly
- [ ] Loading states display
- [ ] Error handling for API failures
- **Checkpoint:** Generate TELOS, verify output quality

---

### Phase 7: Preview & Download (Build & Test)

- [ ] Generated markdown renders correctly
- [ ] Download button creates .md file
- [ ] Filename includes entity name
- [ ] File content matches preview
- **Checkpoint:** Download TELOS file, open in text editor

---

### Phase 8: Hosting Options (Build & Test)

- [ ] User can choose open vs encrypted
- [ ] Password protection UI works
- [ ] Public ID generated (short, unique)
- [ ] File saved to Vercel Blob
- [ ] Database record created
- [ ] Personalized URL generated
- **Checkpoint:** Host TELOS, access via link

---

### Phase 9: Public Viewer (Build & Test)

- [ ] Public link loads TELOS
- [ ] Open files display immediately
- [ ] Encrypted files prompt for password
- [ ] Invalid password shows error
- [ ] 404 for non-existent IDs
- [ ] Markdown renders correctly
- **Checkpoint:** Access hosted TELOS via link

---

### Phase 10: Dashboard (Build & Test)

- [ ] User's TELOS files listed
- [ ] Can view each file
- [ ] Can update existing file
- [ ] Can delete file
- [ ] Hosting status displayed (open/encrypted/private)
- **Checkpoint:** Navigate dashboard, perform all actions

---

### Phase 11: Update Flow (Build & Test)

- [ ] Existing data pre-fills form
- [ ] Skip options work
- [ ] Re-generation updates content
- [ ] Version number increments
- [ ] Hosted link updates automatically
- **Checkpoint:** Update TELOS, verify changes persist

---

## X. PAYMENT GATE IMPLEMENTATION

### Current State (v1.0)

- All features functional
- No actual payment processing
- "Coming Soon" UI for paid tier

### UI Implementation

**Free Tier Message:**

```
Currently in Beta - All features free during preview period.
Payment options launching soon. Early users will receive special benefits.
```

**Dashboard Banner:**

```
TELOS Tool is currently free while in beta.
Support this project: [Patreon Coming Soon]
```

### Code Structure for Future Payment Integration

```typescript
// config/tiers.ts
export const TIERS = {
  free: {
    enabled: true,
    entityTypes: ['individual', 'organization', 'agent'],
    hosting: true,
    updates: true,
    maxFiles: 999 // Effectively unlimited during beta
  },
  paid: {
    enabled: false, // Will flip to true when Patreon integrated
    entityTypes: ['individual', 'organization', 'agent'],
    hosting: true,
    updates: true,
    maxFiles: 999
  }
};

// Check tier (currently always returns 'free')
export function getUserTier(userId: string): 'free' | 'paid' {
  return 'free'; // TODO: Check Patreon status when integrated
}
```

---

## XI. GIT WORKFLOW

### Branch Strategy

```bash
main                    # Production-ready code only
├── dev                 # Integration branch
└── feature/*          # Feature branches
```

### Commit Frequency

- After each verification checkpoint passes
- Meaningful commit messages
- Never commit broken code

### Example Flow

```bash
# Start new feature
git checkout -b feature/cv-upload

# Build feature
# Test feature
# Verify checkpoint

# Commit
git add .
git commit -m "Add CV upload with text extraction"

# Merge to dev
git checkout dev
git merge feature/cv-upload

# Test on dev
npm run build
npm run dev

# If all good, merge to main
git checkout main
git merge dev
git push origin main
```

---

## XII. ERROR HANDLING STANDARDS

### CV Upload Errors

```typescript
type CVUploadError = 
  | 'FILE_TOO_LARGE'       // > 5MB
  | 'INVALID_FORMAT'       // Not .pdf, .docx, .txt
  | 'EXTRACTION_FAILED'    // Could not extract text
  | 'EMPTY_CONTENT'        // Extracted text is empty
  | 'PII_DETECTION_FAILED' // PII scrubber crashed

// User-facing messages
const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'File must be under 5MB',
  INVALID_FORMAT: 'Please upload a PDF, DOCX, or TXT file',
  EXTRACTION_FAILED: 'Could not read file. Please try a different format.',
  EMPTY_CONTENT: 'No text found in file. Please check your CV.',
  PII_DETECTION_FAILED: 'Error processing file. Please try again.'
};
```

### Claude API Errors

```typescript
type ClaudeAPIError =
  | 'RATE_LIMIT'           // Too many requests
  | 'INVALID_API_KEY'      // API key issue
  | 'CONTENT_POLICY'       // Content flagged
  | 'NETWORK_ERROR'        // Connection failed
  | 'TIMEOUT'              // Request took too long

// Retry logic
async function callClaudeAPI(prompt: string, retries = 3): Promise<string> {
  try {
    // API call
  } catch (error) {
    if (retries > 0 && error.type === 'RATE_LIMIT') {
      await sleep(2000);
      return callClaudeAPI(prompt, retries - 1);
    }
    throw error;
  }
}
```

### Database Errors

```typescript
type DatabaseError =
  | 'CONNECTION_FAILED'
  | 'DUPLICATE_PUBLIC_ID'
  | 'PERMISSION_DENIED'
  | 'SAVE_FAILED'

// Graceful degradation
async function saveTELOS(data: TELOSData) {
  try {
    // Save to database
  } catch (error) {
    if (error.type === 'DUPLICATE_PUBLIC_ID') {
      // Regenerate ID and retry
      return saveTELOS({ ...data, publicId: generateNewId() });
    }
    // Log error, still allow download
    logError(error);
    return { success: false, downloadAvailable: true };
  }
}
```

---

## XIII. ENVIRONMENT VARIABLES

```bash
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Anthropic
ANTHROPIC_API_KEY=your_anthropic_api_key

# Vercel Blob
BLOB_READ_WRITE_TOKEN=your_blob_token

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Change to production URL when deployed
```

---

## XIV. DEPLOYMENT CHECKLIST

### Pre-Deployment

- [ ] All environment variables set in Vercel dashboard
- [ ] Supabase project in production mode
- [ ] RLS policies tested
- [ ] Database migrations run
- [ ] API rate limits configured
- [ ] Error tracking enabled (Sentry or similar)

### Vercel Configuration

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

### Post-Deployment Verification

- [ ] Landing page loads
- [ ] Sign up works
- [ ] CV upload works
- [ ] TELOS generation works
- [ ] Hosting works
- [ ] Public links accessible
- [ ] Dashboard functional

---

## XV. NEXT STEPS AFTER BUILD

### Immediate (v1.0 Launch)

1. Test with 10-20 beta users
2. Gather feedback on question quality
3. Monitor Claude API costs per generation
4. Track conversion: uploads → completions
5. Document bugs and edge cases

### Short Term (v1.1)

1. Integrate Patreon
2. Add advanced encryption option
3. Implement changelog for TELOS updates
4. Add export formats (PDF, JSON)
5. Template library (examples)

### Medium Term (v1.2+)

1. Additional entity types (Team, Project)
2. Collaboration features
3. API for programmatic TELOS generation
4. Department of One content integration
5. Community features

---

## XVI. DEVELOPMENT RULES FOR CLAUDE CODE

### Must Follow

1. **TypeScript strict mode** - No `any` types
2. **Tailwind only** - No custom CSS unless absolutely necessary
3. **Server components by default** - Use client components only when needed
4. **Error boundaries** - Wrap risky operations
5. **Loading states** - Show feedback for all async operations
6. **Verify before committing** - Run `npm run build` first
7. **One feature per branch** - Keep changes focused
8. **Test locally** - Verify in browser before pushing

### Never Do

1. **Don't commit broken builds**
2. **Don't skip verification checkpoints**
3. **Don't push to main directly** (use dev branch)
4. **Don't hardcode secrets** (use env vars)
5. **Don't ignore TypeScript errors**
6. **Don't build without testing**

---

## XVII. SUCCESS CRITERIA

### v1.0 is Complete When:

- [ ] All 3 entity types functional
- [ ] CV parsing with PII removal works
- [ ] Question flows complete for all types
- [ ] TELOS generation produces quality output
- [ ] Hosting (open + encrypted) works
- [ ] User accounts and dashboard functional
- [ ] Update flow works
- [ ] Public viewer works
- [ ] No critical bugs
- [ ] TypeScript compiles clean
- [ ] Deployed to Vercel successfully
- [ ] Beta tested with 5+ users

---

## XVIII. REFERENCE DOCUMENTS

All specifications derived from:

1. TELOS_Tool.md (Master Document)
2. TELOS_File_EduardoGarciaTorres_v1_0.md (Example Individual TELOS)
3. Daniel Miessler's TELOS Framework (https://github.com/danielmiessler/Telos)

---

**Document Version:** 1.0  
**Created:** 2025-01-05  
**Status:** Ready for Implementation