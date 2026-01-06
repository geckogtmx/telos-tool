import mammoth from 'mammoth';
import PDFParser from 'pdf2json';

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
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new CVParseException('FILE_TOO_LARGE', 'File must be under 5MB');
  }

  const fileType = file.type;
  const filename = file.name;

  let text: string;

  try {
    if (fileType === 'application/pdf') {
      text = await parsePDF(file);
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      filename.endsWith('.docx')
    ) {
      text = await parseDOCX(file);
    } else if (fileType === 'text/plain' || filename.endsWith('.txt')) {
      text = await parseTXT(file);
    } else {
      throw new CVParseException('INVALID_FORMAT', 'Please upload a PDF, DOCX, or TXT file');
    }
  } catch (error) {
    if (error instanceof CVParseException) {
      throw error;
    }
    console.error('CV parsing error:', error);
    throw new CVParseException('EXTRACTION_FAILED', 'Could not read file. Please try a different format.');
  }

  // Validate extracted text
  const cleanedText = text.trim();
  if (!cleanedText || cleanedText.length < 50) {
    throw new CVParseException('EMPTY_CONTENT', 'No text found in file. Please check your CV.');
  }

  return {
    text: cleanedText,
    filename,
    fileType
  };
}

async function parsePDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    // Second parameter (needRawText) must be true to enable text extraction
    const pdfParser = new (PDFParser as any)(null, true);

    pdfParser.on('pdfParser_dataError', (errMsg: Error | { parserError: Error }) => {
      const error = errMsg instanceof Error ? errMsg : errMsg.parserError;
      reject(error);
    });

    pdfParser.on('pdfParser_dataReady', () => {
      const text = pdfParser.getRawTextContent();
      resolve(text);
    });

    pdfParser.parseBuffer(buffer);
  });
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
