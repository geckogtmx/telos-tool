// PII Scrubbing as per TELOS_TOOL_V1_BUILD_SPEC.md Section VI

export type PIIType = 'phone' | 'email' | 'ssn' | 'creditCard' | 'address' | 'taxId' | 'passport';

export type PIIMatch = {
  type: PIIType;
  count: number;
};

export type ScrubResult = {
  cleaned: string;
  found: PIIMatch[];
  totalRemoved: number;
};

const PII_PATTERNS: Record<PIIType, RegExp> = {
  // Phone numbers (US and international formats)
  phone: /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,

  // Email addresses
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,

  // SSN (XXX-XX-XXXX)
  ssn: /\b\d{3}-\d{2}-\d{4}\b/g,

  // Credit card numbers (basic pattern)
  creditCard: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,

  // US addresses (simplified - street number + street name)
  address: /\b\d+\s+[\w\s]+(?:street|st|avenue|ave|road|rd|highway|hwy|square|sq|trail|trl|drive|dr|court|ct|parkway|pkwy|circle|cir|boulevard|blvd)\b/gi,

  // Tax IDs / EIN
  taxId: /\b\d{2}-\d{7}\b/g,

  // Passport numbers (simplified)
  passport: /\b[A-Z]{1,2}\d{6,9}\b/g
};

const REPLACEMENT_TEXT: Record<PIIType, string> = {
  phone: '[PHONE_REMOVED]',
  email: '[EMAIL_REMOVED]',
  ssn: '[SSN_REMOVED]',
  creditCard: '[CREDIT_CARD_REMOVED]',
  address: '[ADDRESS_REMOVED]',
  taxId: '[TAX_ID_REMOVED]',
  passport: '[PASSPORT_REMOVED]'
};

export function scrubPII(text: string): ScrubResult {
  console.log('[pii-scrubber] Starting PII scrub, text length:', text.length);

  // Safety check: if text is extremely long, log warning
  if (text.length > 500000) {
    console.warn('[pii-scrubber] WARNING: Very large text detected:', text.length, 'chars');
  }

  let cleaned = text;
  const found: Map<PIIType, number> = new Map();
  let totalRemoved = 0;

  // Process each PII type
  Object.entries(PII_PATTERNS).forEach(([type, pattern]) => {
    const piiType = type as PIIType;

    console.time(`pii-${piiType}`);
    console.log(`[pii-scrubber] Testing for ${piiType}...`);

    const matches = text.match(pattern);
    console.timeEnd(`pii-${piiType}`);

    if (matches && matches.length > 0) {
      // Count unique matches
      const uniqueMatches = new Set(matches);
      const count = uniqueMatches.size;

      console.log(`[pii-scrubber] Found ${count} unique ${piiType} match(es)`);

      found.set(piiType, count);
      totalRemoved += count;

      // Replace all occurrences with sanitized text
      cleaned = cleaned.replace(pattern, REPLACEMENT_TEXT[piiType]);
    } else {
      console.log(`[pii-scrubber] No ${piiType} found`);
    }
  });

  // Convert Map to array of PIIMatch objects
  const foundArray: PIIMatch[] = Array.from(found.entries()).map(([type, count]) => ({
    type,
    count
  }));

  console.log('[pii-scrubber] Scrubbing complete, total removed:', totalRemoved);

  return {
    cleaned,
    found: foundArray,
    totalRemoved
  };
}

export function formatPIISummary(found: PIIMatch[]): string {
  if (found.length === 0) {
    return 'No PII detected';
  }

  const items = found.map(item => {
    const label = formatPIIType(item.type);
    const plural = item.count > 1 ? 's' : '';
    return `${item.count} ${label}${plural}`;
  });

  return `Found and removed: ${items.join(', ')}`;
}

function formatPIIType(type: PIIType): string {
  const labels: Record<PIIType, string> = {
    phone: 'phone number',
    email: 'email address',
    ssn: 'SSN',
    creditCard: 'credit card number',
    address: 'street address',
    taxId: 'tax ID',
    passport: 'passport number'
  };
  return labels[type];
}
