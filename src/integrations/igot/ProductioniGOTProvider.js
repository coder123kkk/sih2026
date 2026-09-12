/**
 * Production iGOT Provider
 * 
 * Implements IGOTProviderInterface using actual iGOT APIs.
 * Used when IGOT_ENVIRONMENT=production.
 * 
 * IMPORTANT: This provider requires official iGOT API credentials
 * and endpoint documentation from the Capacity Building Commission.
 * 
 * Currently stubbed — implement when real API access is available.
 */

import { IGOTProviderInterface } from './iGOTProviderInterface';
import { IGOTAPIClient } from './iGOTAPIClient';

export class ProductionIGOTProvider extends IGOTProviderInterface {
  constructor(config) {
    super();
    this.client = new IGOTAPIClient(config);
  }

  async searchCourses(query = '', filters = {}, page = 1, limit = 12) {
    // TODO: Implement when official iGOT search API is documented
    // Expected: this.client.get('/courses/search', { query, ...filters, page, limit })
    throw new Error(
      'Production iGOT API not configured. ' +
      'Please provide official iGOT API credentials and endpoint documentation. ' +
      'Set IGOT_ENVIRONMENT=demo to use mock data.'
    );
  }

  async getCourseById(courseId) {
    // TODO: Implement when official iGOT course API is documented
    // Expected: this.client.get(`/courses/${courseId}`)
    throw new Error('Production iGOT API not configured.');
  }

  async getCourseCatalogue(page = 1, limit = 12) {
    // TODO: Implement when official iGOT catalogue API is documented
    throw new Error('Production iGOT API not configured.');
  }

  async getLearnerProfile(learnerId) {
    // TODO: Implement when official iGOT learner API is documented
    throw new Error('Production iGOT API not configured.');
  }

  async getLearnerEnrollments(learnerId) {
    // TODO: Implement when official iGOT enrollment API is documented
    throw new Error('Production iGOT API not configured.');
  }

  async getLearnerProgress(learnerId, courseId) {
    // TODO: Implement when official iGOT progress API is documented
    throw new Error('Production iGOT API not configured.');
  }

  async getLearnerCompletions(learnerId) {
    // TODO: Implement when official iGOT completions API is documented
    throw new Error('Production iGOT API not configured.');
  }

  async getCourseCategories() {
    // TODO: Implement when official iGOT categories API is documented
    throw new Error('Production iGOT API not configured.');
  }

  async getCourseProviders() {
    // TODO: Implement when official iGOT providers API is documented
    throw new Error('Production iGOT API not configured.');
  }
}
