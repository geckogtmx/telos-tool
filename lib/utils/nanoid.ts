import { customAlphabet } from 'nanoid';

// Use a URL-friendly alphabet
// Removed similar looking characters like l, 1, I, o, 0, O
const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';

// 10 characters gives ~400M years needed to have a 1% probability of at least one collision.
// sufficient for this use case.
const generateId = customAlphabet(alphabet, 10);

export function generatePublicId(): string {
  return generateId();
}
