# TELOS Tool - Gemini Code Documentation

## Project Overview

**Name:** TELOS Tool v1.0
**Purpose:** Production-ready TELOS generation platform
**Current Status:** Phases 1-11 Complete
**AI Integration:** Dual-provider support (Anthropic Claude & Google Gemini)

## Gemini Integration Details

The project supports Google Gemini as a first-class AI provider for generating TELOS documents. This allows users to leverage their Gemini API quotas or prefer Gemini's specific capabilities.

### Configuration

The AI provider is selected via the `AI_PROVIDER` environment variable or the `config/ai-model.ts` file.

**Environment Variable:**
```bash
# .env.local
AI_PROVIDER=gemini
GEMINI_API_KEY=your_key_here
```

**Config File (`config/ai-model.ts`):**
```typescript
export const AI_CONFIG = {
  provider: (process.env.AI_PROVIDER || 'claude') as AIProvider,
  geminiModel: 'gemini-2.0-flash', // Currently verified model
  // ...
};
```

### Implementation

1.  **Wrapper:** `lib/generators/gemini-api.ts`
    *   Uses `@google/generative-ai` SDK.
    *   Configured to use `gemini-2.0-flash` which offers high speed and reliability.
    *   Handles content generation requests.

2.  **Generator Logic:** `lib/generators/telos-generator.ts`
    *   Checks `AI_CONFIG.provider`.
    *   Routes requests to `generateWithGemini` if provider is 'gemini'.
    *   Passes the constructed prompt (parsed CV + answers) to the model.

## Recent Updates (Phases 10-11)

*   **Dashboard:** View all your TELOS files, filter by type, and delete unwanted files.
*   **Update Flow:** Edit previous answers and re-generate your TELOS while keeping the same link.
*   **UX Refinements:** Hidden "Finish" button on edits, pre-selected hosting status, and "Time Ago" formatting.

## Security & Performance Audit (January 2026)

A comprehensive audit was performed on 2026-01-08. Detailed findings and remediation plans can be found in [SECURITY_AUDIT.md](./SECURITY_AUDIT.md).

### Summary of Issues:
1. **SSRF Risk:** URL parser lacked comprehensive internal IP blocking. (**Remediation in progress**)
2. **XSS Risk:** Use of `dangerouslySetInnerHTML`. (**Verified Secure** via DOMPurify)
3. **DB Security:** RLS policies verification. (**Verified Secure**)
4. **Performance:** AI generation timeouts. (**Documented**)

---
**Last Updated:** 2026-01-08

## Code Quality & Linting (ESLint)

A comprehensive cleanup was performed to address identified linting issues.

### Status:
*   **React/JSX:** Unescaped entities in `app/page.tsx`, `app/auth/login/page.tsx`, etc. - **Fixed**
*   **TypeScript:** Use of `any` types in `app/auth/signup/page.tsx` and `components/FileUpload.tsx` - **Fixed**
*   **Logic/Hooks:** Missing dependency in `useEffect` within `components/DashboardFileList.tsx` - **Fixed**
*   **Unused Variables:** `saveError`, `APP_NAME`, and `file` - **Removed**
*   **Best Practices:** `prefer-const` violation in `lib/supabase/middleware.ts` - **Fixed**

### UI & UX Polish
*   **Entity Selector Alignment:** Fixed misalignment on `/generate` page by adjusting grid from 4 to 3 columns to match content. Added `h-full` to ensure uniform card heights.

**Current Status:** Complete (0 errors, 0 warnings)

## Technical Debt & Future Decisions

### Middleware Deprecation Warning
*   **Issue:** `npm run build` reports: `⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.`
*   **Decision:** Defer refactoring. (Date: 2026-01-08)
*   **Reasoning:** The current `middleware.ts` implementation handles critical Supabase authentication and route protection. Since it is currently stable and fully functional in the present version of Next.js, the risk of breaking authentication logic outweighs the benefits of migrating to the new "proxy" convention at this stage.
*   **Priority:** Low.

---
**Last Updated:** 2026-01-08
