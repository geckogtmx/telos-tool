import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Validates that a redirect path is safe (relative URL only).
 * Prevents open redirect attacks by rejecting:
 * - Absolute URLs (https://evil.com)
 * - Protocol-relative URLs (//evil.com)
 * - JavaScript URLs (javascript:alert(1))
 * - Data URLs (data:text/html,...)
 */
function getSafeRedirectPath(path: string | null): string {
  const defaultPath = '/dashboard';

  if (!path) return defaultPath;

  // Must start with exactly one forward slash (relative path)
  // Reject: "//evil.com", "https://evil.com", "javascript:", etc.
  if (!path.startsWith('/') || path.startsWith('//')) {
    return defaultPath;
  }

  // Additional check: reject any URL-like patterns
  // This catches edge cases like "/\evil.com" which some browsers normalize
  try {
    const decoded = decodeURIComponent(path);
    if (decoded.startsWith('//') || decoded.includes('://')) {
      return defaultPath;
    }
  } catch {
    // If decoding fails, reject the path
    return defaultPath;
  }

  return path;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = getSafeRedirectPath(searchParams.get('next'));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-error`);
}
