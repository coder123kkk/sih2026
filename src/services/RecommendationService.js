/**
 * Recommendation Service
 * 
 * Rule-based recommendation engine (Phase 1).
 * Recommends iGOT courses and NSSTA programmes based on:
 * 
 * 1. User's skill gaps
 * 2. Course competency mappings
 * 3. Gap severity weights
 * 4. Competency weight on course
 * 
 * Architecture is modular — this engine can be replaced with
 * ML/LLM-based ranking in Phase 2 without changing the interface.
 */

import { IGOTIntegrationService } from './iGOTIntegrationService';
import { getCompetencyService } from './CompetencyService';
import { getTrainingService } from './TrainingProgrammeService';
import { getInternalResourcesByCompetency } from '@/data/mock-internal-resources';
import { getUserById } from '@/data/mock-users';

const GAP_SEVERITY_WEIGHT = {
  critical: 4,
  high: 3,
  medium: 2,
  none: 0
};

const COMPETENCY_COURSE_WEIGHT = {
  high: 3,
  medium: 2,
  low: 1
};

export class RecommendationService {
  /**
   * Get personalized iGOT course recommendations for a user
   * @param {string} userId
   * @param {number} limit - Max recommendations
   * @returns {Promise<Array>} Ranked recommendations
   */
  async getIGOTRecommendations(userId, limit = 5) {
    const compService = getCompetencyService();
    const igotService = IGOTIntegrationService.getInstance();

    // Get user's skill gaps
    const gaps = compService.getSkillGaps(userId);
    if (gaps.length === 0) return [];

    // Create a gap lookup: competencyId → { gap, severity }
    const gapMap = {};
    for (const g of gaps) {
      gapMap[g.id] = { gap: g.gap, severity: g.gapSeverity };
    }

    // Get all iGOT courses
    const { courses } = await igotService.searchCourses('', {}, 1, 100);

    // Score each course against user's gaps
    const scored = courses.map(course => {
      let score = 0;
      const matchedGaps = [];

      for (const comp of course.competencies || []) {
        const gapInfo = gapMap[comp.id];
        if (gapInfo && gapInfo.gap > 0) {
          const severityWeight = GAP_SEVERITY_WEIGHT[gapInfo.severity] || 1;
          const courseWeight = COMPETENCY_COURSE_WEIGHT[comp.weight] || 1;
          score += severityWeight * courseWeight;
          matchedGaps.push({
            competencyId: comp.id,
            competencyName: comp.name,
            gap: gapInfo.gap,
            severity: gapInfo.severity
          });
        }
      }

      return {
        course,
        score,
        matchedGaps,
        relevancePercent: 0 // Will be normalized below
      };
    });

    // Normalize scores to 0–100%
    const maxScore = Math.max(...scored.map(s => s.score), 1);
    for (const item of scored) {
      item.relevancePercent = Math.round((item.score / maxScore) * 100);
    }

    // Sort by score descending, take top N
    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((s, index) => ({
        id: `REC-IGOT-${index + 1}`,
        courseId: s.course.id,
        source: 'igot',
        course: s.course,
        relevanceScore: s.relevancePercent,
        matchedGaps: s.matchedGaps,
        reason: this._generateReason(s.matchedGaps),
        priority: index + 1
      }));
  }

  /**
   * Get NSSTA training programme recommendations for a user
   * @param {string} userId
   * @param {number} limit
   * @returns {Promise<Array>}
   */
  async getNSSTARecommendations(userId, limit = 3) {
    const compService = getCompetencyService();
    const trainingService = getTrainingService();

    const gaps = compService.getSkillGaps(userId);
    if (gaps.length === 0) return [];

    const gapMap = {};
    for (const g of gaps) {
      gapMap[g.id] = { gap: g.gap, severity: g.gapSeverity };
    }

    const programmes = trainingService.getAllProgrammes();

    const scored = programmes.map(prog => {
      let score = 0;
      const matchedGaps = [];

      for (const comp of prog.competencies || []) {
        const gapInfo = gapMap[comp.id];
        if (gapInfo && gapInfo.gap > 0) {
          const severityWeight = GAP_SEVERITY_WEIGHT[gapInfo.severity] || 1;
          const courseWeight = COMPETENCY_COURSE_WEIGHT[comp.weight] || 1;
          score += severityWeight * courseWeight;
          matchedGaps.push({
            competencyId: comp.id,
            competencyName: comp.name,
            gap: gapInfo.gap,
            severity: gapInfo.severity
          });
        }
      }

      return { programme: prog, score, matchedGaps };
    });

    const maxScore = Math.max(...scored.map(s => s.score), 1);

    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((s, index) => ({
        id: `REC-NSSTA-${index + 1}`,
        programmeId: s.programme.id,
        source: 'nssta',
        programme: s.programme,
        relevanceScore: Math.round((s.score / maxScore) * 100),
        matchedGaps: s.matchedGaps,
        reason: this._generateReason(s.matchedGaps),
        priority: index + 1
      }));
  }

  /**
   * Get combined recommendations (iGOT + NSSTA)
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async getAllRecommendations(userId) {
    const [igotRecs, nsstaRecs] = await Promise.all([
      this.getIGOTRecommendations(userId, 5),
      this.getNSSTARecommendations(userId, 3)
    ]);

    return {
      igot: igotRecs,
      nssta: nsstaRecs,
      totalRecommendations: igotRecs.length + nsstaRecs.length
    };
  }

  /**
   * Get targeted recommendations for a specific competency
   * Supports iGOT courses, NSSTA programmes, and internal resources
   * @param {Object} params
   */
  async getRecommendationsForCompetency({
    competencyId,
    competencyName,
    userId = 'USR001',
    currentScore,
    requiredScore,
    gapScore,
    gapStatus
  }) {
    const compService = getCompetencyService();
    const igotService = IGOTIntegrationService.getInstance();
    const trainingService = getTrainingService();
    const user = getUserById(userId) || {};

    const profile = compService.getUserCompetencyProfile(userId);
    let comp = (profile?.competencies || []).find(
      c => c.id === competencyId || (competencyName && c.name?.toLowerCase() === competencyName.toLowerCase())
    );

    if (comp) {
      comp = { ...comp };
    } else {
      comp = {
        id: competencyId || 'COMP_GENERAL',
        name: competencyName || 'Competency',
        currentScore: 52,
        requiredScore: 80,
        currentLevel: 2,
        requiredLevel: 4,
        currentLevelLabel: 'Intermediate',
        requiredLevelLabel: 'Advanced',
        gapScore: 28,
        gapStatus: 'High'
      };
    }

    if (currentScore !== undefined && currentScore !== null && currentScore !== '') {
      comp.currentScore = Number(currentScore);
    }
    if (requiredScore !== undefined && requiredScore !== null && requiredScore !== '') {
      comp.requiredScore = Number(requiredScore);
    }
    if (gapScore !== undefined && gapScore !== null && gapScore !== '') {
      comp.gapScore = Number(gapScore);
    }
    if (gapStatus) {
      comp.gapStatus = gapStatus;
    }

    // 1. iGOT Courses matching this competency
    const { courses } = await igotService.searchCourses('', {}, 1, 100);
    const matchedIGOT = courses
      .map(course => {
        let matchScore = 0;
        const comps = course.competencies || course.competencyMapping || [];
        const found = comps.find(
          c => c.id === comp.id || c.competencyId === comp.id || (c.name && comp.name && c.name.toLowerCase().includes(comp.name.toLowerCase()))
        );

        if (found) {
          matchScore += 50;
          if (found.weight === 'high') matchScore += 30;
          else if (found.weight === 'medium') matchScore += 20;
          else matchScore += 10;
        } else if (course.title.toLowerCase().includes(comp.name.toLowerCase()) || course.description.toLowerCase().includes(comp.name.toLowerCase())) {
          matchScore += 30;
        }

        // Match difficulty with user's current level
        if (comp.currentLevel <= 2 && (course.difficulty === 'Beginner' || course.difficulty === 'Intermediate')) {
          matchScore += 20;
        } else if (comp.currentLevel >= 3 && (course.difficulty === 'Intermediate' || course.difficulty === 'Advanced')) {
          matchScore += 20;
        }

        return { course, matchScore };
      })
      .filter(item => item.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .map(item => item.course);

    // 2. NSSTA / TPAC Programmes matching this competency
    const allProgrammes = trainingService.getAllProgrammes();
    const matchedNSSTA = allProgrammes
      .map(prog => {
        let matchScore = 0;
        const comps = prog.competencies || [];
        const found = comps.find(
          c => c.id === comp.id || c.competencyId === comp.id || (c.name && comp.name && c.name.toLowerCase().includes(comp.name.toLowerCase()))
        );

        if (found) {
          matchScore += 50;
          if (found.weight === 'high') matchScore += 30;
        } else if (prog.title.toLowerCase().includes(comp.name.toLowerCase()) || prog.description.toLowerCase().includes(comp.name.toLowerCase())) {
          matchScore += 30;
        }

        // Match target group with user's job role or designation
        if (user.designation && prog.targetGroup?.toLowerCase().includes(user.designation.toLowerCase())) {
          matchScore += 20;
        } else if (user.jobRole && prog.targetGroup?.toLowerCase().includes(user.jobRole.toLowerCase())) {
          matchScore += 20;
        }

        return { programme: prog, matchScore };
      })
      .filter(item => item.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .map(item => item.programme);

    // 3. Other Internal Learning Resources
    let internalResources = getInternalResourcesByCompetency(comp.id);
    if (!internalResources || internalResources.length === 0) {
      internalResources = mockInternalResources.filter(r => 
        (r.title && comp.name && r.title.toLowerCase().includes(comp.name.toLowerCase())) ||
        (r.description && comp.name && r.description.toLowerCase().includes(comp.name.toLowerCase()))
      );
      if (internalResources.length === 0) {
        internalResources = mockInternalResources.slice(0, 2);
      }
    }

    return {
      competency: comp,
      userContext: {
        userId,
        name: user.name || 'Dr. Priya Sharma',
        designation: user.designation || 'Deputy Director',
        department: user.department || 'Labour Statistics Division',
        jobRole: user.jobRole || 'Survey Data Compilation & Statistical Analysis'
      },
      igotCourses: matchedIGOT.length > 0 ? matchedIGOT : courses.slice(0, 2),
      nsstaProgrammes: matchedNSSTA.length > 0 ? matchedNSSTA : allProgrammes.slice(0, 1),
      internalResources
    };
  }

  /**
   * Generate a human-readable reason for the recommendation
   * @private
   */
  _generateReason(matchedGaps) {
    if (matchedGaps.length === 0) return '';
    const topGap = matchedGaps.sort((a, b) => b.gap - a.gap)[0];
    if (matchedGaps.length === 1) {
      return `Addresses ${topGap.severity} skill gap in ${topGap.competencyName}`;
    }
    return `Addresses ${topGap.severity} gap in ${topGap.competencyName} and ${matchedGaps.length - 1} other competenc${matchedGaps.length - 1 === 1 ? 'y' : 'ies'}`;
  }
}

let recInstance = null;
export function getRecommendationService() {
  if (!recInstance) recInstance = new RecommendationService();
  return recInstance;
}
