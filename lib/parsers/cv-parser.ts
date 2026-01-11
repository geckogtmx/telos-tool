import mammoth from 'mammoth';
import { fileTypeFromBuffer } from 'file-type';
import { PDFExtract } from 'pdf.js-extract';

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
  const debug = process.env.NODE_ENV !== 'production';
  if (debug) console.log('[cv-parser] Starting CV parse');

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new CVParseException('FILE_TOO_LARGE', 'File must be under 5MB');
  }

  const filename = file.name;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Validate file type (magic number)
  const type = await fileTypeFromBuffer(buffer);

  // Default to text/plain if no type detected (often true for .txt files)
  const mime = type?.mime || 'text/plain';
  const ext = type?.ext || 'txt';

  if (debug) {
    console.log('[cv-parser] File details:', {
      filename,
      detectedMime: mime,
      detectedExt: ext,
      size: file.size
    });
  }

  let text: string;

  try {
    if (mime === 'application/pdf') {
      if (debug) console.log('[cv-parser] Detected PDF, starting PDF parse...');
      if (debug) console.time('pdf-extraction');
      text = await parsePDF(buffer);
      if (debug) console.timeEnd('pdf-extraction');
      if (debug) console.log('[cv-parser] PDF extraction complete, text length:', text.length);
    } else if (
      mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      (mime === 'application/x-zip-compressed' && filename.endsWith('.docx')) // rare case where docx is seen as zip
    ) {
      if (debug) console.log('[cv-parser] Detected DOCX, starting DOCX parse...');
      if (debug) console.time('docx-extraction');
      text = await parseDOCX(buffer);
      if (debug) console.timeEnd('docx-extraction');
      if (debug) console.log('[cv-parser] DOCX extraction complete, text length:', text.length);
    } else if (mime === 'text/plain' || filename.endsWith('.txt')) {
      if (debug) console.log('[cv-parser] Detected TXT, starting TXT parse...');
      text = new TextDecoder('utf-8').decode(arrayBuffer);
      if (debug) console.log('[cv-parser] TXT extraction complete, text length:', text.length);
    } else {
      throw new CVParseException('INVALID_FORMAT', 'Please upload a PDF, DOCX, or TXT file');
    }
  } catch (error) {
    if (error instanceof CVParseException) {
      throw error;
    }
    // Always log errors, but maybe sanitize? 
    // Keeping error log for production debugging implies we have a logging service. 
    // For now, let's keep it but rely on console.error.
    console.error('[cv-parser] CV parsing error:', error);
    throw new CVParseException('EXTRACTION_FAILED', 'Could not read file. Please try a different format.');
  }

  // Validate extracted text
  const cleanedText = text.trim();
  if (debug) console.log('[cv-parser] Text cleaned, final length:', cleanedText.length);

  if (!cleanedText || cleanedText.length < 50) {
    throw new CVParseException('EMPTY_CONTENT', 'No text found in file. Please check your CV.');
  }

  if (debug) console.log('[cv-parser] Parse complete');

  return {
    text: cleanedText,
    filename,
    fileType: mime
  };
}

async function parsePDF(buffer: Buffer): Promise<string> {
  const pdfExtract = new PDFExtract();

  return new Promise((resolve, reject) => {
    pdfExtract.extractBuffer(buffer, {}, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      if (!data) {
        resolve('');
        return;
      }

      // Join pages and text items
      const text = data.pages
        .map(page => page.content.map(item => item.str).join(' '))
        .join('\n\n');

      resolve(text);
    });
  });
}

async function parseDOCX(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

