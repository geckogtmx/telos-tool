// Main TELOS/Prompt/Skill generation logic
import { EntityType } from '@/types';
import { OutputType, TargetPlatform, SkillOutput, SkillScript } from '@/types/output-types';
import { callClaudeAPI, ClaudeAPIException, ERROR_MESSAGES } from './claude-api';
import { generateWithGemini } from './gemini-api';
import { buildIndividualPrompt } from './templates/individual';
import { buildOrganizationPrompt } from './templates/organization';
import { buildAgentPrompt } from './templates/agent';
import { buildSystemPromptTemplate } from './templates/system-prompt-template';
import { buildSkillTemplate, parseSkillContent } from './templates/skill-template';
import { AI_CONFIG } from '@/config/ai-model';

// Legacy input type for backwards compatibility
export type GenerateTELOSInput = {
  entityType: EntityType;
  parsedInput: string;
  answers: Record<string, string>;
  mode?: 'quick' | 'full';
};

// Extended input type for Phase 18
export type GenerateContentInput = {
  entityType: EntityType;
  outputType: OutputType;
  targetPlatform: TargetPlatform;
  parsedInput: string;
  answers: Record<string, string>;
  mode?: 'quick' | 'full';
  customScripts?: SkillScript[];
};

export type GenerateTELOSResult = {
  success: boolean;
  content?: string;
  error?: string;
  tokensUsed?: number;
};

export type GenerateSkillResult = {
  success: boolean;
  skillOutput?: SkillOutput;
  error?: string;
  tokensUsed?: number;
};

/**
 * Legacy function for backwards compatibility
 * Generates TELOS documents only
 */
export async function generateTELOS(
  input: GenerateTELOSInput
): Promise<GenerateTELOSResult> {
  return generateContent({
    ...input,
    outputType: 'telos',
    targetPlatform: 'universal',
  });
}

/**
 * Main generation function supporting all output types
 */
export async function generateContent(
  input: GenerateContentInput
): Promise<GenerateTELOSResult> {
  try {
    let prompt: string;

    // Build the appropriate prompt based on output type
    if (input.outputType === 'system-prompt') {
      prompt = buildSystemPromptTemplate(
        input.parsedInput,
        input.answers,
        input.targetPlatform
      );
    } else if (input.outputType === 'skill') {
      prompt = buildSkillTemplate(
        input.parsedInput,
        input.answers,
        input.targetPlatform,
        input.customScripts
      );
    } else {
      // Default TELOS generation
      switch (input.entityType) {
        case 'individual':
          prompt = buildIndividualPrompt(input.parsedInput, input.answers, input.mode);
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
    }

    let content: string;
    const systemPrompt = getSystemPromptForOutputType(input.outputType);

    if (AI_CONFIG.provider === 'gemini') {
      content = await generateWithGemini(systemPrompt, prompt);
    } else {
      content = await callClaudeAPI(prompt, {
        maxTokens: 4096,
        temperature: 0.7,
      });
    }

    return {
      success: true,
      content,
      // Token counting would be added here with actual API response
    };
  } catch (error) {
    if (error instanceof ClaudeAPIException) {
      return {
        success: false,
        error: ERROR_MESSAGES[error.type],
      };
    }

    if (error instanceof Error && error.message.includes('Gemini API')) {
      return {
        success: false,
        error: error.message
      };
    }

    console.error('Content generation error:', error);
    return {
      success: false,
      error: 'Failed to generate content. Please try again.',
    };
  }
}

/**
 * Generate a complete skill package with parsed metadata
 */
export async function generateSkill(
  input: GenerateContentInput
): Promise<GenerateSkillResult> {
  const result = await generateContent({
    ...input,
    outputType: 'skill',
  });

  if (!result.success || !result.content) {
    return {
      success: false,
      error: result.error,
    };
  }

  // Parse the generated SKILL.md content
  const parsed = parseSkillContent(result.content);

  const skillOutput: SkillOutput = {
    skillMd: result.content,
    manifest: {
      name: parsed.name,
      description: parsed.description,
      targetPlatform: input.targetPlatform,
      hasScripts: (input.customScripts?.length ?? 0) > 0,
      hasReferences: false,
      hasAssets: false,
      scripts: input.customScripts,
    },
    scripts: input.customScripts || [],
    references: [],
  };

  return {
    success: true,
    skillOutput,
    tokensUsed: result.tokensUsed,
  };
}

/**
 * Get appropriate system prompt based on output type
 */
function getSystemPromptForOutputType(outputType: OutputType): string {
  switch (outputType) {
    case 'system-prompt':
      return 'You are an expert at creating production-quality system prompts for AI agents. Return only the system prompt content.';
    case 'skill':
      return 'You are an expert at creating Agent Skills following the Anthropic/Antigravity format. Return only the SKILL.md content.';
    default:
      return 'You are an expert at creating TELOS documents. Return only the markdown content.';
  }
}

// Extract entity name from generated content (H1 header) or CV text
export function extractEntityName(cvText: string, generatedContent?: string): string {
  // 1. Try to extract from the generated content H1 header first
  if (generatedContent) {
    const h1Match = generatedContent.match(/^#\s+(.+)$/m);
    if (h1Match && h1Match[1]) {
      return h1Match[1].trim();
    }
  }

  // 2. Fallback to extracting from CV text (first line)
  const lines = cvText.trim().split('\n').filter(line => line.trim());

  // Try to find a name at the beginning (usually first non-empty line)
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    // Check if it looks like a name (not too long, letters, spaces, and some common chars)
    if (firstLine.length < 100 && /^[A-Za-z\s\-\.\,\|\']+$/.test(firstLine)) {
      return firstLine;
    }
  }

  return 'Individual';
}

/**
 * Extract skill name from generated skill content
 */
export function extractSkillName(skillContent: string): string {
  const parsed = parseSkillContent(skillContent);
  return parsed.name;
}

