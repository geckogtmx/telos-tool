// Output Types for TELOS Tool
// Phase 18: System Prompts & Skills Generation

export type OutputType = 'telos' | 'system-prompt' | 'skill';

// Platform-agnostic by default, with optimization options
// Top 5 platforms based on market share
export type TargetPlatform =
    | 'universal'  // Works across all platforms
    | 'claude'     // Anthropic Claude (Claude Code, API)
    | 'gemini'     // Google Gemini (Antigravity, API)
    | 'openai'     // OpenAI GPT-4/ChatGPT
    | 'cursor'     // Cursor IDE
    | 'windsurf';  // Windsurf/Codeium

export interface SkillManifest {
    name: string;
    description: string;
    targetPlatform: TargetPlatform;
    hasScripts: boolean;
    hasReferences: boolean;
    hasAssets: boolean;
    scripts?: SkillScript[];
}

export interface SkillScript {
    filename: string;
    language: 'python' | 'bash' | 'typescript' | 'javascript';
    content: string;
    isCustom: boolean; // true if user-provided, false if AI-generated
}

export interface SystemPromptOutput {
    content: string;
    format: 'plain' | 'xml-tags' | 'markdown';
    targetPlatform: TargetPlatform;
}

export interface SkillOutput {
    skillMd: string;           // The SKILL.md content
    manifest: SkillManifest;
    scripts: SkillScript[];
    references: string[];      // Additional .md files
}

// Platform-specific optimization hints
export const PLATFORM_HINTS: Record<TargetPlatform, {
    label: string;
    description: string;
    formatTip: string;
}> = {
    universal: {
        label: 'Universal',
        description: 'Works across all AI platforms',
        formatTip: 'Plain markdown with clear structure',
    },
    claude: {
        label: 'Claude',
        description: 'Anthropic Claude (Claude Code, API)',
        formatTip: 'XML tags for structure, artifact support',
    },
    gemini: {
        label: 'Gemini',
        description: 'Google Gemini (Antigravity, API)',
        formatTip: 'YAML frontmatter, concise instructions',
    },
    openai: {
        label: 'OpenAI',
        description: 'GPT-4, ChatGPT, or compatible',
        formatTip: 'System/user message separation',
    },
    cursor: {
        label: 'Cursor',
        description: 'Cursor IDE agent',
        formatTip: 'File-focused instructions, diff-friendly',
    },
    windsurf: {
        label: 'Windsurf',
        description: 'Windsurf/Codeium IDE',
        formatTip: 'Cascading instructions, tool-aware',
    },
};

// Output type metadata
export const OUTPUT_TYPE_INFO: Record<OutputType, {
    label: string;
    description: string;
    icon: string;
}> = {
    telos: {
        label: 'TELOS Document',
        description: 'Identity & purpose documentation',
        icon: '📋',
    },
    'system-prompt': {
        label: 'System Prompt',
        description: 'Ready-to-use agent prompt',
        icon: '💬',
    },
    skill: {
        label: 'Agent Skill',
        description: 'Installable skill package',
        icon: '🧩',
    },
};

// Usage tracking interface
export interface GenerationUsage {
    userId: string;
    outputType: OutputType;
    targetPlatform: TargetPlatform;
    tokensUsed: number;
    aiProvider: 'claude' | 'gemini';
    timestamp: Date;
}
