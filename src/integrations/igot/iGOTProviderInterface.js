/**
 * iGOT Provider Interface
 * 
 * Defines the contract that all iGOT data providers must implement.
 * Both MockiGOTProvider and ProductioniGOTProvider implement this interface.
 * 
 * This ensures the application can switch between demo and production
 * modes without any changes to the service layer or frontend.
 */

export class IGOTProviderInterface {
  /**
   * Search iGOT courses by query and optional filters
   * @param {string} query - Search text
   * @param {Object} filters - { category, difficulty, provider, duration, competency }
   * @param {number} page - Page number (1-indexed)
   * @param {number} limit - Results per page
   * @returns {Promise<{courses: Array, total: number, page: number, totalPages: number}>}
   */
  async searchCourses(query, filters = {}, page = 1, limit = 12) {
    throw new Error('searchCourses() must be implemented by provider');
  }

  /**
   * Get a single course by its ID
   * @param {string} courseId - Internal course ID
   * @returns {Promise<Object|null>} Course object or null
   */
  async getCourseById(courseId) {
    throw new Error('getCourseById() must be implemented by provider');
  }

  /**
   * Get the full course catalogue with pagination
   * @param {number} page
   * @param {number} limit
   * @returns {Promise<{courses: Array, total: number, page: number, totalPages: number}>}
   */
  async getCourseCatalogue(page = 1, limit = 12) {
    throw new Error('getCourseCatalogue() must be implemented by provider');
  }

  /**
   * Get learner profile from iGOT
   * @param {string} learnerId - iGOT learner identifier
   * @returns {Promise<Object|null>}
   */
  async getLearnerProfile(learnerId) {
    throw new Error('getLearnerProfile() must be implemented by provider');
  }

  /**
   * Get learner's course enrollments
   * @param {string} learnerId
   * @returns {Promise<Array>}
   */
  async getLearnerEnrollments(learnerId) {
    throw new Error('getLearnerEnrollments() must be implemented by provider');
  }

  /**
   * Get learner's progress on a specific course
   * @param {string} learnerId
   * @param {string} courseId
   * @returns {Promise<Object|null>}
   */
  async getLearnerProgress(learnerId, courseId) {
    throw new Error('getLearnerProgress() must be implemented by provider');
  }

  /**
   * Get learner's completed courses
   * @param {string} learnerId
   * @returns {Promise<Array>}
   */
  async getLearnerCompletions(learnerId) {
    throw new Error('getLearnerCompletions() must be implemented by provider');
  }

  /**
   * Get available course categories
   * @returns {Promise<Array<string>>}
   */
  async getCourseCategories() {
    throw new Error('getCourseCategories() must be implemented by provider');
  }

  /**
   * Get available course providers
   * @returns {Promise<Array<string>>}
   */
  async getCourseProviders() {
    throw new Error('getCourseProviders() must be implemented by provider');
  }
}
