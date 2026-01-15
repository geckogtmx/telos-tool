// System Prompt Template
// Generates production-ready system prompts optimized for target platforms

import { TargetPlatform, PLATFORM_HINTS } from '@/types/output-types';

interface SystemPromptAnswers {
    identity?: string;
    goal?: string;
    workflow?: string;
    constraints?: string;
    tone?: string;
    tools?: string;
    context?: string;
}

/**
 * Builds an AI prompt that generates a production-ready system prompt
 * based on user inputs and target platform.
 */
export function buildSystemPromptTemplate(
    parsedInput: string,
    answers: SystemPromptAnswers,
    targetPlatform: TargetPlatform
): string {
    const platformInfo = PLATFORM_HINTS[targetPlatform];

    return `You are an expert at creating production-quality system prompts for AI agents.

Your task is to generate a complete, ready-to-use system prompt based on the provided inputs.

## TARGET PLATFORM: ${platformInfo.label}
${platformInfo.description}
Format tip: ${platformInfo.formatTip}

## INPUT DATA

### Base System Prompt / Agent Config:
${parsedInput || 'No base system prompt provided. Generate from user answers.'}

### User-Provided Agent Details:

**Identity & Persona:**
${answers.identity || 'Not specified - infer from context'}

**Primary Goal / Success Criteria:**
${answers.goal || 'Not specified'}

**Workflow / Thinking Process:**
${answers.workflow || 'Not specified'}

**Constraints (Never Do):**
${answers.constraints || 'Not specified'}

**Voice & Tone:**
${answers.tone || 'Not specified'}

**Tools & Capabilities:**
${answers.tools || 'Not specified'}

**System Context:**
${answers.context || 'Not specified'}

## OUTPUT REQUIREMENTS

Generate a production-ready system prompt that includes:

1. **Identity Block** - Clear statement of who the agent is
2. **Capabilities Block** - What the agent can and should do
3. **Constraints Block** - What the agent must never do (hard limits)
4. **Communication Style** - How the agent should interact
5. **Tool Instructions** - If tools are specified, how to use them
6. **Error Handling** - How to handle edge cases and confusion

${getPlatformSpecificInstructions(targetPlatform)}

## FORMATTING RULES

- Output ONLY the system prompt content, no preamble or explanation
- Use clear section headers appropriate for the target platform
- Be precise and actionable
- Keep instructions concise but complete
- Prioritize clarity over verbosity

Generate the system prompt now:`;
}

function getPlatformSpecificInstructions(platform: TargetPlatform): string {
    switch (platform) {
        case 'claude':
            return `
## CLAUDE-SPECIFIC FORMATTING
- Use XML tags to structure major sections: <identity>, <capabilities>, <constraints>, etc.
- Include <thinking> guidance for complex reasoning tasks
- Reference artifact capabilities if relevant
- Use clear hierarchical structure`;

        case 'gemini':
            return `
## GEMINI-SPECIFIC FORMATTING
- Use concise, direct instructions
- Structure with markdown headers
- Include grounding instructions if needed
- Keep focus on task completion`;

        case 'openai':
            return `
## OPENAI-SPECIFIC FORMATTING
- Use clear markdown sections
- Include function calling instructions if tools are specified
- Be explicit about output format expectations
- Consider token efficiency`;

        case 'cursor':
            return `
## CURSOR-SPECIFIC FORMATTING
- Focus on code-related instructions
- Include file and diff handling guidance
- Reference codebase context patterns
- Be explicit about when to edit vs. explain`;

        case 'windsurf':
            return `
## WINDSURF-SPECIFIC FORMATTING
- Use cascading instruction patterns
- Include tool-aware sections
- Reference memory and context capabilities
- Structure for multi-step workflows`;

        default:
            return `
## UNIVERSAL FORMATTING
- Use clean markdown structure
- Avoid platform-specific features
- Focus on clear, portable instructions
- Keep format simple and readable`;
    }
}

/**
 * Post-processes generated system prompt based on platform
 */
export function formatSystemPrompt(
    content: string,
    targetPlatform: TargetPlatform
): string {
    // For Claude, ensure XML tags are properly closed
    if (targetPlatform === 'claude') {
        // Basic validation - could be enhanced
        return content;
    }

    return content;
}
