import { parseCV, CVParseException } from './cv-parser'; // Reuse PDF/DOCX logic

export type ParsedOrg = {
  text: string;
  sourceType: 'text' | 'url' | 'file';
  filename?: string;
  url?: string;
};

export class OrgParseException extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'OrgParseException';
  }
}

/**
 * Parses organization input from various sources.
 * Currently reuses the robust file parsing from cv-parser for files.
 */
export async function parseOrgFile(file: File): Promise<ParsedOrg> {
  try {
    const result = await parseCV(file); // Reuse the existing file parsing logic
    return {
      text: result.text,
      sourceType: 'file',
      filename: result.filename
    };
  } catch (error) {
    if (error instanceof CVParseException) {
      throw new OrgParseException(error.code, error.message);
    }
    throw error;
  }
}

export function parseOrgText(text: string): ParsedOrg {
  if (!text || text.trim().length < 10) {
    throw new OrgParseException('INVALID_INPUT', 'Organization description is too short');
  }
  return {
    text: text.trim(),
    sourceType: 'text'
  };
}
