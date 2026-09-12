/**
 * Mock iGOT Provider
 * 
 * Implements IGOTProviderInterface using local mock data.
 * Used when IGOT_ENVIRONMENT=demo.
 * 
 * This provider serves realistic mock data through the same
 * interface that the production provider will use, ensuring
 * the frontend and service layer work identically in both modes.
 */

import { IGOTProviderInterface } from './iGOTProviderInterface';
import { mockIGOTCourses, mockIGOTCategories, mockIGOTProviders } from '@/data/mock-igot-courses';
import { mockLearnerData } from '@/data/mock-igot-learner';

export class MockIGOTProvider extends IGOTProviderInterface {

  async searchCourses(query = '', filters = {}, page = 1, limit = 12) {
    let results = [...mockIGOTCourses];

    // Text search across title, description, category, skills, tags, competencies
    if (query) {
      const q = query.toLowerCase().trim();
      results = results.filter(course =>
        (course.title && course.title.toLowerCase().includes(q)) ||
        (course.description && course.description.toLowerCase().includes(q)) ||
        (course.category && course.category.toLowerCase().includes(q)) ||
        (course.skills || []).some(s => s.toLowerCase().includes(q)) ||
        (course.tags || []).some(tag => tag.toLowerCase().includes(q)) ||
        (course.competencyMapping || []).some(c => (c.name && c.name.toLowerCase().includes(q)))
      );
    }

    // 1. Category Filter (supports canonical categories and aliases)
    if (filters.category) {
      const targetCat = filters.category.toLowerCase().trim();
      const categoryAliases = {
        'technical': ['technical', 'data science', 'ai/ml'],
        'statistical': ['statistical', 'statistics'],
        'statistics': ['statistics', 'statistical'],
        'data science': ['data science', 'technical'],
        'ai/ml': ['ai/ml', 'technical', 'artificial intelligence', 'ai'],
        'digital governance': ['digital governance'],
        'cybersecurity': ['cybersecurity', 'digital governance'],
        'behavioural': ['behavioural', 'management'],
        'management': ['management', 'behavioural']
      };
      const allowed = categoryAliases[targetCat] || [targetCat];
      results = results.filter(c => {
        const cat = (c.category || '').toLowerCase();
        return allowed.includes(cat) || cat.includes(targetCat) || targetCat.includes(cat);
      });
    }

    // 2. Skill / Competency Filter
    if (filters.skill || filters.competency) {
      const targetSkill = (filters.skill || filters.competency).toLowerCase().trim();
      results = results.filter(c => {
        const hasSkill = (c.skills || []).some(s => {
          const sLower = s.toLowerCase();
          if (targetSkill.length <= 2) {
            return sLower === targetSkill || sLower.split(/[\s,/-]+/).includes(targetSkill);
          }
          return sLower === targetSkill || sLower.includes(targetSkill) || targetSkill.includes(sLower);
        });
        const hasComp = (c.competencyMapping || []).some(cm => {
          const nameLower = (cm.name || '').toLowerCase();
          const idLower = (cm.competencyId || '').toLowerCase();
          if (targetSkill.length <= 2) {
            return nameLower === targetSkill || nameLower.split(/[\s,/-]+/).includes(targetSkill) || idLower === `comp_${targetSkill}`;
          }
          return nameLower === targetSkill || nameLower.includes(targetSkill) || targetSkill.includes(nameLower);
        });
        const hasTag = (c.tags || []).some(t => {
          const tLower = t.toLowerCase();
          if (targetSkill.length <= 2) {
            return tLower === targetSkill || tLower.split('-').includes(targetSkill);
          }
          return tLower === targetSkill || tLower.includes(targetSkill) || targetSkill.includes(tLower);
        });
        return hasSkill || hasComp || hasTag;
      });
    }

    // 3. Level / Difficulty Filter
    if (filters.level || filters.difficulty) {
      const targetLevel = (filters.level || filters.difficulty).toLowerCase().trim();
      results = results.filter(c =>
        (c.level && c.level.toLowerCase() === targetLevel) ||
        (c.difficulty && c.difficulty.toLowerCase() === targetLevel)
      );
    }

    // 4. Duration Filter
    if (filters.duration) {
      const d = filters.duration.toLowerCase().trim();
      if (d === 'short' || d === '<2h' || d === '< 2 hours' || d === '< 2h') {
        results = results.filter(c => c.durationMinutes <= 120);
      } else if (d === 'medium' || d === '2-4h' || d === '2 – 4 hours' || d === '2-4 hours' || d === '2 – 4h') {
        results = results.filter(c => c.durationMinutes > 120 && c.durationMinutes <= 240);
      } else if (d === 'long' || d === '4h+' || d === '4+ hours' || d === '>4h' || d === '> 4 hours') {
        results = results.filter(c => c.durationMinutes > 240);
      }
    }
    if (filters.maxDuration) {
      results = results.filter(c => c.durationMinutes <= parseInt(filters.maxDuration));
    }
    if (filters.minDuration) {
      results = results.filter(c => c.durationMinutes >= parseInt(filters.minDuration));
    }

    if (filters.provider) {
      results = results.filter(c => c.provider === filters.provider);
    }

    const total = results.length;
    const totalPages = Math.ceil(total / limit);
    const startIdx = (page - 1) * limit;
    const paged = results.slice(startIdx, startIdx + limit);

    return { courses: paged, total, page, totalPages };
  }

  async getCourseById(courseId) {
    return mockIGOTCourses.find(c => c.id === courseId) || null;
  }

  async getCourseCatalogue(page = 1, limit = 12) {
    return this.searchCourses('', {}, page, limit);
  }

  async getLearnerProfile(learnerId) {
    // In demo mode, learnerId maps to our user ID
    const data = mockLearnerData[learnerId];
    if (!data) return null;
    return {
      learnerId,
      enrollments: data.enrollments || [],
      learningHistory: data.learningHistory || []
    };
  }

  async getLearnerEnrollments(learnerId) {
    const data = mockLearnerData[learnerId];
    if (!data) return [];
    return data.enrollments || [];
  }

  async getLearnerProgress(learnerId, courseId) {
    const data = mockLearnerData[learnerId];
    if (!data) return null;
    return data.enrollments.find(e => e.courseId === courseId) || null;
  }

  async getLearnerCompletions(learnerId) {
    const data = mockLearnerData[learnerId];
    if (!data) return [];
    return data.enrollments.filter(e => e.status === 'completed');
  }

  async getCourseCategories() {
    return mockIGOTCategories;
  }

  async getCourseProviders() {
    return mockIGOTProviders;
  }
}
