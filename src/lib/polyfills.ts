/**
 * Polyfills for UTF-8 safe base64 encoding/decoding
 * Fixes btoa() Latin1 range errors with Cyrillic/Uzbek text
 */

// Save original btoa/atob
const originalBtoa = window.btoa;
const originalAtob = window.atob;

/**
 * UTF-8 safe btoa replacement
 */
function utf8Btoa(str: string): string {
  try {
    // Try original first (for performance with ASCII)
    if (/^[\x00-\xFF]*$/.test(str)) {
      return originalBtoa(str);
    }

    // Handle UTF-8 characters
    const bytes = new TextEncoder().encode(str);
    const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join('');
    return originalBtoa(binString);
  } catch (error) {
    console.error('btoa encoding failed:', error);
    throw error;
  }
}

/**
 * UTF-8 safe atob replacement
 */
function utf8Atob(base64: string): string {
  try {
    const binString = originalAtob(base64);

    // Check if it's ASCII (no high bytes)
    if (/^[\x00-\x7F]*$/.test(binString)) {
      return binString;
    }

    // Decode as UTF-8
    const bytes = Uint8Array.from(binString, (char) => char.codePointAt(0)!);
    return new TextDecoder().decode(bytes);
  } catch (error) {
    console.error('atob decoding failed:', error);
    throw error;
  }
}

// Apply polyfills globally
if (typeof window !== 'undefined') {
  window.btoa = utf8Btoa as typeof window.btoa;
  window.atob = utf8Atob as typeof window.atob;
}

export { utf8Btoa, utf8Atob };
