import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseCV } from '../cv-parser';
import { fileTypeFromBuffer } from 'file-type';

// Mock dependencies
vi.mock('file-type', () => ({
    fileTypeFromBuffer: vi.fn(),
}));

vi.mock('mammoth', () => ({
    default: {
        extractRawText: vi.fn().mockResolvedValue({ value: 'Mock DOCX Content '.repeat(5) }),
    },
}));

vi.mock('pdf.js-extract', () => {
    return {
        PDFExtract: vi.fn().mockImplementation(() => ({
            extractBuffer: vi.fn().mockImplementation((_buffer, _options, callback) => {
                callback(null, {
                    pages: [
                        { content: [{ str: 'Mock PDF Content '.repeat(5) }] }
                    ]
                });
            }),
        })),
    };
});

describe('CV Parser', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it.skip('should parse TXT files correctly', async () => {
        const content = 'Hello World '.repeat(10); // > 50 chars
        const file = new File([content], 'resume.txt', { type: 'text/plain' });

        // Mock file type detection for txt
        (fileTypeFromBuffer as any).mockResolvedValue(undefined); // undefined often means text/plain fallback

        const result = await parseCV(file);
        expect(result.text).toBe(content);
        expect(result.filename).toBe('resume.txt');
    });

    it.skip('should parse PDF files correctly', async () => {
        const file = new File(['dummy content '.repeat(10)], 'resume.pdf', { type: 'application/pdf' });

        (fileTypeFromBuffer as any).mockResolvedValue({ mime: 'application/pdf', ext: 'pdf' });

        const result = await parseCV(file);
        expect(result.text).toContain('Mock PDF Content');
        expect(result.text.length).toBeGreaterThan(50);
        expect(result.fileType).toBe('application/pdf');
    });

    it.skip('should parse DOCX files correctly', async () => {
        const file = new File(['dummy content '.repeat(10)], 'resume.docx', {
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });

        (fileTypeFromBuffer as any).mockResolvedValue({
            mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ext: 'docx'
        });

        const result = await parseCV(file);
        expect(result.text).toContain('Mock DOCX Content');
        expect(result.text.length).toBeGreaterThan(50);
    });

    it('should reject files larger than 5MB', async () => {
        // Create a large file
        const largeContent = new Uint8Array(6 * 1024 * 1024); // 6MB
        const file = new File([largeContent], 'large.pdf', { type: 'application/pdf' });

        await expect(parseCV(file)).rejects.toThrow('File must be under 5MB');
    });

    it('should reject empty files', async () => {
        const file = new File([''], 'empty.txt', { type: 'text/plain' });
        (fileTypeFromBuffer as any).mockResolvedValue(undefined);

        await expect(parseCV(file)).rejects.toThrow('No text found in file');
    });
});
