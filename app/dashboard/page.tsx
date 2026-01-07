import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardFileList from '@/components/DashboardFileList';

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-400">
            Manage your generated TELOS files
          </p>
        </div>

        <DashboardFileList userId={user.id} />
      </div>
    </div>
  );
}
