import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';

export type ParsedCV = {
  text: string;
  filename: string;
  fileType: string;
};

export type CVParseError =
  | 'FILE_TOO_LARGE'
  | 'INVALID_FORMAT'
  | 'EXTRACTION_FAILED'
  | 'EMPTY_CONTENT';

export class CVParseException extends Error {
  constructor(public code: CVParseError, message: string) {
    super(message);
    this.name = 'CVParseException';
  }
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function parseCV(file: File): Promise<ParsedCV> {
  console.log('[cv-parser] Starting CV parse');

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new CVParseException('FILE_TOO_LARGE', 'File must be under 5MB');
  }

  const fileType = file.type;
  const filename = file.name;

  console.log('[cv-parser] File details:', { filename, fileType, size: file.size });

  let text: string;

  try {
    if (fileType === 'application/pdf') {
      console.log('[cv-parser] Detected PDF, starting PDF parse...');
      console.time('pdf-extraction');
      text = await parsePDF(file);
      console.timeEnd('pdf-extraction');
      console.log('[cv-parser] PDF extraction complete, text length:', text.length);
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      filename.endsWith('.docx')
    ) {
      console.log('[cv-parser] Detected DOCX, starting DOCX parse...');
      console.time('docx-extraction');
      text = await parseDOCX(file);
      console.timeEnd('docx-extraction');
      console.log('[cv-parser] DOCX extraction complete, text length:', text.length);
    } else if (fileType === 'text/plain' || filename.endsWith('.txt')) {
      console.log('[cv-parser] Detected TXT, starting TXT parse...');
      text = await parseTXT(file);
      console.log('[cv-parser] TXT extraction complete, text length:', text.length);
    } else {
      throw new CVParseException('INVALID_FORMAT', 'Please upload a PDF, DOCX, or TXT file');
    }
  } catch (error) {
    if (error instanceof CVParseException) {
      throw error;
    }
    console.error('[cv-parser] CV parsing error:', error);
    throw new CVParseException('EXTRACTION_FAILED', 'Could not read file. Please try a different format.');
  }

  // Validate extracted text
  const cleanedText = text.trim();
  console.log('[cv-parser] Text cleaned, final length:', cleanedText.length);

  if (!cleanedText || cleanedText.length < 50) {
    throw new CVParseException('EMPTY_CONTENT', 'No text found in file. Please check your CV.');
  }

  console.log('[cv-parser] Parse complete');

  return {
    text: cleanedText,
    filename,
    fileType
  };
}

async function parsePDF(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const data = await pdfParse(buffer);
  return data.text;
}

async function parseDOCX(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

async function parseTXT(file: File): Promise<string> {
  return await file.text();
}
