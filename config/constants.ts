// App-wide constants

import { EntityTypeInfo } from '@/types';

export const APP_NAME = 'TELOS Tool';
export const APP_DESCRIPTION = 'Generate comprehensive TELOS files for Individuals, Organizations, and Agents';

export const ENTITY_TYPES: EntityTypeInfo[] = [
  {
    id: 'individual',
    name: 'Individual',
    description: 'Create a personal TELOS. Start with a 5-question Quick Start, then optionally expand to the Full Profile.',
    icon: '👤',
    inputType: 'CV Upload + Questions',
  },
  {
    id: 'organization',
    name: 'Organization',
    description: 'Generate an organizational TELOS from your about page',
    icon: '🏢',
    inputType: 'About Page URL or Text',
  },
  {
    id: 'agent',
    name: 'Agent',
    description: 'Build an AI agent TELOS from system prompts',
    icon: '🤖',
    inputType: 'System Prompt or Config',
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
