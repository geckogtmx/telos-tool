import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { generateTELOS, generateContent, generateSkill, extractEntityName } from '@/lib/generators/telos-generator';
import { strictLimiter, applyRateLimit } from '@/lib/rate-limit';

// Request validation schema - extended for Phase 18
const generateContentSchema = z.object({
  entityType: z.enum(['individual', 'organization', 'agent']),
  outputType: z.enum(['telos', 'system-prompt', 'skill']).optional().default('telos'),
  targetPlatform: z.enum(['universal', 'claude', 'gemini', 'openai', 'cursor', 'windsurf']).optional().default('universal'),
  parsedInput: z.string().min(1, 'Parsed input is required'),
  answers: z.record(z.string(), z.string()),
  mode: z.enum(['quick', 'full']).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limit to prevent API abuse (expensive AI calls)
    const rateLimitResponse = await applyRateLimit(request, strictLimiter, 'generate-telos');
    if (rateLimitResponse) return rateLimitResponse;

    const supabase = await createClient();

    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY && !process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'API configuration error. Please contact support.' },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate input
    const validation = generateContentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          details: validation.error.issues
        },
        { status: 400 }
      );
    }

    const { entityType, outputType, targetPlatform, parsedInput, answers, mode } = validation.data;

    // Route based on output type
    if (outputType === 'skill') {
      // Generate skill package
      const result = await generateSkill({
        entityType,
        outputType: 'skill',
        targetPlatform,
        parsedInput,
        answers,
        mode,
      });

      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 500 }
        );
      }

      const skillName = result.skillOutput?.manifest.name || 'AI Agent Skill';

      return NextResponse.json({
        success: true,
        data: {
          content: result.skillOutput?.skillMd,
          entityName: skillName,
          entityType,
          outputType,
          targetPlatform,
          skillOutput: result.skillOutput,
          generatedAt: new Date().toISOString(),
        },
      });
    } else if (outputType === 'system-prompt') {
      // Generate system prompt
      const result = await generateContent({
        entityType,
        outputType: 'system-prompt',
        targetPlatform,
        parsedInput,
        answers,
        mode,
      });

      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 500 }
        );
      }

      // Extract name from the first line or use default
      const entityName = extractEntityName(parsedInput, result.content) || 'AI Agent';

      return NextResponse.json({
        success: true,
        data: {
          content: result.content,
          entityName,
          entityType,
          outputType,
          targetPlatform,
          generatedAt: new Date().toISOString(),
        },
      });
    } else {
      // Default: Generate TELOS (backwards compatible)
      const result = await generateTELOS({
        entityType,
        parsedInput,
        answers,
        mode,
      });

      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 500 }
        );
      }

      // Extract entity name for reference
      const entityName = extractEntityName(parsedInput, result.content);

      return NextResponse.json({
        success: true,
        data: {
          content: result.content,
          entityName,
          entityType,
          outputType: 'telos',
          generatedAt: new Date().toISOString(),
        },
      });
    }
  } catch (error) {
    console.error('Generate content API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred. Please try again.'
      },
      { status: 500 }
    );
  }
}

