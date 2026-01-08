import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { hashPassword } from '@/lib/storage/encryption';
import { generatePublicId } from '@/lib/utils/nanoid';
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

const saveSchema = z.object({
  entityType: z.enum(['individual', 'organization', 'agent']),
  entityName: z.string()
    .min(1, 'Entity name is required')
    .max(255, 'Entity name must be 255 characters or less')
    .transform(sanitizeEntityName),
  rawInput: z.any(),
  generatedContent: z.string().min(1),
  hostingType: z.enum(['open', 'encrypted', 'private']),
  password: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limit saves
    const rateLimitResponse = await applyRateLimit(request, standardLimiter, 'save-telos');
    if (rateLimitResponse) return rateLimitResponse;

    const supabase = await createClient();
    
    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const result = saveSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: result.error },
        { status: 400 }
      );
    }

    const { entityType, entityName, rawInput, generatedContent, hostingType, password } = result.data;

    let passwordHash: string | null = null;
    if (hostingType === 'encrypted') {
      if (!password || password.length < 12) {
        return NextResponse.json(
          { success: false, error: 'Password must be at least 12 characters' },
          { status: 400 }
        );
      }
      // Check password complexity: at least one uppercase, one lowercase, one number
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
    }

    const publicId = generatePublicId();

    const { data, error } = await supabase
      .from('telos_files')
      .insert({
        user_id: user.id,
        entity_type: entityType,
        entity_name: entityName,
        raw_input: rawInput,
        generated_content: generatedContent,
        public_id: publicId,
        hosting_type: hostingType,
        password_hash: passwordHash,
      })
      .select('id, public_id')
      .single();

    if (error) {
      // Handle duplicate public_id error (unique violation)
      if (error.code === '23505') {
         // Retry once with a new ID
         const newPublicId = generatePublicId();
         const { data: retryData, error: retryError } = await supabase
            .from('telos_files')
            .insert({
                user_id: user.id,
                entity_type: entityType,
                entity_name: entityName,
                raw_input: rawInput,
                generated_content: generatedContent,
                public_id: newPublicId,
                hosting_type: hostingType,
                password_hash: passwordHash,
            })
            .select('id, public_id')
            .single();
        
        if (retryError) {
             console.error('Database error retry:', retryError);
             return NextResponse.json({ success: false, error: 'Failed to save TELOS file' }, { status: 500 });
        }
        return NextResponse.json({ success: true, data: retryData });
      }

      console.error('Database error:', error);
      return NextResponse.json({ success: false, error: 'Failed to save TELOS file' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error('Save API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
