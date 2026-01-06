import { scrubPII, formatPIISummary } from '../pii-scrubber';

describe('PII Scrubber', () => {
  test('should detect and remove phone numbers', () => {
    const text = 'Call me at 555-123-4567 or (555) 987-6543';
    const result = scrubPII(text);

    expect(result.cleaned).not.toContain('555-123-4567');
    expect(result.cleaned).not.toContain('555) 987-6543');
    expect(result.cleaned).toContain('[PHONE_REMOVED]');
    expect(result.totalRemoved).toBeGreaterThan(0);
  });

  test('should detect and remove email addresses', () => {
    const text = 'Contact john.doe@example.com for more info';
    const result = scrubPII(text);

    expect(result.cleaned).not.toContain('john.doe@example.com');
    expect(result.cleaned).toContain('[EMAIL_REMOVED]');
  });

  test('should detect and remove SSN', () => {
    const text = 'My SSN is 123-45-6789';
    const result = scrubPII(text);

    expect(result.cleaned).not.toContain('123-45-6789');
    expect(result.cleaned).toContain('[SSN_REMOVED]');
  });

  test('should detect and remove credit card numbers', () => {
    const text = 'Card: 4532 1234 5678 9010';
    const result = scrubPII(text);

    expect(result.cleaned).not.toContain('4532 1234 5678 9010');
    expect(result.cleaned).toContain('[CREDIT_CARD_REMOVED]');
  });

  test('should detect and remove addresses', () => {
    const text = 'I live at 123 Main Street';
    const result = scrubPII(text);

    expect(result.cleaned).not.toContain('123 Main Street');
    expect(result.cleaned).toContain('[ADDRESS_REMOVED]');
  });

  test('should handle text with no PII', () => {
    const text = 'This is a clean CV with no sensitive information';
    const result = scrubPII(text);

    expect(result.cleaned).toBe(text);
    expect(result.totalRemoved).toBe(0);
    expect(result.found).toHaveLength(0);
  });

  test('should handle multiple types of PII', () => {
    const text = 'Email: test@example.com Phone: 555-1234 SSN: 123-45-6789';
    const result = scrubPII(text);

    expect(result.totalRemoved).toBeGreaterThanOrEqual(2);
    expect(result.found.length).toBeGreaterThanOrEqual(2);
  });

  test('should format PII summary correctly', () => {
    const found = [
      { type: 'email' as const, count: 2 },
      { type: 'phone' as const, count: 1 }
    ];
    const summary = formatPIISummary(found);

    expect(summary).toContain('2 email addresses');
    expect(summary).toContain('1 phone number');
  });

  test('should return "No PII detected" for empty findings', () => {
    const summary = formatPIISummary([]);
    expect(summary).toBe('No PII detected');
  });
});
