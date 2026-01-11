import { parseCV, CVParseException } from './cv-parser'; // Reuse robust file parsing

export type ParsedAgent = {
    text: string;
    sourceType: 'text' | 'file';
    filename?: string;
};

export class AgentParseException extends Error {
    constructor(public code: string, message: string) {
        super(message);
        this.name = 'AgentParseException';
    }
}

/**
 * Parses agent input (system prompts, configuration files).
 */
export async function parseAgentFile(file: File): Promise<ParsedAgent> {
    try {
        // Reuse CV parser logic as it handles PDF/DOCX/TXT robustly
        // Agent configs might be in MD or TXT usually, but PDF/DOCX support is good to have.
        const result = await parseCV(file);
        return {
            text: result.text,
            sourceType: 'file',
            filename: result.filename
        };
    } catch (error) {
        if (error instanceof CVParseException) {
            throw new AgentParseException(error.code, error.message);
        }
        throw error;
    }
}

export function parseAgentText(text: string): ParsedAgent {
    if (!text || text.trim().length < 10) {
        throw new AgentParseException('INVALID_INPUT', 'System prompt/description is too short');
    }
    return {
        text: text.trim(),
        sourceType: 'text'
    };
}
