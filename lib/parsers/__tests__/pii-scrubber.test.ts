import { describe, it, expect } from 'vitest';
import { scrubPII, formatPIISummary } from '../pii-scrubber';

describe('PII Scrubber', () => {
  it('should remove email addresses', () => {
    const text = 'Contact me at test@example.com or support@company.org';
    const result = scrubPII(text);

    console.log('DEBUG FOUND:', JSON.stringify(result.found, null, 2));

    // Expecting 2 unique emails
    const emailMatch = result.found.find(m => m.type === 'email');
    expect(emailMatch).toBeDefined();
    expect(emailMatch?.count).toBe(2);

    expect(result.cleaned).toContain('[EMAIL_REMOVED]');
    expect(result.cleaned).not.toContain('test@example.com');
  });

  it('should remove phone numbers', () => {
    const text = 'Call 555-123-4567 or (555) 987-6543';
    const result = scrubPII(text);
    console.log('DEBUG PHONE FOUND:', JSON.stringify(result.found, null, 2));

    const phoneMatch = result.found.find(m => m.type === 'phone');
    expect(phoneMatch).toBeDefined();
    expect(phoneMatch?.count).toBe(2);

    expect(result.cleaned).toContain('[PHONE_REMOVED]');
    expect(result.cleaned).not.toContain('555-123-4567');
  });

  // ... keep others simple ...
});
