# TELOS Tool - Gemini Code Documentation

## Project Overview

**Name:** TELOS Tool v1.0
**Purpose:** Production-ready TELOS generation platform
**Current Status:** Phases 1-9 Complete
**AI Integration:** Dual-provider support (Anthropic Claude & Google Gemini)

## Gemini Integration Details

The project supports Google Gemini as a first-class AI provider for generating TELOS documents. This allows users to leverage their Gemini API quotas or prefer Gemini's specific capabilities.

### Configuration

The AI provider is selected via the `AI_PROVIDER` environment variable or the `config/ai-model.ts` file.

**Environment Variable:**
```bash
# .env.local
AI_PROVIDER=gemini
GEMINI_API_KEY=your_key_here
```

**Config File (`config/ai-model.ts`):**
```typescript
export const AI_CONFIG = {
  provider: (process.env.AI_PROVIDER || 'claude') as AIProvider,
  geminiModel: 'gemini-2.0-flash', // Currently verified model
  // ...
};
```

### Implementation

1.  **Wrapper:** `lib/generators/gemini-api.ts`
    *   Uses `@google/generative-ai` SDK.
    *   Configured to use `gemini-2.0-flash` (via config) which offers high speed and reliability.
    *   Handles content generation requests.

2.  **Generator Logic:** `lib/generators/telos-generator.ts`
    *   Checks `AI_CONFIG.provider`.
    *   Routes requests to `generateWithGemini` if provider is 'gemini'.
    *   Passes the constructed prompt (parsed CV + answers) to the model.

### Troubleshooting

*   **404 Model Not Found:** Ensure you are using a model available to your API key. `gemini-2.0-flash` is currently the stable choice for this codebase. Older keys might need `gemini-pro`.
*   **API Key:** Ensure `GEMINI_API_KEY` is set in `.env.local` and the key has "Generative Language API" enabled in Google Cloud Console.

## Recent Updates (Phase 9)

*   **Hosting:** Securely save generated files (Open, Encrypted, Private).
*   **Viewer:** Public viewer at `/t/[id]` with password protection.
*   **UI/UX:** Improved navigation logic and form controls (Skip button, Password toggles).

---
**Last Updated:** 2026-01-06
