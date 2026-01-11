import '@testing-library/jest-dom'
import { vi } from 'vitest'
import { Buffer } from 'buffer'

global.Buffer = Buffer

// Mock crypto.randomUUID if not available (some jsdom envs)
if (!global.crypto.randomUUID) {
    global.crypto.randomUUID = (() =>
        '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
            (
                Number(c) ^
                (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))
            ).toString(16)
        )) as any;
}

// Mock TextEncoder/TextDecoder
import { TextEncoder, TextDecoder } from 'util'
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as any

// Mock fetch
global.fetch = vi.fn()

// Polyfill File/Blob.arrayBuffer if missing (JSDOM issue)
if (!Blob.prototype.arrayBuffer) {
    Blob.prototype.arrayBuffer = async function () {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result as ArrayBuffer);
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(this);
        });
    };
}
