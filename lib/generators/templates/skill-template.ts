// Skill Template
// Generates Anthropic/Antigravity compatible SKILL.md files

import { TargetPlatform, SkillScript } from '@/types/output-types';

interface SkillAnswers {
    identity?: string;
    goal?: string;
    workflow?: string;
    constraints?: string;
    tone?: string;
    tools?: string;
    context?: string;
    skillName?: string;
    skillDescription?: string;
    triggers?: string;
}

/**
 * Builds an AI prompt that generates a SKILL.md file
 * following Anthropic/Antigravity skill format.
 */
export function buildSkillTemplate(
    parsedInput: string,
    answers: SkillAnswers,
    targetPlatform: TargetPlatform,
    customScripts?: SkillScript[]
): string {
    const scriptsContext = customScripts?.length
        ? `
### User-Provided Scripts:
${customScripts.map(s => `- ${s.filename} (${s.language}): ${s.isCustom ? 'Custom' : 'AI-generated'}`).join('\n')}`
        : '';

    return `You are an expert at creating Agent Skills following the Anthropic/Antigravity format.

Skills are modular, self-contained packages that extend an AI agent's capabilities with specialized knowledge, workflows, and tools.

## SKILL FORMAT REQUIREMENTS

A skill consists of a required SKILL.md file with:
1. **YAML Frontmatter** - name and description (critical for discovery)
2. **Markdown Body** - Instructions and guidance for using the skill

\`\`\`
skill-name/
├── SKILL.md (required)
└── scripts/ (optional)
    └── helper.py
\`\`\`

## INPUT DATA

### Base System Prompt / Agent Config:
${parsedInput || 'No base system prompt provided.'}

### User-Provided Details:

**Skill Name:**
${answers.skillName || answers.identity?.split(' ').slice(0, 2).join('-').toLowerCase() || 'custom-skill'}

**Skill Description (for triggering):**
${answers.skillDescription || answers.goal || 'Not specified'}

**When to Trigger This Skill:**
${answers.triggers || 'Based on context matching the description'}

**Agent Identity:**
${answers.identity || 'Not specified'}

**Primary Goal:**
${answers.goal || 'Not specified'}

**Workflow / Process:**
${answers.workflow || 'Not specified'}

**Constraints:**
${answers.constraints || 'Not specified'}

**Tools & Capabilities:**
${answers.tools || 'Not specified'}
${scriptsContext}

## SKILL DESIGN PRINCIPLES

1. **Concise is Key** - Only include what the AI doesn't already know
2. **Focus on Single Tasks** - Each skill should do one thing well
3. **Specific Descriptions** - Description determines when skill triggers
4. **Progressive Disclosure** - Core instructions in SKILL.md, details in references

## OUTPUT REQUIREMENTS

Generate the complete SKILL.md file including:

### YAML Frontmatter:
\`\`\`yaml
---
name: skill-identifier
description: Clear description of when and why to use this skill (THIS IS CRITICAL - agent uses this for discovery)
---
\`\`\`

### Markdown Body:
- **Overview** - What this skill does
- **When to Use** - Specific triggers (but keep brief since description handles main triggering)
- **Instructions** - Step-by-step workflow
- **Scripts** - If scripts are included, explain how to use them
- **Examples** - Brief usage examples if helpful

## FORMATTING RULES

- Start with the YAML frontmatter block (---)
- Use imperative/infinitive form for instructions
- Keep total under 500 lines for context efficiency
- Be specific and actionable
- Do not include README, CHANGELOG, or other auxiliary files
- Output ONLY the SKILL.md content, no preamble

Generate the SKILL.md file now:`;
}

/**
 * Generates a script using AI based on skill context
 */
export function buildScriptGenerationPrompt(
    skillContext: string,
    scriptPurpose: string,
    language: 'python' | 'bash' | 'typescript'
): string {
    return `You are generating a helper script for an Agent Skill.

## Skill Context:
${skillContext}

## Script Purpose:
${scriptPurpose}

## Language: ${language}

## Requirements:
- Script should be self-contained and runnable
- Include a --help flag for self-documentation
- Handle errors gracefully
- Keep it focused on the specific purpose
- Include clear comments

Generate ONLY the script code, no markdown fencing:`;
}

/**
 * Extracts skill metadata from generated SKILL.md content
 */
export function parseSkillContent(skillMd: string): {
    name: string;
    description: string;
    body: string;
} {
    const frontmatterMatch = skillMd.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

    if (!frontmatterMatch) {
        return {
            name: 'unnamed-skill',
            description: 'No description provided',
            body: skillMd,
        };
    }

    const frontmatter = frontmatterMatch[1];
    const body = frontmatterMatch[2];

    const nameMatch = frontmatter.match(/name:\s*(.+)/);
    const descMatch = frontmatter.match(/description:\s*(.+)/);

    return {
        name: nameMatch?.[1]?.trim() || 'unnamed-skill',
        description: descMatch?.[1]?.trim() || 'No description provided',
        body: body.trim(),
    };
}
