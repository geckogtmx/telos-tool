import { NextRequest, NextResponse } from 'next/server';
import { parseOrgText, parseOrgFile } from '@/lib/parsers/org-parser';
import { applyRateLimit, strictLimiter } from '@/lib/rate-limit';
import { z } from 'zod';

const parseSchema = z.object({
    text: z.string().min(10, 'Description must be at least 10 characters'),
});

export async function POST(request: NextRequest) {
    try {
        const rateLimitResponse = await applyRateLimit(request, strictLimiter, 'parse-org');
        if (rateLimitResponse) return rateLimitResponse;

        const contentType = request.headers.get('content-type') || '';

        // Handle File Upload
        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            const file = formData.get('file') as File | null;

            if (!file) {
                return NextResponse.json(
                    { success: false, error: 'No file provided' },
                    { status: 400 }
                );
            }

            const parsed = await parseOrgFile(file);
            return NextResponse.json({
                success: true,
                data: parsed
            });
        }

        // Handle Text Input
        const body = await request.json();
        const result = parseSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: 'Invalid input', details: result.error },
                { status: 400 }
            );
        }

        const { text } = result.data;
        const parsed = parseOrgText(text);

        return NextResponse.json({
            success: true,
            data: parsed
        });

    } catch (error) {
        console.error('Org parse error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to process organization info' },
            { status: 500 }
        );
    }
}
