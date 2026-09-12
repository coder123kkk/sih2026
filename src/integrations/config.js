/**
 * Integration Configuration
 * 
 * Reads environment variables and provides configuration
 * for external system integrations (iGOT, Parichay, etc.)
 * 
 * IMPORTANT: This file runs server-side only.
 * API keys and secrets are NEVER exposed to the frontend.
 */

export function getIGOTConfig() {
  return {
    environment: process.env.IGOT_ENVIRONMENT || 'demo',
    apiBaseUrl: process.env.IGOT_API_BASE_URL || '',
    clientId: process.env.IGOT_CLIENT_ID || '',
    clientSecret: process.env.IGOT_CLIENT_SECRET || '',
    accessToken: process.env.IGOT_ACCESS_TOKEN || '',
  };
}

export function getAuthConfig() {
  return {
    mode: process.env.AUTH_MODE || 'demo',
    secret: process.env.AUTH_SECRET || 'demo-secret',
  };
}

export function isDemo() {
  return (process.env.IGOT_ENVIRONMENT || 'demo') === 'demo';
}

export function isProduction() {
  return process.env.IGOT_ENVIRONMENT === 'production';
}
