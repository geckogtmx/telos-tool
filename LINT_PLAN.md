# Linting Fix Plan

## Objective
Resolve the 18 ESLint issues (12 errors, 6 warnings) identified in the codebase to ensure code quality and prevent deployment failures.

## Execution Steps

### Step 1: Fix Unescaped Entities
**Target Files:**
- `app/auth/login/page.tsx`
- `app/generate/agent/page.tsx`
- `app/generate/organization/page.tsx`
- `app/page.tsx`

**Action:**
- Replace `'` with `&apos;`
- Replace `"` with `&quot;`

### Step 2: Resolve `any` Types
**Target Files:**
- `app/auth/signup/page.tsx`
- `components/FileUpload.tsx`

**Action:**
- Identify the correct type (e.g., `React.ChangeEvent`, Supabase error types).
- Replace explicit `any` usage.

### Step 3: Remove Unused Variables
**Target Files:**
- `app/generate/agent/page.tsx` (`saveError`)
- `app/generate/individual/page.tsx` (`file`, `saveError`)
- `app/generate/organization/page.tsx` (`saveError`)
- `app/page.tsx` (`APP_NAME`)

**Action:**
- Remove the unused variable declarations.

### Step 4: Fix Hook Dependencies
**Target File:**
- `components/DashboardFileList.tsx`

**Action:**
- Analyze `useEffect` dependency on `fetchFiles`.
- Wrap `fetchFiles` in `useCallback` or add to dependency array if stable.

### Step 5: Address Best Practices
**Target File:**
- `lib/supabase/middleware.ts`

**Action:**
- Change `let supabaseResponse` to `const supabaseResponse`.

### Step 6: Verification
**Action:**
- Run `npm run lint` to verify zero issues.
- Run `npm run build` to ensure no regression.
