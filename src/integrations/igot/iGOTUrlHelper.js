/**
 * iGOT URL Validation & Sanitization Helper
 * 
 * Ensures all external iGOT links point to the current, official iGOT Karmayogi
 * platform (https://igotkarmayogi.gov.in) with valid SSL certificates,
 * and completely prevents obsolete domains (e.g., igot.gov.in) that trigger
 * NET::ERR_CERT_DATE_INVALID.
 */

export const OFFICIAL_IGOT_PLATFORM_URL = 'https://igotkarmayogi.gov.in';

/**
 * Validates and sanitizes external iGOT course URLs.
 * 
 * Safety Rules:
 * 1. Rejects obsolete domains (e.g., igot.gov.in) that have expired certificates.
 * 2. Rejects malformed or non-https URLs.
 * 3. Never generates or guesses fake course pages.
 * 4. Safely falls back to the official iGOT Karmayogi platform (https://igotkarmayogi.gov.in).
 * 
 * @param {string} url - Candidate external URL
 * @returns {string} Verified official iGOT URL
 */
export function sanitizeIGOTUrl(url) {
  if (!url || typeof url !== 'string') {
    return OFFICIAL_IGOT_PLATFORM_URL;
  }
  const clean = url.trim();

  // If it points to the obsolete igot.gov.in domain, safely fall back to official platform
  if (clean.includes('igot.gov.in') && !clean.includes('igotkarmayogi.gov.in')) {
    return OFFICIAL_IGOT_PLATFORM_URL;
  }

  // Validate URL protocol and hostname
  try {
    const parsed = new URL(clean);
    if (parsed.protocol !== 'https:') {
      return OFFICIAL_IGOT_PLATFORM_URL;
    }
    // Allow verified official Karmayogi domains
    if (parsed.hostname.endsWith('igotkarmayogi.gov.in') || parsed.hostname.endsWith('karmayogi.gov.in')) {
      return parsed.href;
    }
    return OFFICIAL_IGOT_PLATFORM_URL;
  } catch {
    return OFFICIAL_IGOT_PLATFORM_URL;
  }
}
