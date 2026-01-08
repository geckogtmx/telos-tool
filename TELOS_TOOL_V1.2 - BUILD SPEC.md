# TELOS Tool v1.2 - BUILD SPECIFICATION (Post-Phase 11)

## I. PROJECT STATUS

**Completed (Phase 1-11):**

- ✅ Authentication (Supabase)
- ✅ CV upload and parsing with PII scrubbing
- ✅ Individual TELOS generation (basic single-flow 7 questions)
- ✅ Open and password-protected hosting
- ✅ Dashboard with CRUD operations
- ✅ Update flow for existing TELOS files

**Remaining Work:**

- Extend Individual entity with Quick (5Q) vs Full (18Q) flow
- Add Organization entity type flow
- Add Agent entity type flow
- Refine question framework per v1.1 spec

---

## II. ENTITY TYPE ARCHITECTURE

### User Flow: Entity Selection

```
Landing/Dashboard
   ↓
Select Entity Type:
   ├─ Individual (Quick or Full)
   ├─ Organization (Full only)
   └─ Agent (Full only)
```

### Individual Path (Two-Tier)

```
Upload CV → Quick TELOS (5Q) → Generate → Preview
                                              ↓
                                       [Download] or [Continue to Full]
                                              ↓
                                       Full TELOS (13 more Q) → Regenerate → Preview → Save/Host
```

### Organization Path (Single-Tier)

```
Upload/Paste About Page → Full Questions (7Q) → Generate → Preview → Save/Host
```

### Agent Path (Single-Tier)

```
Upload/Paste System Prompt → Full Questions (7Q) → Generate → Preview → Save/Host
```

---

## III. PHASE 12: INDIVIDUAL QUICK TELOS (5 QUESTIONS)

### Goal

Enable users to generate a basic Individual TELOS in 3-5 minutes with option to expand to full version.

### Implementation Steps

#### 12.1: Update Entity Selection UI

- Add "Individual - Quick Start" vs "Individual - Full Profile" options
- Update routing to handle both paths

#### 12.2: Create Quick Question Flow

**Questions (from v1.1 framework):**

**Q1: Who are you in one paragraph?** _Your role, what you do, and the context you operate in._

**Q2: What are you trying to accomplish?** _The problems you're solving or outcomes you're working toward._

**Q3: What do you value and what do you avoid?** _Core principles you operate by, and things you explicitly don't want._

**Q4: How do you prefer to work and receive information?** _Your style: detailed vs. concise, structured vs. exploratory._

**Q5: What are you currently working on?** _Active projects, their status, and any blockers._

**Component:** `QuickQuestionFlow.tsx`

- Single-page form (no pagination)
- All 5 questions visible
- Optional CV upload at top (if user wants AI assist)
- Submit button generates Quick TELOS

#### 12.3: Quick TELOS Template

**Sections:**

- I. Identity (from Q1 + CV if provided)
- II. Purpose & Mission (from Q2)
- III. Values & Constraints (from Q3)
- IV. Work Style (from Q4)
- V. Active Projects (from Q5)

**Prompt adjustments:**

- Simpler structure
- More concise sections
- Flag as "Quick TELOS v1.0" in output

#### 12.4: Quick TELOS Preview + Upgrade Path

**Preview Screen:**

- Show generated Quick TELOS
- Two action buttons:
    - "Download Quick TELOS" (ends here)
    - "Continue to Full Profile" (proceeds to Phase 13)
- If user clicks "Continue," pre-fill their Q1-5 answers into Full flow

### Verification Checkpoint

- [ ]  Quick question flow renders correctly
- [ ]  CV upload optional but functional
- [ ]  Generates valid Quick TELOS markdown
- [ ]  Download works
- [ ]  "Continue to Full" button passes data forward

---

## IV. PHASE 13: INDIVIDUAL FULL TELOS (18 QUESTIONS TOTAL)

### Goal

Complete the full Individual TELOS with all 18 questions per v1.1 framework.

### Implementation Steps

#### 13.1: Extend Question Flow

**Additional Questions (13 more):**

**Section 1 Expansion:**

- Q1a: What's your professional background?
- Q1b: What domains are you an expert in?
- Q1c: What domains are you actively learning?

**Section 2 Expansion:**

- Q2a: What problems are you actively trying to solve?
- Q2b: What's your mission or purpose statement?
- Q2c: What are your current goals with rough timelines?

**Section 3 Expansion:**

- Q3a: What are your anti-goals?
- Q3b: What are your hard constraints?

**Section 4 Expansion:**

- Q4a: What's your typical session type?
- Q4b: When you're stuck, what do you want?
- Q4c: How much pushback do you want?
- Q4d: What's your feedback style preference?

**Section 5: Technical Context (NEW)**

- Q5a: What's your technical setup?
- Q5b: What's your technical skill level?
- Q5c: What programming languages/tools do you use?

**Section 6: Active Projects (EXPANDED)**

- Q6a: What are your active projects and their status?
- Q6b: What recurring challenges do you face?

**Section 7: Context Layer (NEW)**

- Q7a: What life context affects how you work?
- Q7b: Anything else an AI collaborator should know?

#### 13.2: Handle Upgrade Path

**If coming from Quick TELOS:**

- Pre-fill Q1 with their Quick Q1 answer
- Pre-fill Q2a/Q2b with their Quick Q2 answer
- Pre-fill Q3 with their Quick Q3 answer
- Pre-fill Q4 with their Quick Q4 answer
- Pre-fill Q6a with their Quick Q5 answer
- User refines these and fills new questions

**If starting with Full:**

- Empty form, all 18 questions from scratch

#### 13.3: Full TELOS Template

**Sections:**

- I. Identity & Background (Q1, Q1a, Q1b, Q1c)
- II. Problems & Mission (Q2, Q2a, Q2b, Q2c)
- III. Values & Constraints (Q3, Q3a, Q3b)
- IV. Work Style & Preferences (Q4, Q4a, Q4b, Q4c, Q4d)
- V. Technical Context (Q5a, Q5b, Q5c)
- VI. Active Projects & Challenges (Q6a, Q6b)
- VII. Life Context Layer (Q7a, Q7b)

#### 13.4: UI/UX Considerations

**Component:** `FullQuestionFlow.tsx`

- Multi-step form with progress indicator
- Group by section (7 steps)
- Skip options for optional questions (Q5c, Q7b)
- Review step before generation
- Longer generation time notice (~20-30 seconds)

### Verification Checkpoint

- [ ]  All 18 questions render correctly
- [ ]  Upgrade path pre-fills Quick answers
- [ ]  Section grouping logical and navigable
- [ ]  Full TELOS template complete
- [ ]  Generation prompt handles all sections
- [ ]  Output quality matches example TELOS files

---

## V. PHASE 14: ORGANIZATION ENTITY TYPE

### Goal

Enable creation of Organization TELOS files per Corporate TELOS example.

### Implementation Steps

#### 14.1: Organization Starting Input

**Options:**

- Upload About page URL (fetch and parse)
- Paste About page text
- Manual entry

**Component:** `OrgInputUpload.tsx`

- URL input with fetch functionality
- Text paste area
- Parse and extract: org name, history, mission statement

#### 14.2: Organization Question Flow

**Questions (7 total):**

**Q1: What problems does your organization solve?** _The core issues you address in the market._

**Q2: What's your organization's mission?** _Clear statement of organizational purpose._

**Q3: What are your core organizational values?** _The principles that guide decisions and culture._

**Q4: What does your organization explicitly avoid?** _Boundaries, anti-goals, things you won't do._

**Q5: How does your organization operate and make decisions?** _Structure, processes, decision-making approach._

**Q6: What are your current initiatives or programs?** _Active projects, their status, and priorities._

**Q7 (optional): Who are your key stakeholders?** _Internal and external parties that matter._

#### 14.3: Organization TELOS Template

**Sections:**

- I. Identity & History
- II. Problems & Mission
- III. Values & Operating Principles
- IV. Decision-Making & Processes
- V. Active Initiatives
- VI. Organizational Evolution (Decision Log)
- VII. Stakeholder Context (optional)

**Reference:** Use "TELOS Tool v1.1 — Corporate Telos Example" structure

#### 14.4: Organization-Specific Parsing

**Parse from About page:**

- Organization name
- Founded date / history
- Mission statement
- Key products/services
- Team size (if mentioned)

**Component:** `lib/parsers/about-parser.ts`

### Verification Checkpoint

- [ ]  About page URL fetch works
- [ ]  Text paste parsing extracts key info
- [ ]  7 questions render correctly
- [ ]  Generated TELOS matches Corporate example structure
- [ ]  Hosting and dashboard work for Org TELOS
- [ ]  Can update Org TELOS via same flow

---

## VI. PHASE 15: AGENT ENTITY TYPE

### Goal

Enable creation of Agent TELOS files per Agent Personas framework.

### Implementation Steps

#### 15.1: Agent Starting Input

**Options:**

- Upload existing system prompt (.txt, .md)
- Paste system prompt
- Manual entry

**Component:** `AgentInputUpload.tsx`

- File upload for prompts
- Text paste area
- Parse and extract: agent name, core function, constraints

#### 15.2: Agent Question Flow

**Questions (7 total):**

**Q1: What is this agent's primary function?** _Core purpose in one sentence._

**Q2: What problems does this agent solve?** _Issues it addresses for its principal._

**Q3: What are this agent's operating parameters?** _Values, priorities, how it makes decisions._

**Q4: What should this agent never do?** _Hard constraints, prohibitions, boundaries._

**Q5: How should this agent communicate?** _Tone, style, interaction patterns._

**Q6: What are this agent's current active tasks?** _Capabilities and scope._

**Q7 (optional): What system context affects this agent?** _Integration points, dependencies, environment._

#### 15.3: Agent TELOS Template

**Sections:**

- I. Identity & Purpose
- II. Scope & Authority
- III. Operating Parameters
- IV. Interaction Protocols
- V. Knowledge & Capabilities
- VI. Failure Handling
- VII. System Context (optional)

**Reference:** Use "TELOS Tool v1.1 — TELOS Framework for Agent Personas" structure

#### 15.4: Agent-Specific Parsing

**Parse from system prompt:**

- Agent name/designation
- Core function
- Explicit constraints
- Tone/personality markers

**Component:** `lib/parsers/prompt-parser.ts`

### Verification Checkpoint

- [ ]  System prompt upload works
- [ ]  Text paste parsing extracts key info
- [ ]  7 questions render correctly
- [ ]  Generated TELOS matches Agent example structure
- [ ]  Authority levels clearly delineated
- [ ]  Hosting and dashboard work for Agent TELOS
- [ ]  Can update Agent TELOS via same flow

---

## VII. DATABASE SCHEMA UPDATES

### Add Entity Type Support

**Update `telos_files` table:**

sql

```sql
-- Modify entity_type check constraint
ALTER TABLE telos_files 
DROP CONSTRAINT IF EXISTS telos_files_entity_type_check;

ALTER TABLE telos_files
ADD CONSTRAINT telos_files_entity_type_check 
CHECK (entity_type IN ('individual_quick', 'individual_full', 'organization', 'agent'));

-- Add question_version column
ALTER TABLE telos_files
ADD COLUMN question_version TEXT DEFAULT 'v1.1';

-- Add metadata for upgrade path
ALTER TABLE telos_files
ADD COLUMN upgraded_from UUID REFERENCES telos_files(id);
```

### Migration Notes

- `individual_quick` = 5-question version
- `individual_full` = 18-question version
- `upgraded_from` links Full TELOS to original Quick TELOS

---

## VIII. CONFIGURATION FILES

### Update Question Config

**File:** `config/questions/individual-quick.ts`

typescript

```typescript
export const INDIVIDUAL_QUICK_QUESTIONS = [
  {
    id: 'q1',
    section: 'identity',
    question: 'Who are you in one paragraph?',
    type: 'textarea',
    placeholder: 'Your role, what you do, context...',
    required: true
  },
  // ... 4 more questions
];
```

**File:** `config/questions/individual-full.ts`

typescript

```typescript
export const INDIVIDUAL_FULL_QUESTIONS = [
  // All 18 questions with section groupings
];
```

**File:** `config/questions/organization.ts`

typescript

```typescript
export const ORGANIZATION_QUESTIONS = [
  // 7 questions for organizations
];
```

**File:** `config/questions/agent.ts`

typescript

```typescript
export const AGENT_QUESTIONS = [
  // 7 questions for agents
];
```

---

## IX. CLAUDE API PROMPT UPDATES

### Individual Quick Prompt Template

typescript

```typescript
const QUICK_PROMPT = `
Generate a Quick TELOS file for an individual.

CV DATA (if provided):
{parsed_cv}

USER ANSWERS:
{answers}

Create a concise TELOS with these sections:
I. Identity
II. Purpose & Mission
III. Values & Constraints
IV. Work Style
V. Active Projects

Keep it practical and actionable. This is version 1.0 - user may expand later.
`;
```

### Individual Full Prompt Template

typescript

```typescript
const FULL_PROMPT = `
Generate a comprehensive TELOS file for an individual.

{upgraded_from_quick ? "PREVIOUS QUICK TELOS:\n{quick_content}\n\n" : ""}

CV DATA:
{parsed_cv}

USER ANSWERS (18 questions):
{answers}

Create a complete TELOS following this structure:
I. Identity & Background
II. Problems & Mission
III. Values & Constraints
IV. Work Style & Preferences
V. Technical Context
VI. Active Projects & Challenges
VII. Life Context Layer

Be comprehensive but focused. Reference the example TELOS files provided for tone and depth.
`;
```

### Organization Prompt Template

typescript

```typescript
const ORG_PROMPT = `
Generate an Organization TELOS file.

ABOUT PAGE DATA:
{parsed_about}

USER ANSWERS:
{answers}

Follow the Corporate TELOS structure:
I. Identity & History
II. Problems & Mission
III. Values & Operating Principles
IV. Decision-Making & Processes
V. Active Initiatives
VI. Organizational Evolution
VII. Stakeholder Context

Reference the Alma Security example for formatting and depth.
`;
```

### Agent Prompt Template

typescript

````typescript
const AGENT_PROMPT = `
Generate an Agent TELOS file.

SYSTEM PROMPT DATA:
{parsed_prompt}

USER ANSWERS:
{answers}

Follow the Agent Personas structure:
I. Identity & Purpose
II. Scope & Authority
III. Operating Parameters
IV. Interaction Protocols
V. Knowledge & Capabilities
VI. Failure Handling
VII. System Context

Be explicit about boundaries, authority levels, and constraints.
Reference the example agent TELOS files (Aria, Haven, Sentinel) for tone.
`;
```

---

## X. DEVELOPMENT WORKFLOW

### Phase Order
```
Phase 12 → Phase 13 → Phase 14 → Phase 15
(Quick)    (Full)     (Org)       (Agent)
````

### Branch Strategy

bash

```bash
main
├── feature/individual-quick (Phase 12)
├── feature/individual-full (Phase 13)
├── feature/organization (Phase 14)
└── feature/agent (Phase 15)
```

### Testing Sequence

**Phase 12:**

1. Quick flow generates valid TELOS
2. Download works
3. Continue button passes data to Phase 13

**Phase 13:**

1. Full flow from scratch works
2. Full flow with Quick upgrade works
3. All 18 questions captured correctly
4. Generated TELOS matches example quality

**Phase 14:**

1. About page parsing works
2. Organization questions flow works
3. Generated Org TELOS matches Corporate example
4. Hosting/dashboard integration works

**Phase 15:**

1. System prompt parsing works
2. Agent questions flow works
3. Generated Agent TELOS matches Agent examples
4. Hosting/dashboard integration works

---

## XI. CRITICAL REMINDERS

### For Claude Code

1. **TypeScript strict mode** - No `any` types
2. **Verify after each phase** - Run `npm run build` before committing
3. **Test locally** - Use actual CV/About page/System prompt files
4. **Reference examples** - Use provided TELOS files as quality benchmarks
5. **Question flow UX** - Keep forms navigable and intuitive
6. **Error handling** - Every async operation needs try/catch
7. **Loading states** - Show progress for generation (Quick: ~10s, Full: ~20s)

### Quality Gates

**Before marking phase complete:**

- [ ]  All verification checkpoints passed
- [ ]  TypeScript compiles clean
- [ ]  Generated TELOS quality matches examples
- [ ]  Hosting features work without changes
- [ ]  Dashboard shows all entity types correctly
- [ ]  Update flow works for new entity types

---

## XII. SUCCESS CRITERIA

### v1.2 Complete When:

- [ ]  Individual Quick (5Q) TELOS functional
- [ ]  Individual Full (18Q) TELOS functional
- [ ]  Upgrade path from Quick to Full works
- [ ]  Organization TELOS functional
- [ ]  Agent TELOS functional
- [ ]  All entity types use shared hosting infrastructure
- [ ]  Dashboard shows all entity types
- [ ]  Update flows work for all types
- [ ]  Generated TELOS quality matches provided examples
- [ ]  No regression in existing features

---

## XIII. REFERENCE DOCUMENTS

**For Implementation:**

- `TELOS Tool v1.1 — Question Framework.md` (question structure)
- `TELOS Tool v1.1 — Corporate Telos Example.md` (Organization template)
- `TELOS Tool v1.1 — TELOS Framework for Agent Personas.md` (Agent framework)
- `AGENT TELOS - Aria.md`, `Haven.md`, `Sentinel.md` (Agent examples)
- `TELOS FILE - Dr. Priya Sharma.md` (Individual example)
- `TELOS FILE - Marcus Chen.md` (Individual example)

---

**Document Version:** 1.2  
**Created:** 2025-01-07  
**Status:** Ready for Implementation (Post-Phase 11)