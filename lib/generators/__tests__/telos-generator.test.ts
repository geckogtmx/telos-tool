import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateTELOS, extractEntityName } from '../telos-generator';
import { AI_CONFIG } from '@/config/ai-model';

// Mock dependencies
vi.mock('@/config/ai-model', () => ({
    AI_CONFIG: {
        provider: 'claude',
        geminiModel: 'gemini-dummy'
    }
}));

vi.mock('../claude-api', () => ({
    callClaudeAPI: vi.fn(),
    ClaudeAPIException: class extends Error { type = 'TEST_ERROR'; }
}));

vi.mock('../gemini-api', () => ({
    generateWithGemini: vi.fn()
}));

vi.mock('../templates/individual', () => ({
    buildIndividualPrompt: vi.fn().mockReturnValue('Mock Individual Prompt')
}));

vi.mock('../templates/organization', () => ({
    buildOrganizationPrompt: vi.fn().mockReturnValue('Mock Org Prompt')
}));

vi.mock('../templates/agent', () => ({
    buildAgentPrompt: vi.fn().mockReturnValue('Mock Agent Prompt')
}));

import { callClaudeAPI } from '../claude-api';
import { generateWithGemini } from '../gemini-api';

describe('TELOS Generator', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (AI_CONFIG as any).provider = 'claude';
    });

    describe('generateTELOS', () => {
        it('should generate Individual TELOS using Claude by default', async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (callClaudeAPI as any).mockResolvedValue('# John Doe\nContent');

            const result = await generateTELOS({
                entityType: 'individual',
                parsedInput: 'Cv Text',
                answers: {}
            });

            expect(result.success).toBe(true);
            expect(result.content).toBe('# John Doe\nContent');
            expect(callClaudeAPI).toHaveBeenCalledWith('Mock Individual Prompt', expect.any(Object));
        });

        it('should generate Organization TELOS using Gemini when configured', async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (AI_CONFIG as any).provider = 'gemini';
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (generateWithGemini as any).mockResolvedValue('# Acme Corp\nContent');

            const result = await generateTELOS({
                entityType: 'organization',
                parsedInput: 'Org Text',
                answers: {}
            });

            expect(result.success).toBe(true);
            expect(result.content).toBe('# Acme Corp\nContent');
            expect(generateWithGemini).toHaveBeenCalledWith(expect.any(String), 'Mock Org Prompt');
        });

        it('should handle API errors gracefully', async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (callClaudeAPI as any).mockRejectedValue(new Error('API Error'));

            const result = await generateTELOS({
                entityType: 'individual',
                parsedInput: 'CV',
                answers: {}
            });

            expect(result.success).toBe(false);
            expect(result.error).toContain('Failed to generate');
        });
    });

    describe('extractEntityName', () => {
        it('should extract name from H1 of generated content', () => {
            const name = extractEntityName('CV Content', '# Jane Doe\nRest of file');
            expect(name).toBe('Jane Doe');
        });

        it('should fallback to first line of CV content if no H1', () => {
            const name = extractEntityName('John Smith\nSoftware Engineer', 'No header content');
            expect(name).toBe('John Smith');
        });

        it('should return "Individual" if extraction fails', () => {
            const name = extractEntityName('', '');
            expect(name).toBe('Individual');
        });
    });
});
