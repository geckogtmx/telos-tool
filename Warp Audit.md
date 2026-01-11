1. Secrets & configuration (highest priority)

Finding: powerful secrets present in .env.local

File: .env.local

Contains:

•  NEXT_PUBLIC_SUPABASE_URL
•  NEXT_PUBLIC_SUPABASE_ANON_KEY
•  SUPABASE_SERVICE_ROLE_KEY
•  ANTHROPIC_API_KEY
•  GEMINI_API_KEY
•  BLOB_READ_WRITE_TOKEN (currently empty)
•  NEXT_PUBLIC_APP_URL

Risks

•  The Supabase service role key is extremely sensitive: with it, an attacker can bypass all RLS and read/modify any data.
•  Anthropic and Gemini keys can be used to spend your AI quota.
•  If .env.local is ever committed or leaked (e.g. pushing to a public repo, screenshots, copying to issue tracker), these secrets should be considered compromised.

Mitigations / actions

•  .gitignore already has .env*, so new .env.local changes won’t be committed. Still, you should:
◦  Confirm with git --no-pager log -- .env.local .env (or via Git GUI) that no env files were ever committed.
◦  If they were, rotate:
▪  Regenerate Supabase service role key and anon key in the Supabase dashboard.
▪  Regenerate Anthropic and Gemini keys.
•  Treat .env.local as development-only and never share it. Use separate keys per environment (dev/staging/prod).



2. SSRF surface in parse-url endpoint

File: app/api/parse-url/route.ts

You have already implemented strong checks (as described in SECURITY_AUDIT.md):

•  Restricts protocol to http: / https:.
•  Blocks hostnames:
◦  localhost, 127.0.0.1, 0.0.0.0, ::1
◦  RFC1918 ranges: 192.168.*, 10.*, 172.16.*–172.31.*
◦  169.254.* (link-local / metadata)
◦  Hostnames ending in .local, .internal

This is much better than the typical “just new URL()” implementation.

Residual risks / hardening ideas

•  The check is only on the hostname string, not on resolved IPs. A malicious domain could resolve to an internal IP (DNS rebinding / misconfigured DNS), and this code wouldn’t catch it.
•  You’re allowing arbitrary external URLs; the endpoint can still be used as:
◦  A blind HTTP client for scanning external services.
◦  A way to fetch very large responses (possible DoS angle on your serverless function).

Suggested hardening (if you want to tighten further)

Not strictly required, but for a more “defense-in-depth” posture:

•  Resolve and validate IPs:
◦  Perform DNS lookup in the server, and reject if any resolved IP is private/loopback/metadata ranges, not just by hostname pattern.
•  Consider an allowlist:
◦  If your use case is mainly CVs/TELOS from a small set of domains (e.g. your own or specific partners), replace the blocklist with an allowlist.
•  Add safety limits:
◦  Enforce a timeout and maximum content size on the fetch.
◦  Consider restricting allowed ports to 80/443.



3. XSS surface in TELOS rendering

3.1 Main preview (good)

File: components/TELOSPreview.tsx

•  Inline markdown formatting uses formatInlineMarkdown(...) and then wraps it into elements.
•  Wherever you use dangerouslySetInnerHTML, you pass it through DOMPurify.sanitize(...) first:
◦  For bullets, blockquotes, and paragraphs you do:
tsx
    and similar for <p> inside blockquotes and paragraphs.

•  That matches the claim in SECURITY_AUDIT.md: “Verified secure via DOMPurify”.

Assuming DOMPurify is configured normally, this is a good pattern.

3.2 Print view (potential XSS in secondary view)

Still in components/TELOSPreview.tsx, in handlePrint():

•  You do:
ts
•  Here content is interpolated directly into HTML without DOMPurify or escaping. If content ever contains <script>...</script> or <img onerror=...>, that will execute in the new window.

Today content is AI-generated TELOS markdown, not arbitrary user HTML, but:
•  Prompted models can be induced to emit raw HTML/JS if users try.
•  Even if this is only a same-origin print window, it’s still an XSS vector (malicious content can run JS with your origin).

Mitigation

•  Before building htmlContent, sanitize or escape the text:

  Option A – sanitize the final HTML string:
ts
  Option B – escape every trimmed before wrapping in tags (convert  to &lt;, etc.) so it’s always treated as text, not HTML.



4. Authentication, authorization & data access

4.1 API routes

Checked:

•  app/api/generate-telos/route.ts
•  app/api/save-telos/route.ts
•  app/api/update-telos/route.ts
•  app/api/parse-url/route.ts
•  app/api/check-config/route.ts

Patterns:

•  Auth enforced via createClient() + supabase.auth.getUser() in each route that handles sensitive data:
◦  If no user: respond with 401 Unauthorized.
•  Input validation via Zod (z.object(...), .safeParse(...)) in generate-telos, save-telos, update-telos.
•  Ownership checks:
◦  save-telos: always inserts user_id: user.id.
◦  update-telos:
▪  Fetches row by id and checks existing.user_id === user.id before update.
•  Error handling:
◦  4xx for validation/auth problems, 5xx for internal/DB errors.

These are solid patterns; I don’t see obvious missing auth checks in the main TELOS CRUD flow.

4.2 Public TELOS viewing

File: app/t/[id]/page.tsx

•  Uses adminClient (service role) to load:
ts
•  Behavior by hosting type:
◦  private:
▪  Fetch current Supabase user via createClient() (RLS client).
▪  If missing or not owner:
▪  If not logged in: redirect to /auth/login?next=/t/${id}.
▪  If logged in but not owner: notFound().
◦  encrypted:
▪  isEncrypted = true, but content = null – TELOS content doesn’t go to client from this route.
▪  Presumably the client component (TELOSViewer) then does a password-based unlock via other API routes.
◦  open:
▪  content = file.generated_content goes straight to client; that matches the RLS policy for public content.

Security note

•  This is a good pattern: using service role on the server for lookups, but not sending encrypted content by default.
•  You do still fetch generated_content for encrypted/private rows on the server. That’s okay as long as you don’t leak it to the client without checking ownership/password (which you don’t here).

4.3 Supabase RLS configuration

File: supabase/migrations/20240106000000_initial_schema.sql

•  RLS is enabled on telos_files.
•  Policies:
◦  “Users can view/insert/update own TELOS files” – all bound to auth.uid() = user_id.
◦  “Public TELOS files viewable by public_id”:
sql
•  Commented design notes explicitly reject allowing RLS-based access to encrypted files; instead, you use the service role from the API.

Implications

•  With the anon key, any client could theoretically issue broader SELECTs through Supabase (e.g. all hosting_type = 'open'), but that’s expected for “open” content by definition.
•  For stricter privacy on open files, you could:
◦  Restrict which columns are exposed in public selects (e.g. via PostgREST column permissions or views).
◦  Use a dedicated “public view” with only non-sensitive columns.



5. Other observations

•  Password handling: lib/storage/encryption.ts uses bcrypt (hashPassword / verifyPassword) with a reasonable cost factor (10). No plain-text storage of passwords in DB; only hashes.
•  Config-check endpoint app/api/check-config/route.ts:
◦  Only reports boolean presence of env vars (no values).
◦  Restricted to authenticated users.
◦  This is fine; minimal info disclosure.
•  Logging:
◦  app/auth/signup/page.tsx logs email and some Supabase config values and signup responses to the browser console.
◦  Not directly a security bug, but for production you may want to:
▪  Remove or gate debug logs in NODE_ENV === 'production'.
▪  Avoid logging detailed error objects that might contain internal metadata.



6. Suggested next steps

If you want to tighten security further, I’d prioritize:

1. Secret hygiene
◦  Confirm .env files were never committed.
◦  Rotate Supabase service role + anon keys and AI keys if there’s any chance they leaked.
2. XSS hardening
◦  Sanitize/escape content used in the print view in TELOSPreview (section 3.2).
3. SSRF hardening (optional, defense-in-depth)
◦  Optionally add DNS/IP-based checks and/or an allowlist in app/api/parse-url/route.ts.
4. Dependency & runtime checks
◦  Run npm audit and review any high/critical issues.
◦  Run npm run lint and npm run build regularly to catch new issues as dependencies evolve.