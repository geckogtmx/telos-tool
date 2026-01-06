import { NextRequest, NextResponse } from 'next/server';
import { parseCV, CVParseException } from '@/lib/parsers/cv-parser';
import { scrubPII, formatPIISummary } from '@/lib/parsers/pii-scrubber';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Parse the file
    const parsed = await parseCV(file);

    // Scrub PII from the extracted text
    const scrubResult = scrubPII(parsed.text);

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
