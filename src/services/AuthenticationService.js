/**
 * Authentication Service
 * 
 * Abstraction layer for authentication.
 * Supports two modes:
 * 
 * 1. DEMO MODE: Simple email/password against mock user data
 * 2. PARICHAY MODE: Government SSO via Parichay (future)
 * 
 * The service exposes a consistent interface regardless of mode.
 * When Parichay SSO becomes available, implement ParichayAuthProvider
 * and update this service — zero frontend changes needed.
 */

import { getAuthConfig } from '@/integrations/config';
import { getUserByEmail, getUserById } from '@/data/mock-users';

// Simple in-memory session store for demo mode
const sessions = new Map();

export class AuthenticationService {
  constructor() {
    this.config = getAuthConfig();
  }

  /**
   * Login with credentials
   * @param {string} email
   * @param {string} password
   * @returns {{ success: boolean, user?: Object, token?: string, error?: string }}
   */
  async login(email, password) {
    if (this.config.mode === 'demo') {
      return this._demoLogin(email, password);
    }
    // Future: Parichay SSO flow
    // if (this.config.mode === 'parichay') {
    //   return this._parichayLogin(email, password);
    // }
    return { success: false, error: 'Authentication mode not configured' };
  }

  /**
   * Validate a session token and return the user
   * @param {string} token
   * @returns {{ user: Object|null, valid: boolean }}
   */
  async validateSession(token) {
    if (!token) return { user: null, valid: false };

    if (this.config.mode === 'demo') {
      const userId = sessions.get(token);
      if (!userId) return { user: null, valid: false };
      const user = getUserById(userId);
      if (!user) return { user: null, valid: false };
      const { password, ...safeUser } = user;
      return { user: safeUser, valid: true };
    }

    return { user: null, valid: false };
  }

  /**
   * Logout — invalidate session
   * @param {string} token
   */
  async logout(token) {
    sessions.delete(token);
  }

  /**
   * Demo login implementation
   * @private
   */
  _demoLogin(email, password) {
    const user = getUserByEmail(email);
    if (!user) {
      return { success: false, error: 'User not found. Try priya.sharma@mospi.gov.in' };
    }
    if (user.password !== password) {
      return { success: false, error: 'Invalid password. Use demo123' };
    }

    // Create a simple session token
    const token = `demo-${user.id}-${Date.now()}`;
    sessions.set(token, user.id);

    const { password: _, ...safeUser } = user;
    return { success: true, user: safeUser, token };
  }
}

// Singleton
let authInstance = null;
export function getAuthService() {
  if (!authInstance) authInstance = new AuthenticationService();
  return authInstance;
}
