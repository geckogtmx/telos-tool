import { NextResponse } from 'next/server';

// Diagnostic endpoint to check environment configuration
// Does NOT expose actual values, only checks if they exist
export async function GET() {
  const config = {
    ANTHROPIC_API_KEY: !!process.env.ANTHROPIC_API_KEY,
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };

  const missingKeys = Object.entries(config)
    .filter(([, exists]) => !exists)
    .map(([key]) => key);

  return NextResponse.json({
    status: missingKeys.length === 0 ? 'ok' : 'missing_config',
    configured: config,
    missing: missingKeys,
    hint: missingKeys.includes('ANTHROPIC_API_KEY')
      ? 'Add ANTHROPIC_API_KEY=your_api_key to .env.local and restart the dev server'
      : null,
  });
}
