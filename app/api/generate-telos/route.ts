import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateTELOS, extractEntityName } from '@/lib/generators/telos-generator';

// Request validation schema
const generateTELOSSchema = z.object({
  entityType: z.enum(['individual', 'organization', 'agent']),
  parsedInput: z.string().min(1, 'Parsed input is required'),
  answers: z.record(z.string(), z.string()),
});

export async function POST(request: NextRequest) {
  try {
    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'API configuration error. Please contact support.' },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate input
    const validation = generateTELOSSchema.safeParse(body);
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

    const { entityType, parsedInput, answers } = validation.data;

    // Generate TELOS
    const result = await generateTELOS({
      entityType,
      parsedInput,
      answers,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    // Extract entity name for reference
    const entityName = extractEntityName(parsedInput);

    return NextResponse.json({
      success: true,
      data: {
        content: result.content,
        entityName,
        entityType,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Generate TELOS API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred. Please try again.'
      },
      { status: 500 }
    );
  }
}
