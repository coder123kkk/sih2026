/**
 * iGOT Integration Service
 * 
 * The CORE service that mediates all iGOT interactions.
 * 
 * Responsibilities:
 * 1. Instantiate the correct provider (Mock or Production) based on config
 * 2. Route all iGOT data requests through the provider
 * 3. Normalize responses through the IGOTCourseAdapter
 * 4. Handle errors gracefully (fallback to demo data if production fails)
 * 
 * Usage:
 *   const service = IGOTIntegrationService.getInstance();
 *   const courses = await service.searchCourses('python');
 */

import { getIGOTConfig, isDemo } from '@/integrations/config';
import { MockIGOTProvider } from '@/integrations/igot/MockiGOTProvider';
import { ProductionIGOTProvider } from '@/integrations/igot/ProductioniGOTProvider';
import { IGOTCourseAdapter } from '@/integrations/igot/iGOTCourseAdapter';
import { sanitizeIGOTUrl, OFFICIAL_IGOT_PLATFORM_URL } from '@/integrations/igot/iGOTUrlHelper';

export { sanitizeIGOTUrl, OFFICIAL_IGOT_PLATFORM_URL };

let instance = null;

export class IGOTIntegrationService {
  constructor() {
    const config = getIGOTConfig();
    this.environment = config.environment;

    if (isDemo()) {
      this.provider = new MockIGOTProvider();
    } else {
      this.provider = new ProductionIGOTProvider(config);
    }
  }

  static getInstance() {
    if (!instance) {
      instance = new IGOTIntegrationService();
    }
    return instance;
  }

  /** Reset singleton (useful for testing or config changes) */
  static resetInstance() {
    instance = null;
  }

  /** Check if running in demo mode */
  isDemoMode() {
    return this.environment === 'demo';
  }

  /**
   * Safe URL validator/helper (Requirement 9)
   * Prevents obsolete or malformed external URLs from being returned to the UI.
   */
  sanitizeCourseUrl(url) {
    return sanitizeIGOTUrl(url);
  }

  /**
   * Return verified official iGOT platform URL
   */
  getOfficialPlatformUrl() {
    return OFFICIAL_IGOT_PLATFORM_URL;
  }

  /**
   * Search iGOT courses
   * Returns normalized Course objects
   */
  async searchCourses(query = '', filters = {}, page = 1, limit = 12) {
    try {
      const result = await this.provider.searchCourses(query, filters, page, limit);
      return {
        ...result,
        courses: IGOTCourseAdapter.toCourses(result.courses),
        source: this.isDemoMode() ? 'demo' : 'igot-api'
      };
    } catch (error) {
      console.error('[iGOT Service] searchCourses failed:', error.message);
      if (!this.isDemoMode()) {
        console.warn('[iGOT Service] Falling back to demo data');
        const fallback = new MockIGOTProvider();
        const result = await fallback.searchCourses(query, filters, page, limit);
        return {
          ...result,
          courses: IGOTCourseAdapter.toCourses(result.courses),
          source: 'demo-fallback'
        };
      }
      throw error;
    }
  }

  /**
   * Get a single course by ID
   * Returns a normalized Course object
   */
  async getCourseById(courseId) {
    try {
      const rawCourse = await this.provider.getCourseById(courseId);
      if (!rawCourse) return null;
      return IGOTCourseAdapter.toCourse(rawCourse);
    } catch (error) {
      console.error('[iGOT Service] getCourseById failed:', error.message);
      if (!this.isDemoMode()) {
        const fallback = new MockIGOTProvider();
        const rawCourse = await fallback.getCourseById(courseId);
        return rawCourse ? IGOTCourseAdapter.toCourse(rawCourse) : null;
      }
      throw error;
    }
  }

  /**
   * Get course catalogue
   */
  async getCourseCatalogue(page = 1, limit = 12) {
    return this.searchCourses('', {}, page, limit);
  }

  /**
   * Get learner enrollments, enriched with course data
   */
  async getLearnerEnrollments(userId) {
    try {
      const enrollments = await this.provider.getLearnerEnrollments(userId);
      // Enrich each enrollment with course details
      const enriched = await Promise.all(
        enrollments.map(async (enrollment) => {
          const course = await this.getCourseById(enrollment.courseId);
          if (course) {
            return IGOTCourseAdapter.enrichWithLearnerData(course, enrollment);
          }
          return { ...enrollment, courseNotFound: true };
        })
      );
      return enriched.filter(e => !e.courseNotFound);
    } catch (error) {
      console.error('[iGOT Service] getLearnerEnrollments failed:', error.message);
      return [];
    }
  }

  /**
   * Get learner profile including learning history
   */
  async getLearnerProfile(userId) {
    try {
      return await this.provider.getLearnerProfile(userId);
    } catch (error) {
      console.error('[iGOT Service] getLearnerProfile failed:', error.message);
      return null;
    }
  }

  /**
   * Get learner completions
   */
  async getLearnerCompletions(userId) {
    try {
      return await this.provider.getLearnerCompletions(userId);
    } catch (error) {
      console.error('[iGOT Service] getLearnerCompletions failed:', error.message);
      return [];
    }
  }

  /**
   * Get learner progress for a specific course
   */
  async getLearnerProgress(userId, courseId) {
    try {
      return await this.provider.getLearnerProgress(userId, courseId);
    } catch (error) {
      console.error('[iGOT Service] getLearnerProgress failed:', error.message);
      return null;
    }
  }

  /**
   * Get course categories
   */
  async getCourseCategories() {
    try {
      return await this.provider.getCourseCategories();
    } catch (error) {
      console.error('[iGOT Service] getCourseCategories failed:', error.message);
      return [];
    }
  }

  /**
   * Get course providers
   */
  async getCourseProviders() {
    try {
      return await this.provider.getCourseProviders();
    } catch (error) {
      console.error('[iGOT Service] getCourseProviders failed:', error.message);
      return [];
    }
  }
}
