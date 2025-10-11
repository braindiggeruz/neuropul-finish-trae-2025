/**
 * Safe base64 encoding that handles UTF-8 characters (Cyrillic, Uzbek, etc.)
 * Use this instead of btoa() to avoid Latin1 range errors
 */
export function utf8ToBase64(str: string): string {
  try {
    // Convert UTF-8 string to base64 safely
    // Use TextEncoder for proper UTF-8 byte conversion
    const bytes = new TextEncoder().encode(str);
    const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join('');
    return btoa(binString);
  } catch (error) {
    console.error('Base64 encoding failed:', error);
    // Fallback: return empty string or handle error
    return '';
  }
}

/**
 * Safe base64 decoding that handles UTF-8 characters
 */
export function base64ToUtf8(base64: string): string {
  try {
    const binString = atob(base64);
    const bytes = Uint8Array.from(binString, (char) => char.codePointAt(0)!);
    return new TextDecoder().decode(bytes);
  } catch (error) {
    console.error('Base64 decoding failed:', error);
    return '';
  }
}
