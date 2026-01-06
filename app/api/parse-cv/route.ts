import { NextRequest, NextResponse } from 'next/server';
import { parseCV, CVParseException } from '@/lib/parsers/cv-parser';

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

    const parsed = await parseCV(file);

    return NextResponse.json({
      success: true,
      data: {
        text: parsed.text,
        filename: parsed.filename,
        fileType: parsed.fileType,
        wordCount: parsed.text.split(/\s+/).length,
        charCount: parsed.text.length
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
