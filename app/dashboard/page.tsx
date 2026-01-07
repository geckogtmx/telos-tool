import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?redirectTo=/dashboard');
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-100 mb-4">
          Dashboard
        </h1>
        <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-md p-6 mb-6">
          <p className="text-gray-300 mb-2">
            Welcome, <strong>{user.email}</strong>!
          </p>
          <p className="text-gray-400 text-sm">
            User ID: {user.id}
          </p>
        </div>
        <p className="text-gray-400">
          Coming in Phase 10: Your TELOS files list
        </p>
      </div>
    </div>
  );
}
