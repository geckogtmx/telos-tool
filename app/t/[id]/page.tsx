import { notFound, redirect } from 'next/navigation';
import { adminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import TELOSViewer from '@/components/TELOSViewer';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewTELOSPage({ params }: PageProps) {
  const { id } = await params;

  // Use adminClient to fetch metadata even if encrypted/private
  const { data: file, error } = await adminClient
    .from('telos_files')
    .select('entity_name, hosting_type, generated_content, user_id')
    .eq('public_id', id)
    .single();

  if (error || !file) {
    notFound();
  }

  // Handle Private
  if (file.hosting_type === 'private') {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || user.id !== file.user_id) {
        // Redirect to login if not logged in, or 404 if logged in but not owner
        if (!user) {
            redirect(`/auth/login?next=/t/${id}`);
        }
        notFound();
    }
  }

  // Prepare props for Client Component
  // If open or private (and authorized), we send content.
  // If encrypted, we send null content and let client handle unlock.
  const isEncrypted = file.hosting_type === 'encrypted';
  const content = (file.hosting_type === 'open' || file.hosting_type === 'private') 
    ? file.generated_content 
    : null;

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <TELOSViewer
          initialContent={content}
          entityName={file.entity_name}
          publicId={id}
          isEncrypted={isEncrypted}
        />
      </div>
    </div>
  );
}
