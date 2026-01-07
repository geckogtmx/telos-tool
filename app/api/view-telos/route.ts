import { NextRequest, NextResponse } from 'next/server';
import { adminClient } from '@/lib/supabase/admin';
import { verifyPassword } from '@/lib/storage/encryption';
import { z } from 'zod';

const viewSchema = z.object({
  publicId: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = viewSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 });
    }

    const { publicId, password } = result.data;

    // Fetch file with password hash
    const { data: file, error } = await adminClient
      .from('telos_files')
      .select('generated_content, password_hash, hosting_type')
      .eq('public_id', publicId)
      .single();

    if (error || !file) {
      return NextResponse.json({ success: false, error: 'File not found' }, { status: 404 });
    }

    if (file.hosting_type !== 'encrypted') {
       // If not encrypted, why are we calling this? 
       // Maybe for consistency, but generally this endpoint is for unlocking.
       // We can return content if it's open too, but let's stick to encrypted unlocking.
       // Actually, maybe the client just wants to fetch content securely.
       if (file.hosting_type === 'open') {
           return NextResponse.json({ success: true, data: { content: file.generated_content } });
       }
       // If private, we shouldn't allow access via password unless we implement a password override for private files?
       // No, private is private.
       if (file.hosting_type === 'private') {
           return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
       }
    }

    if (file.hosting_type === 'encrypted') {
        if (!file.password_hash) {
            // Should not happen if hosting_type is encrypted
             return NextResponse.json({ success: true, data: { content: file.generated_content } });
        }
        
        const isValid = await verifyPassword(password, file.password_hash);
        if (!isValid) {
            return NextResponse.json({ success: false, error: 'Incorrect password' }, { status: 401 });
        }
    }

    return NextResponse.json({ success: true, data: { content: file.generated_content } });

  } catch (error) {
    console.error('View API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
