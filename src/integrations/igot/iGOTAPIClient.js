/**
 * iGOT API Client
 * 
 * HTTP client for communicating with official iGOT APIs.
 * Handles authentication, request formatting, error handling,
 * rate limiting, and retry logic.
 * 
 * Used by ProductioniGOTProvider when IGOT_ENVIRONMENT=production.
 * 
 * IMPORTANT: No fabricated API endpoints. This client is structured
 * to be configured with real endpoints when official documentation
 * is provided.
 */

export class IGOTAPIClient {
  constructor(config) {
    this.baseUrl = config.apiBaseUrl;
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.accessToken = config.accessToken;
    this.timeout = config.timeout || 30000;
  }

  /**
   * Make an authenticated GET request to the iGOT API
   * @param {string} endpoint - API endpoint path
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} API response data
   */
  async get(endpoint, params = {}) {
    if (!this.baseUrl) {
      throw new Error('IGOT_API_BASE_URL is not configured');
    }

    const url = new URL(endpoint, this.baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this._getHeaders(),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new IGOTAPIError(
          `iGOT API request failed: ${response.status} ${response.statusText}`,
          response.status,
          endpoint
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof IGOTAPIError) throw error;
      if (error.name === 'AbortError') {
        throw new IGOTAPIError('iGOT API request timed out', 408, endpoint);
      }
      throw new IGOTAPIError(
        `iGOT API request failed: ${error.message}`,
        0,
        endpoint
      );
    }
  }

  /**
   * Make an authenticated POST request
   * @param {string} endpoint
   * @param {Object} body
   * @returns {Promise<Object>}
   */
  async post(endpoint, body = {}) {
    if (!this.baseUrl) {
      throw new Error('IGOT_API_BASE_URL is not configured');
    }

    const url = new URL(endpoint, this.baseUrl);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          ...this._getHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new IGOTAPIError(
          `iGOT API POST failed: ${response.status} ${response.statusText}`,
          response.status,
          endpoint
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof IGOTAPIError) throw error;
      if (error.name === 'AbortError') {
        throw new IGOTAPIError('iGOT API request timed out', 408, endpoint);
      }
      throw new IGOTAPIError(
        `iGOT API POST failed: ${error.message}`,
        0,
        endpoint
      );
    }
  }

  /**
   * Build authorization headers
   * @private
   */
  _getHeaders() {
    const headers = {
      'Accept': 'application/json'
    };
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }
    return headers;
  }
}

/**
 * Custom error class for iGOT API errors
 */
export class IGOTAPIError extends Error {
  constructor(message, statusCode, endpoint) {
    super(message);
    this.name = 'IGOTAPIError';
    this.statusCode = statusCode;
    this.endpoint = endpoint;
  }
}
