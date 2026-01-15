// App-wide constants

import { EntityTypeInfo } from '@/types';
import { OutputType, TargetPlatform, OUTPUT_TYPE_INFO, PLATFORM_HINTS } from '@/types/output-types';

export const APP_NAME = 'TELOS Tool';
export const APP_DESCRIPTION = 'Generate comprehensive TELOS files for Individuals, Organizations, and Agents';

export const ENTITY_TYPES: EntityTypeInfo[] = [
  {
    id: 'individual',
    name: 'Individual',
    description: 'Create a personal TELOS. Start with a 5-question Quick Start, then optionally expand to the Full Profile.',
    icon: '👤',
    inputType: 'CV Upload + Questions',
    outputTypes: ['telos'],
  },
  {
    id: 'agent',
    name: 'AI Agent',
    description: 'Build TELOS documents, production system prompts, or installable skills for AI agents',
    icon: '🤖',
    inputType: 'System Prompt or Config',
    badge: '3 outputs',
    outputTypes: ['telos', 'system-prompt', 'skill'],
  },
  {
    id: 'organization',
    name: 'Organization',
    description: 'Generate an organizational TELOS from your about page',
    icon: '🏢',
    inputType: 'About Page URL or Text',
    outputTypes: ['telos'],
  },
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_FILE_TYPES = ['.pdf', '.docx', '.txt'];

export const TIERS = {
  free: {
    enabled: true,
    entityTypes: ['individual_quick', 'individual_full', 'organization', 'agent'],
    hosting: true,
    updates: true,
    maxFiles: 999,
  },
  paid: {
    enabled: false,
    entityTypes: ['individual_quick', 'individual_full', 'organization', 'agent'],
    hosting: true,
    updates: true,
    maxFiles: 999,
  },
};

// Phase 18: Output Types & Platforms
export const OUTPUT_TYPES: { id: OutputType; label: string; description: string; icon: string }[] = [
  { id: 'telos', ...OUTPUT_TYPE_INFO['telos'] },
  { id: 'system-prompt', ...OUTPUT_TYPE_INFO['system-prompt'] },
  { id: 'skill', ...OUTPUT_TYPE_INFO['skill'] },
];

export const PLATFORMS: { id: TargetPlatform; label: string; description: string }[] = [
  { id: 'universal', label: PLATFORM_HINTS.universal.label, description: PLATFORM_HINTS.universal.description },
  { id: 'claude', label: PLATFORM_HINTS.claude.label, description: PLATFORM_HINTS.claude.description },
  { id: 'gemini', label: PLATFORM_HINTS.gemini.label, description: PLATFORM_HINTS.gemini.description },
  { id: 'openai', label: PLATFORM_HINTS.openai.label, description: PLATFORM_HINTS.openai.description },
  { id: 'cursor', label: PLATFORM_HINTS.cursor.label, description: PLATFORM_HINTS.cursor.description },
  { id: 'windsurf', label: PLATFORM_HINTS.windsurf.label, description: PLATFORM_HINTS.windsurf.description },
];

export const DEFAULT_OUTPUT_TYPE: OutputType = 'telos';
export const DEFAULT_PLATFORM: TargetPlatform = 'universal';
