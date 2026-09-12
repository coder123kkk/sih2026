/**
 * iGOT Course Adapter
 * 
 * Converts raw iGOT API responses into the platform's internal
 * Course model. This isolates the rest of the application from
 * changes in the iGOT API response format.
 * 
 * Raw iGOT Response → Adapter → Internal Course Model
 */

import { sanitizeIGOTUrl } from './iGOTUrlHelper';

export class IGOTCourseAdapter {
  /**
   * Convert a raw iGOT course response to our internal Course model
   * @param {Object} rawCourse - Raw course data from iGOT
   * @returns {Object} Normalized internal Course object
   */
  static toCourse(rawCourse) {
    return {
      id: rawCourse.id || rawCourse.identifier || '',
      externalId: rawCourse.externalId || rawCourse.identifier || '',
      source: 'igot',
      title: rawCourse.title || rawCourse.name || 'Untitled Course',
      description: rawCourse.description || '',
      provider: rawCourse.provider || rawCourse.organisation || 'Unknown Provider',
      duration: rawCourse.duration || '',
      durationMinutes: rawCourse.durationMinutes || IGOTCourseAdapter.parseDuration(rawCourse.duration),
      difficulty: rawCourse.difficulty || rawCourse.level || 'Beginner',
      level: rawCourse.level || rawCourse.difficulty || 'Beginner',
      category: rawCourse.category || rawCourse.domain || 'General',
      skills: rawCourse.skills || (rawCourse.competencyMapping || rawCourse.competencies || []).map(c => c.name || c),
      courseType: rawCourse.courseType || 'online',
      imageUrl: rawCourse.imageUrl || rawCourse.posterImage || rawCourse.appIcon || null,
      competencies: (rawCourse.competencyMapping || rawCourse.competencies || []).map(c => ({
        id: c.competencyId || c.id || '',
        name: c.name || '',
        weight: c.weight || 'medium'
      })),
      tags: rawCourse.tags || rawCourse.keywords || [],
      learningObjectives: rawCourse.learningObjectives || [],
      modules: rawCourse.modules || [],
      externalUrl: sanitizeIGOTUrl(rawCourse.externalUrl || rawCourse.courseUrl),
      language: rawCourse.language || 'English',
      lastUpdated: rawCourse.lastUpdated || rawCourse.lastPublishedOn || null,
      enrollmentStatus: null,
      completionStatus: null,
      completionPercentage: null
    };
  }

  /**
   * Convert an array of raw courses to internal models
   * @param {Array} rawCourses
   * @returns {Array} Array of normalized Course objects
   */
  static toCourses(rawCourses) {
    return (rawCourses || []).map(c => IGOTCourseAdapter.toCourse(c));
  }

  /**
   * Enrich a course with learner-specific data (enrollment, progress)
   * @param {Object} course - Internal Course object
   * @param {Object} enrollment - Enrollment data
   * @returns {Object} Course enriched with learner data
   */
  static enrichWithLearnerData(course, enrollment) {
    if (!enrollment) return course;
    return {
      ...course,
      enrollmentStatus: enrollment.status || null,
      completionStatus: enrollment.status === 'completed' ? 'completed' : 'in-progress',
      completionPercentage: enrollment.progress || 0,
      enrolledAt: enrollment.enrolledAt || null,
      lastAccessedAt: enrollment.lastAccessedAt || null,
      assessmentScore: enrollment.assessmentScore || null,
      certificateUrl: enrollment.certificateUrl || null
    };
  }

  /**
   * Convert a raw NSSTA/TPAC programme to our internal TrainingProgramme model
   * @param {Object} rawProgramme
   * @returns {Object} Normalized TrainingProgramme object
   */
  static toTrainingProgramme(rawProgramme) {
    return {
      id: rawProgramme.id || '',
      title: rawProgramme.title || '',
      description: rawProgramme.description || '',
      source: rawProgramme.source || 'nssta',
      institution: rawProgramme.institution || '',
      duration: rawProgramme.duration || '',
      durationDays: rawProgramme.durationDays || 0,
      mode: rawProgramme.mode || 'classroom',
      startDate: rawProgramme.startDate || null,
      endDate: rawProgramme.endDate || null,
      targetGroup: rawProgramme.targetGroup || '',
      competencies: (rawProgramme.competencies || []).map(c => ({
        id: c.competencyId || c.id || '',
        name: c.name || '',
        weight: c.weight || 'medium'
      })),
      eligibility: rawProgramme.eligibility || '',
      seats: rawProgramme.seats || 0,
      seatsAvailable: rawProgramme.seatsAvailable || 0,
      status: rawProgramme.status || 'upcoming',
      coordinator: rawProgramme.coordinator || '',
      venue: rawProgramme.venue || ''
    };
  }

  /**
   * Parse duration string to minutes
   * @param {string} durationStr - e.g., "2h 30m", "4 hours"
   * @returns {number}
   */
  static parseDuration(durationStr) {
    if (!durationStr) return 0;
    let minutes = 0;
    const hourMatch = durationStr.match(/(\d+)\s*h/i);
    const minMatch = durationStr.match(/(\d+)\s*m/i);
    if (hourMatch) minutes += parseInt(hourMatch[1]) * 60;
    if (minMatch) minutes += parseInt(minMatch[1]);
    return minutes;
  }
}
