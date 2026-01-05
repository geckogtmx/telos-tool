// API request/response types

import { EntityType, HostingType, QuestionAnswer } from './index';

export interface ParseCVRequest {
  file: File;
  entityType: EntityType;
}

export interface ParseCVResponse {
  success: boolean;
  data?: {
    cleanedText: string;
    parsedData: Record<string, unknown>;
    piiRemoved?: string[];
  };
  error?: string;
}

export interface GenerateTELOSRequest {
  entityType: EntityType;
  parsedInput: Record<string, unknown>;
  answers: QuestionAnswer[];
}

export interface GenerateTELOSResponse {
  success: boolean;
  content?: string;
  error?: string;
}

export interface SaveTELOSRequest {
  entityType: EntityType;
  entityName: string;
  rawInput: Record<string, unknown>;
  generatedContent: string;
  hostingType: HostingType;
  password?: string;
}

export interface SaveTELOSResponse {
  success: boolean;
  publicId?: string;
  url?: string;
  error?: string;
}
