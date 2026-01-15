import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { hashPassword } from '@/lib/storage/encryption';
import { standardLimiter, applyRateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

// Sanitize entity name: allow letters, numbers, spaces, hyphens, apostrophes, periods
const sanitizeEntityName = (name: string): string => {
  return name
    .trim()
    .replace(/[<>\"'`&;{}()[\]\\\/]/g, '') // Remove potentially dangerous chars
    .replace(/\s+/g, ' ') // Normalize whitespace
    .substring(0, 255); // Enforce max length
};

const updateSchema = z.object({
  id: z.string().uuid(),
  entityName: z.string()
    .min(1, 'Entity name is required')
    .max(255, 'Entity name must be 255 characters or less')
    .transform(sanitizeEntityName),
  rawInput: z.record(z.string(), z.unknown()),
  generatedContent: z.string().min(1),
  hostingType: z.enum(['open', 'encrypted', 'private']),
  password: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limit updates
    const rateLimitResponse = await applyRateLimit(request, standardLimiter, 'update-telos');
    if (rateLimitResponse) return rateLimitResponse;

    const supabase = await createClient();

    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const result = updateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: result.error },
        { status: 400 }
      );
    }

    const { id, entityName, rawInput, generatedContent, hostingType, password } = result.data;

    // Verify ownership
    const { data: existing, error: fetchError } = await supabase
      .from('telos_files')
      .select('user_id, version, password_hash')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ success: false, error: 'File not found' }, { status: 404 });
    }

    if (existing.user_id !== user.id) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    let passwordHash = existing.password_hash;
    if (hostingType === 'encrypted') {
      // If changing to encrypted or updating password, validate it
      if (password) {
        if (password.length < 12) {
          return NextResponse.json(
            { success: false, error: 'Password must be at least 12 characters' },
            { status: 400 }
          );
        }
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        if (!hasUppercase || !hasLowercase || !hasNumber) {
          return NextResponse.json(
            { success: false, error: 'Password must contain uppercase, lowercase, and a number' },
            { status: 400 }
          );
        }
        passwordHash = await hashPassword(password);
      } else if (!existing.password_hash) {
        // Switching to encrypted but no password provided and none exists
        return NextResponse.json(
          { success: false, error: 'Password required for encrypted hosting' },
          { status: 400 }
        );
      }
    } else {
      passwordHash = null;
    }

    const { data, error } = await supabase
      .from('telos_files')
      .update({
        entity_name: entityName,
        raw_input: rawInput,
        generated_content: generatedContent,
        hosting_type: hostingType,
        password_hash: passwordHash,
        version: (existing.version || 1) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('id, public_id')
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ success: false, error: 'Failed to update TELOS file' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error('Update API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
