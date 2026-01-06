'use client';

export default function TestEnvPage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variable Test</h1>
      <div className="bg-gray-100 p-4 rounded">
        <p className="mb-2">
          <strong>NEXT_PUBLIC_SUPABASE_URL:</strong>{' '}
          {process.env.NEXT_PUBLIC_SUPABASE_URL || '❌ NOT FOUND'}
        </p>
        <p>
          <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong>{' '}
          {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Found (hidden)' : '❌ NOT FOUND'}
        </p>
      </div>
      <p className="mt-4 text-sm text-gray-600">
        Expected URL format: https://YOUR-PROJECT-ID.supabase.co
      </p>
    </div>
  );
}
