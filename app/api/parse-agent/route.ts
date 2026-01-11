import { NextRequest, NextResponse } from 'next/server';
import { parseAgentText, parseAgentFile, AgentParseException } from '@/lib/parsers/agent-parser';
import { applyRateLimit, strictLimiter } from '@/lib/rate-limit';
import { z } from 'zod';

const parseSchema = z.object({
    text: z.string().min(10, 'Prompt must be at least 10 characters'),
});

export async function POST(request: NextRequest) {
    try {
        const rateLimitResponse = await applyRateLimit(request, strictLimiter, 'parse-agent');
        if (rateLimitResponse) return rateLimitResponse;

        const contentType = request.headers.get('content-type') || '';
        let parsedData;

        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            const file = formData.get('file') as File;

            if (!file) {
                return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
            }

            parsedData = await parseAgentFile(file);
        } else {
            const body = await request.json();
            const result = parseSchema.safeParse(body);

            if (!result.success) {
                return NextResponse.json(
                    { success: false, error: 'Invalid input', details: result.error },
                    { status: 400 }
                );
            }

            parsedData = parseAgentText(result.data.text);
        }

        return NextResponse.json({
            success: true,
            data: parsedData
        });

    } catch (error) {
        if (error instanceof AgentParseException) {
            return NextResponse.json({ success: false, error: error.message }, { status: 400 });
        }
        console.error('Agent parse error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to process agent info' },
            { status: 500 }
        );
    }
}
