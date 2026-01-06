import { NextRequest, NextResponse } from 'next/server';
import { parseCV, CVParseException } from '@/lib/parsers/cv-parser';
import { scrubPII, formatPIISummary } from '@/lib/parsers/pii-scrubber';

export const maxDuration = 30; // 30 second timeout

export async function POST(request: NextRequest) {
  try {
    console.log('[parse-cv] Starting CV parse request');
    console.time('total-request');

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log('[parse-cv] File received:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Parse the file
    console.time('cv-parse');
    const parsed = await parseCV(file);
    console.timeEnd('cv-parse');

    console.log('[parse-cv] Text extracted, length:', parsed.text.length);

    // Scrub PII from the extracted text
    console.time('pii-scrub');
    const scrubResult = scrubPII(parsed.text);
    console.timeEnd('pii-scrub');

    console.log('[parse-cv] PII scrubbing complete, found:', scrubResult.totalRemoved);

    console.timeEnd('total-request');
    console.log('[parse-cv] Request complete');

    return NextResponse.json({
      success: true,
      data: {
        text: scrubResult.cleaned,
        filename: parsed.filename,
        fileType: parsed.fileType,
        wordCount: scrubResult.cleaned.split(/\s+/).length,
        charCount: scrubResult.cleaned.length,
        piiRemoved: scrubResult.found,
        piiSummary: formatPIISummary(scrubResult.found),
        totalPIIRemoved: scrubResult.totalRemoved
      }
    });

  } catch (error) {
    if (error instanceof CVParseException) {
      const errorMessages: Record<string, string> = {
        FILE_TOO_LARGE: 'File must be under 5MB',
        INVALID_FORMAT: 'Please upload a PDF, DOCX, or TXT file',
        EXTRACTION_FAILED: 'Could not read file. Please try a different format.',
        EMPTY_CONTENT: 'No text found in file. Please check your CV.'
      };

      return NextResponse.json(
        {
          error: errorMessages[error.code] || error.message,
          code: error.code
        },
        { status: 400 }
      );
    }

    console.error('Unexpected error in parse-cv:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
