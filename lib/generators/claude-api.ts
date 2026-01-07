// Claude API wrapper for TELOS generation
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export type ClaudeAPIError =
  | 'RATE_LIMIT'
  | 'INVALID_API_KEY'
  | 'CONTENT_POLICY'
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'UNKNOWN';

export class ClaudeAPIException extends Error {
  constructor(
    public type: ClaudeAPIError,
    message: string
  ) {
    super(message);
    this.name = 'ClaudeAPIException';
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function categorizeError(error: unknown): ClaudeAPIError {
  if (error instanceof Anthropic.APIError) {
    if (error.status === 429) return 'RATE_LIMIT';
    if (error.status === 401) return 'INVALID_API_KEY';
    if (error.status === 400 && error.message.includes('content')) return 'CONTENT_POLICY';
    if (error.status === 408 || error.message.includes('timeout')) return 'TIMEOUT';
  }
  if (error instanceof Error && error.message.includes('network')) return 'NETWORK_ERROR';
  return 'UNKNOWN';
}

export async function callClaudeAPI(
  prompt: string,
  options: {
    maxTokens?: number;
    retries?: number;
    temperature?: number;
  } = {}
): Promise<string> {
  const { maxTokens = 4096, retries = 3, temperature = 0.7 } = options;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      temperature,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract text content from response
    const textContent = message.content.find(block => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new ClaudeAPIException('UNKNOWN', 'No text content in response');
    }

    return textContent.text;
  } catch (error) {
    const errorType = categorizeError(error);

    // Retry on rate limit
    if (retries > 0 && errorType === 'RATE_LIMIT') {
      console.log(`Rate limited, retrying in 2 seconds... (${retries} retries left)`);
      await sleep(2000);
      return callClaudeAPI(prompt, { maxTokens, retries: retries - 1, temperature });
    }

    // Throw categorized error
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new ClaudeAPIException(errorType, message);
  }
}

export const ERROR_MESSAGES: Record<ClaudeAPIError, string> = {
  RATE_LIMIT: 'Too many requests. Please try again in a moment.',
  INVALID_API_KEY: 'Configuration error. Please contact support.',
  CONTENT_POLICY: 'Content could not be processed. Please review your input.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  TIMEOUT: 'Request timed out. Please try again.',
  UNKNOWN: 'An unexpected error occurred. Please try again.',
};
