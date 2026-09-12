/**
 * Learning Service
 * 
 * Manages learning progress, learning history, and statistics.
 * Combines data from iGOT enrollments and internal tracking.
 */

import { IGOTIntegrationService } from './iGOTIntegrationService';
import { getUserById } from '@/data/mock-users';

export class LearningService {
  /**
   * Get learning statistics for a user
   * @param {string} userId
   * @returns {Object} Learning stats
   */
  async getLearningStats(userId) {
    const user = getUserById(userId);
    if (!user) return null;

    const igotService = IGOTIntegrationService.getInstance();
    const enrollments = await igotService.getLearnerEnrollments(userId);

    const completed = enrollments.filter(e => e.completionStatus === 'completed');
    const inProgress = enrollments.filter(e => e.completionStatus === 'in-progress');

    return {
      coursesCompleted: user.learningStats?.coursesCompleted || completed.length,
      coursesInProgress: user.learningStats?.coursesInProgress || inProgress.length,
      totalLearningHours: user.learningStats?.totalLearningHours || 0,
      assessmentsPassed: user.learningStats?.assessmentsPassed || 0,
      certificatesEarned: user.learningStats?.certificatesEarned || 0,
      enrollments,
      recentCourses: enrollments.slice(0, 5)
    };
  }

  /**
   * Get user's enrolled/in-progress courses
   * @param {string} userId
   * @returns {Promise<Array>}
   */
  async getActiveCourses(userId) {
    const igotService = IGOTIntegrationService.getInstance();
    const enrollments = await igotService.getLearnerEnrollments(userId);
    return enrollments.filter(e => e.completionStatus === 'in-progress');
  }

  /**
   * Get user's completed courses
   * @param {string} userId
   * @returns {Promise<Array>}
   */
  async getCompletedCourses(userId) {
    const igotService = IGOTIntegrationService.getInstance();
    const enrollments = await igotService.getLearnerEnrollments(userId);
    return enrollments.filter(e => e.completionStatus === 'completed');
  }
}

let learnInstance = null;
export function getLearningService() {
  if (!learnInstance) learnInstance = new LearningService();
  return learnInstance;
}
