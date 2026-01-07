// AI Model Configuration
// Set this to 'claude' or 'gemini' to choose the provider

export type AIProvider = 'claude' | 'gemini';

export const AI_CONFIG = {
  provider: (process.env.AI_PROVIDER || 'claude') as AIProvider,
  // You can add specific model names here if needed
  claudeModel: 'claude-3-5-sonnet-20240620',
  geminiModel: 'gemini-2.0-flash',
};
