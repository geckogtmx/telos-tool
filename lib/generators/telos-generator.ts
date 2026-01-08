// Main TELOS generation logic
import { EntityType } from '@/types';
import { callClaudeAPI, ClaudeAPIException, ERROR_MESSAGES } from './claude-api';
import { generateWithGemini } from './gemini-api';
import { buildIndividualPrompt, buildIndividualQuickPrompt } from './templates/individual';
import { buildOrganizationPrompt } from './templates/organization';
import { buildAgentPrompt } from './templates/agent';
import { AI_CONFIG } from '@/config/ai-model';

export type GenerateTELOSInput = {
  entityType: EntityType;
  parsedInput: string;
  answers: Record<string, string>;
};

export type GenerateTELOSResult = {
  success: boolean;
  content?: string;
  error?: string;
};

export async function generateTELOS(
  input: GenerateTELOSInput
): Promise<GenerateTELOSResult> {
  try {
    let prompt: string;

    switch (input.entityType) {
      case 'individual':
      case 'individual_full':
        prompt = buildIndividualPrompt(input.parsedInput, input.answers);
        break;
      case 'individual_quick':
        prompt = buildIndividualQuickPrompt(input.parsedInput, input.answers);
        break;
      case 'organization':
        prompt = buildOrganizationPrompt(input.parsedInput, input.answers);
        break;
      case 'agent':
        prompt = buildAgentPrompt(input.parsedInput, input.answers);
        break;
      default:
        return {
          success: false,
          error: 'Invalid entity type',
        };
    }

    let content: string;

    if (AI_CONFIG.provider === 'gemini') {
      // Gemini expects a system prompt and user prompt.
      // Our buildIndividualPrompt returns a single large prompt.
      // We'll pass an empty system prompt and the full prompt as user message,
      // or split it if we refactor. For now, full prompt as user message works.
      content = await generateWithGemini(
        'You are an expert at creating TELOS documents. Return only the markdown content.',
        prompt
      );
    } else {
      content = await callClaudeAPI(prompt, {
        maxTokens: 4096,
        temperature: 0.7,
      });
    }

    return {
      success: true,
      content,
    };
  } catch (error) {
    if (error instanceof ClaudeAPIException) {
      return {
        success: false,
        error: ERROR_MESSAGES[error.type],
      };
    }
    
    // Check if it's a Gemini error (usually just Error with message)
    if (error instanceof Error && error.message.includes('Gemini API')) {
         return {
            success: false,
            error: error.message
         };
    }

    console.error('TELOS generation error:', error);
    return {
      success: false,
      error: 'Failed to generate TELOS. Please try again.',
    };
  }
}

// Extract entity name from CV text (first line or common patterns)
export function extractEntityName(cvText: string): string {
  const lines = cvText.trim().split('\n').filter(line => line.trim());

  // Try to find a name at the beginning (usually first non-empty line)
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    // Check if it looks like a name (not too long, no special chars)
    if (firstLine.length < 50 && /^[A-Za-z\s\-\.]+$/.test(firstLine)) {
      return firstLine;
    }
  }

  return 'Individual';
}
