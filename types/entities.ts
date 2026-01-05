// Entity type definitions

import { EntityType, Question } from './index';

export interface EntityConfig {
  type: EntityType;
  name: string;
  description: string;
  inputLabel: string;
  inputPlaceholder: string;
  questions: Question[];
  templateSections: string[];
}

export interface ParsedInput {
  entityType: EntityType;
  rawText: string;
  metadata: Record<string, unknown>;
}

export interface IndividualParsedData {
  name: string;
  background: string;
  keySkills: string[];
  careerTrajectory: string;
  implicitValues: string[];
}

export interface OrganizationParsedData {
  name: string;
  mission: string;
  values: string[];
  keyPrograms: string[];
}

export interface AgentParsedData {
  name: string;
  purpose: string;
  capabilities: string[];
  constraints: string[];
}
