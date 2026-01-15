# CURSOR_REVIEW.md

> Comprehensive security, quality, and clarity review for the TELOS Tool repository. This document is optimized for AI dev models to reference during code generation and review tasks.

## Executive Summary

| Category | Rating | Status |
|----------|--------|--------|
| **Security** | 8.5/10 | Strong practices, minor improvements needed |
| **Code Quality** | 8/10 | Well-structured, needs lint fixes and more tests |
| **Clarity** | 7.5/10 | Good docs, could use more API documentation |
| **Overall** | 8/10 | Production-ready with recommended improvements |

**Key Findings:**
- ✅ Strong security posture with proper authentication, authorization, and XSS protection
- ✅ Well-structured codebase with consistent patterns
- ⚠️ 18 ESLint issues need resolution (see [LINT_PLAN.md](LINT_PLAN.md))
- ⚠️ Test coverage is limited (only 3 test files)
- ⚠️ Rate limiting is in-memory (not distributed)

---

## Security Review

### ✅ Strengths

#### 1. XSS Protection
**Status:** Secure

- **Location:** `components/TELOSPreview.tsx`
- **Implementation:** All `dangerouslySetInnerHTML` usage is wrapped with `DOMPurify.sanitize()`
- **Lines:** 170, 183, 281
- **Print Function:** HTML escaping implemented (lines 79-86)

```typescript
// ✅ CORRECT PATTERN
<li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(formatInlineMarkdown(item)) }} />

// ✅ CORRECT: Print function escapes HTML
const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};
```

**For Dev Models:** Always use `DOMPurify.sanitize()` before `dangerouslySetInnerHTML`. Never trust user-generated or AI-generated content without sanitization.

#### 2. Authentication & Authorization
**Status:** Secure

- **Pattern:** All sensitive API routes check authentication
- **Files:** `app/api/generate-telos/route.ts`, `app/api/save-telos/route.ts`, `app/api/update-telos/route.ts`
- **Implementation:**

```typescript
// ✅ CORRECT PATTERN - Always check auth first
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
if (!user) {
  return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
}
```

- **Ownership Verification:** `app/api/update-telos/route.ts` verifies ownership before updates (lines 54-67)
- **RLS Policies:** Supabase Row Level Security enabled in `supabase/migrations/20240106000000_initial_schema.sql`

**For Dev Models:** Always verify authentication before processing sensitive operations. Check ownership before allowing updates/deletes.

#### 3. Password Security
**Status:** Secure

- **Location:** `lib/storage/encryption.ts`
- **Implementation:** bcrypt with salt rounds (10)
- **Password Requirements:** Enforced in `app/api/save-telos/route.ts` (lines 57-72)
  - Minimum 12 characters
  - Must contain uppercase, lowercase, and number

```typescript
// ✅ CORRECT: Password hashing
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}
```

**For Dev Models:** Never store passwords in plaintext. Always use bcrypt or similar with appropriate salt rounds.

#### 4. Input Validation
**Status:** Secure

- **Pattern:** Zod schemas used throughout API routes
- **Examples:**
  - `app/api/generate-telos/route.ts` (lines 8-15)
  - `app/api/save-telos/route.ts` (lines 17-27)
  - `app/api/update-telos/route.ts` (lines 16-26)

```typescript
// ✅ CORRECT PATTERN: Zod validation
const saveSchema = z.object({
  entityType: z.enum(['individual', 'organization', 'agent']),
  entityName: z.string()
    .min(1, 'Entity name is required')
    .max(255, 'Entity name must be 255 characters or less')
    .transform(sanitizeEntityName),
  // ...
});

const result = saveSchema.safeParse(body);
if (!result.success) {
  return NextResponse.json(
    { success: false, error: 'Invalid input', details: result.error },
    { status: 400 }
  );
}
```

**For Dev Models:** Always validate input with Zod schemas. Use `.safeParse()` and return 400 errors for invalid input.

#### 5. Rate Limiting
**Status:** Functional but needs improvement for scale

- **Location:** `lib/rate-limit.ts`
- **Implementation:** In-memory sliding window algorithm
- **Tiers:**
  - `authLimiter`: 5 requests/minute (password attempts)
  - `strictLimiter`: 10 requests/minute (expensive operations)
  - `standardLimiter`: 60 requests/minute (standard API calls)

```typescript
// ✅ CORRECT PATTERN: Apply rate limiting
const rateLimitResponse = await applyRateLimit(request, strictLimiter, 'generate-telos');
if (rateLimitResponse) return rateLimitResponse;
```

**⚠️ Limitation:** In-memory rate limiting won't work across multiple serverless instances. For production scale, consider Redis-based solution (e.g., Upstash).

**For Dev Models:** Always apply rate limiting to API routes, especially expensive operations. Use appropriate tier based on operation cost.

#### 6. Security Headers
**Status:** Secure

- **Location:** `next.config.ts` (lines 6-49)
- **Headers Configured:**
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Content-Security-Policy` (comprehensive)
  - `Referrer-Policy: strict-origin-when-cross-origin`

**For Dev Models:** Security headers are already configured. Don't modify without security review.

#### 7. PII Scrubbing
**Status:** Secure

- **Location:** `lib/parsers/pii-scrubber.ts`
- **Patterns Detected:** Phone, email, SSN, credit card, address, tax ID, passport
- **Applied to:** CV uploads in `app/api/parse-cv/route.ts`

**For Dev Models:** PII scrubbing is automatic for CV uploads. Don't bypass this for any reason.

### ⚠️ Areas for Improvement

#### 1. SSRF Protection (parse-url endpoint)
**Status:** Endpoint not found in codebase

- **Expected Location:** `app/api/parse-url/route.ts`
- **Issue:** Referenced in `SECURITY_AUDIT.md` but file doesn't exist
- **If Re-implementing:** Must include:
  - DNS resolution checks (prevent DNS rebinding)
  - Response size limits
  - Timeout enforcement
  - Blocklist for private IP ranges (already documented in audit)
  - Consider allowlist if use case is limited

**For Dev Models:** If implementing URL parsing, never trust user-provided URLs. Always validate resolved IPs, not just hostnames.

#### 2. Environment Variable Security
**Status:** No hardcoded secrets found

- **Action Required:** Verify `.env.local` was never committed to git
- **Command:** `git log --all --full-history -- .env.local .env`
- **If Found:** Rotate all keys (Supabase service role, anon key, AI API keys)

**For Dev Models:** Never commit `.env.local` or any file containing secrets. Always use environment variables, never hardcode.

#### 3. Error Logging
**Status:** Some verbose logging found

- **Issue:** 57 `console.log/error/warn` calls across 22 files
- **Recommendation:** 
  - Gate debug logs behind `NODE_ENV !== 'production'`
  - Sanitize error objects before logging
  - Consider structured logging library

**For Dev Models:** Don't log sensitive data. Sanitize error objects. Use environment checks for debug logs.

#### 4. Rate Limiting Scalability
**Status:** Functional but not distributed

- **Current:** In-memory (per-instance)
- **Recommendation:** Use Redis-based solution (e.g., `@upstash/ratelimit`) for production
- **Impact:** Low priority unless scaling to multiple instances

**For Dev Models:** Current rate limiting works for single-instance deployments. For multi-instance, implement Redis-based solution.

---

## Code Quality Assessment

### ✅ Strengths

#### 1. TypeScript Configuration
**Status:** Excellent

- **Location:** `tsconfig.json`
- **Settings:** Strict mode enabled
- **Coverage:** Strong typing throughout codebase
- **Issues:** Minimal `any` usage (some noted in `LINT_PLAN.md`)

**For Dev Models:** Maintain strict TypeScript. Avoid `any` types. Use proper type definitions.

#### 2. Architecture
**Status:** Well-organized

- **Structure:**
  - `lib/` - Business logic (parsers, generators, utilities)
  - `app/api/` - API routes
  - `components/` - React components
  - `types/` - TypeScript definitions
- **Patterns:** Consistent across codebase
- **Separation of Concerns:** Clear boundaries

**For Dev Models:** Follow existing architecture patterns. Keep business logic in `lib/`, API routes in `app/api/`.

#### 3. Error Handling
**Status:** Good

- **Custom Exceptions:** `ClaudeAPIException`, `CVParseException`, `AgentParseException`
- **Retry Logic:** Implemented for rate limits in `lib/generators/claude-api.ts`
- **User-Friendly Messages:** Error messages are clear and actionable

```typescript
// ✅ CORRECT PATTERN: Custom exceptions
export class ClaudeAPIException extends Error {
  constructor(
    public type: ClaudeAPIError,
    message: string
  ) {
    super(message);
    this.name = 'ClaudeAPIException';
  }
}
```

**For Dev Models:** Use custom exception classes for better error categorization. Provide user-friendly error messages.

#### 4. Code Organization
**Status:** Excellent

- **File Structure:** Logical and intuitive
- **Naming:** Consistent conventions
- **Reusability:** Components are modular

**For Dev Models:** Follow existing naming conventions and file structure.

### ⚠️ Areas for Improvement

#### 1. Linting Issues
**Status:** 18 ESLint issues need resolution

- **Reference:** See [LINT_PLAN.md](LINT_PLAN.md) for details
- **Breakdown:**
  - 12 errors
  - 6 warnings
- **Types:**
  - Unescaped entities in JSX
  - Unused variables
  - Hook dependencies
  - `any` types

**For Dev Models:** Run `npm run lint` before committing. Fix all errors and warnings. Reference `LINT_PLAN.md` for specific fixes.

#### 2. Test Coverage
**Status:** Limited

- **Current Tests:** Only 3 test files found
  - `lib/parsers/__tests__/cv-parser.test.ts`
  - `lib/parsers/__tests__/pii-scrubber.test.ts`
  - `lib/generators/__tests__/telos-generator.test.ts`
- **Missing Tests:**
  - API routes (no integration tests)
  - Authentication flows
  - Error handling paths
  - Component rendering

**For Dev Models:** Add tests for new features. Aim for 70%+ coverage. Test error paths, not just happy paths.

#### 3. Console Logging
**Status:** Needs cleanup

- **Count:** 57 console statements across 22 files
- **Recommendation:**
  - Use structured logging library
  - Gate debug logs: `if (process.env.NODE_ENV !== 'production')`
  - Remove or sanitize verbose error logs

**For Dev Models:** Avoid `console.log` in production code. Use structured logging. Gate debug logs behind environment checks.

#### 4. Type Safety
**Status:** Mostly good, some improvements needed

- **Issue:** `rawInput: z.any()` in save/update schemas
- **Location:** `app/api/save-telos/route.ts` (line 23), `app/api/update-telos/route.ts` (line 22)
- **Recommendation:** Define proper types for JSONB data

**For Dev Models:** Avoid `z.any()`. Define proper types for all data structures.

---

## Clarity & Documentation

### ✅ Strengths

#### 1. Documentation
**Status:** Good

- **README.md:** Clear setup instructions, project structure
- **SECURITY_AUDIT.md:** Comprehensive security findings
- **Build Specs:** Detailed development plans
- **Inline Comments:** Security decisions documented

**For Dev Models:** Read existing documentation before making changes. Maintain inline comments for complex logic.

#### 2. Code Comments
**Status:** Good

- **Security Decisions:** Documented (e.g., RLS policy comments)
- **Complex Logic:** Explained
- **Rate Limiter:** Usage documented

**For Dev Models:** Add comments for non-obvious code, especially security-related decisions.

#### 3. Project Structure
**Status:** Self-explanatory

- **Directory Layout:** Intuitive
- **Naming:** Consistent
- **Organization:** Logical grouping

**For Dev Models:** Follow existing structure. Don't create new top-level directories without discussion.

### ⚠️ Areas for Improvement

#### 1. API Documentation
**Status:** Missing

- **Issue:** No OpenAPI/Swagger specification
- **Recommendation:** Document API endpoints, request/response formats
- **Priority:** Low

**For Dev Models:** If adding new API endpoints, document them. Consider OpenAPI spec for future.

#### 2. Environment Variables
**Status:** Documented but could be better

- **Current:** README lists required vars
- **Recommendation:** Create `.env.example` file (if not present)
- **Priority:** Medium

**For Dev Models:** If adding new environment variables, document them in README and `.env.example`.

#### 3. Deployment Guide
**Status:** Basic

- **Current:** README mentions deployment
- **Recommendation:** Add detailed production deployment checklist
- **Priority:** Low

**For Dev Models:** Follow deployment practices. Document any new deployment requirements.

#### 4. Architecture Documentation
**Status:** Missing

- **Issue:** No high-level architecture diagram
- **Recommendation:** Document data flow (upload → parse → generate → save)
- **Priority:** Low

**For Dev Models:** Understand the data flow before making changes. Document architectural decisions.

---

## Actionable Recommendations

### 🔴 High Priority

1. **Fix ESLint Issues**
   - **Files:** See [LINT_PLAN.md](LINT_PLAN.md)
   - **Action:** Resolve all 18 issues (12 errors, 6 warnings)
   - **Command:** `npm run lint`

2. **Add Test Coverage**
   - **Target:** 70%+ coverage
   - **Priority Files:**
     - `app/api/*/route.ts` (API route tests)
     - `components/*.tsx` (Component tests)
     - Error handling paths
   - **Command:** `npm test`

3. **Verify Secret Security**
   - **Action:** Check git history for `.env.local` commits
   - **Command:** `git log --all --full-history -- .env.local .env`
   - **If Found:** Rotate all keys immediately

### 🟡 Medium Priority

1. **Implement Distributed Rate Limiting**
   - **Current:** `lib/rate-limit.ts` (in-memory)
   - **Recommendation:** Use `@upstash/ratelimit` for Redis-based solution
   - **Impact:** Required for multi-instance deployments

2. **Add Structured Logging**
   - **Current:** 57 console statements
   - **Recommendation:** Use logging library (e.g., `pino`, `winston`)
   - **Action:** Gate debug logs, sanitize error objects

3. **Improve Type Safety**
   - **Files:** `app/api/save-telos/route.ts`, `app/api/update-telos/route.ts`
   - **Action:** Replace `z.any()` with proper types for `rawInput`

4. **Create `.env.example`**
   - **Action:** Template file with all required environment variables (no values)
   - **Purpose:** Help developers set up local environment

### 🟢 Low Priority

1. **Add API Documentation**
   - **Format:** OpenAPI/Swagger specification
   - **Coverage:** All API endpoints in `app/api/`

2. **Create Architecture Diagram**
   - **Content:** Data flow, component relationships
   - **Format:** Mermaid or similar

3. **Add Deployment Guide**
   - **Content:** Production deployment checklist
   - **Location:** README or separate `DEPLOYMENT.md`

4. **Enhance Error Messages**
   - **Action:** Review and sanitize error responses
   - **Goal:** Prevent information leakage

---

## Quick Reference for Dev Models

### ✅ DO's

- ✅ Always use `DOMPurify.sanitize()` before `dangerouslySetInnerHTML`
- ✅ Always check authentication with `supabase.auth.getUser()` in API routes
- ✅ Always validate input with Zod schemas using `.safeParse()`
- ✅ Always apply rate limiting to API routes
- ✅ Always use bcrypt for password hashing
- ✅ Always verify ownership before updates/deletes
- ✅ Always use TypeScript strict mode
- ✅ Always add tests for new features
- ✅ Always document security decisions in comments
- ✅ Always follow existing code patterns and structure

### ❌ DON'Ts

- ❌ Never trust user input without validation
- ❌ Never bypass authentication checks
- ❌ Never store passwords in plaintext
- ❌ Never commit `.env.local` or secrets
- ❌ Never use `any` types without justification
- ❌ Never skip rate limiting on API routes
- ❌ Never log sensitive data
- ❌ Never use `dangerouslySetInnerHTML` without sanitization
- ❌ Never modify security headers without review
- ❌ Never skip error handling

### 🔍 Key Files to Reference

- **Security:** `components/TELOSPreview.tsx`, `lib/storage/encryption.ts`, `next.config.ts`
- **API Patterns:** `app/api/generate-telos/route.ts`, `app/api/save-telos/route.ts`
- **Rate Limiting:** `lib/rate-limit.ts`
- **Validation:** Any `app/api/*/route.ts` file (Zod schemas)
- **Database:** `supabase/migrations/20240106000000_initial_schema.sql`
- **Existing Docs:** `SECURITY_AUDIT.md`, `LINT_PLAN.md`, `README.md`

### 📋 Code Patterns

#### API Route Pattern
```typescript
export async function POST(request: NextRequest) {
  try {
    // 1. Rate limit
    const rateLimitResponse = await applyRateLimit(request, strictLimiter, 'route-name');
    if (rateLimitResponse) return rateLimitResponse;

    // 2. Auth check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // 3. Parse and validate
    const body = await request.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: result.error },
        { status: 400 }
      );
    }

    // 4. Process request
    // ...

    // 5. Return response
    return NextResponse.json({ success: true, data: ... });
  } catch (error) {
    console.error('Route error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

#### XSS Protection Pattern
```typescript
// ✅ CORRECT
<li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />

// ❌ WRONG
<li dangerouslySetInnerHTML={{ __html: content }} />
```

#### Input Validation Pattern
```typescript
// ✅ CORRECT
const schema = z.object({
  field: z.string().min(1).max(255),
});
const result = schema.safeParse(body);
if (!result.success) {
  return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
}

// ❌ WRONG
const field = body.field; // No validation
```

---

## Related Documents

- [SECURITY_AUDIT.md](SECURITY_AUDIT.md) - Detailed security audit findings
- [LINT_PLAN.md](LINT_PLAN.md) - ESLint issues and fixes
- [README.md](README.md) - Project setup and overview
- [Warp Audit.md](Warp Audit.md) - External security audit

---

**Last Updated:** January 2026  
**Review Status:** Complete  
**Next Review:** Recommended after addressing high-priority items
