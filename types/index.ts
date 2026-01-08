// Shared TypeScript types for TELOS Tool

export type EntityType = 'individual' | 'individual_quick' | 'individual_full' | 'organization' | 'agent';

export type HostingType = 'open' | 'encrypted' | 'private';

export interface EntityTypeInfo {
  id: EntityType;
  name: string;
  description: string;
  icon: string;
  inputType: string;
  badge?: string;
}

export interface Question {
  id: string;
  question: string;
  type: 'text' | 'textarea';
  placeholder?: string;
  required: boolean;
  minLength?: number;
  helperText?: string;
}

export interface QuestionAnswer {
  questionId: string;
  answer: string;
}

export interface TELOSData {
  id?: string;
  entityType: EntityType;
  entityName: string;
  rawInput: Record<string, unknown>;
  generatedContent: string;
  publicId: string;
  hostingType: HostingType;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}
