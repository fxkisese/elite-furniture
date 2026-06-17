/**
 * sanitize.js — Input sanitization utilities
 *
 * Use these helpers on ALL user-supplied strings before writing to Supabase.
 * This prevents XSS and injection-style attacks at the frontend layer.
 * Note: Always sanitize server-side too (Supabase RLS + Edge Functions).
 */

/**
 * Strips HTML tags and trims whitespace from a string.
 * Use on any free-text field (names, descriptions, notes, etc.)
 */
export function sanitizeText(value) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/<[^>]*>/g, '')   // strip HTML tags
    .replace(/[<>'"]/g, '')    // strip remaining angle brackets & quotes
    .trim();
}

/**
 * Sanitizes and validates an email address.
 * Returns the cleaned email or null if invalid.
 */
export function sanitizeEmail(value) {
  if (typeof value !== 'string') return null;
  const cleaned = value.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(cleaned) ? cleaned : null;
}

/**
 * Sanitizes a phone number — strips everything except digits, +, spaces, hyphens.
 */
export function sanitizePhone(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/[^\d\s\+\-\(\)]/g, '').trim();
}

/**
 * Sanitizes a numeric value — returns a non-negative number or 0.
 */
export function sanitizeNumber(value) {
  const n = Number(value);
  return isNaN(n) || n < 0 ? 0 : n;
}

/**
 * Sanitizes a whole form data object by running sanitizeText on every string field.
 * Pass an object, get back a clean copy.
 */
export function sanitizeFormData(obj) {
  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      clean[key] = sanitizeText(value);
    } else if (typeof value === 'number') {
      clean[key] = sanitizeNumber(value);
    } else {
      clean[key] = value;
    }
  }
  return clean;
}
