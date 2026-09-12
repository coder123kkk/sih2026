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
import { mockLearnerData } from '@/data/mock-igot-learner';

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
   * Deterministic recommendation ranking layer for AI Copilot (Requirements 2, 3, 4, 5, 7, 11, 12)
   * Calculates: relevanceScore = gapMatch * 0.40 + roleMatch * 0.20 + assignmentMatch * 0.15 + competencyMatch * 0.15 + learningHistory * 0.10
   * Filters out already completed courses, flags in-progress courses, and provides explainable reasons.
   *
   * @param {string} userId
   * @param {string} query
   * @returns {Promise<Object>} Unified structured recommendation result
   */
  async getPersonalizedCopilotRecommendations(userId = 'USR001', query = '') {
    const compService = getCompetencyService();
    const igotService = IGOTIntegrationService.getInstance();
    const trainingService = getTrainingService();
    const user = getUserById(userId) || getUserById('USR001');

    // 1. Re-use existing Competency Engine (Requirement 2)
    const profile = compService.getUserCompetencyProfile(user.id);
    const allGaps = (profile?.allGaps || []).filter(g => (g.gapScore > 0 || g.gap > 0));
    
    // Sort priority gaps by severity: Critical > High > Medium > Low, then by gapScore descending
    const severityWeight = { Critical: 4, High: 3, Medium: 2, Low: 1 };
    const priorityGaps = allGaps.sort((a, b) => {
      const diff = (severityWeight[b.gapStatus] || 0) - (severityWeight[a.gapStatus] || 0);
      if (diff !== 0) return diff;
      return (b.gapScore || 0) - (a.gapScore || 0);
    });

    const gapMap = {};
    for (const g of priorityGaps) {
      gapMap[g.id] = g;
      if (g.name) gapMap[g.name.toLowerCase()] = g;
    }

    // 2. Fetch user's enrollments & completions (Requirement 5)
    let enrollments = [];
    try {
      enrollments = await igotService.getLearnerEnrollments(user.id);
    } catch {
      enrollments = mockLearnerData[user.id]?.enrollments || [];
    }

    const completedCourseIds = new Set(
      enrollments.filter(e => e.status === 'completed' || e.progress === 100).map(e => e.courseId)
    );
    const inProgressMap = new Map(
      enrollments.filter(e => e.status === 'in-progress' && e.progress < 100).map(e => [e.courseId, e.progress])
    );

    // 3. Obtain course data through existing iGOTIntegrationService (Requirement 11)
    const { courses } = await igotService.searchCourses('', {}, 1, 100);

    const qLower = (query || '').toLowerCase();
    const isPythonQuery = qLower.includes('python');
    const isSamplingQuery = qLower.includes('sampling') || qLower.includes('sample');
    const isPLFSQuery = qLower.includes('plfs') || qLower.includes('labour');
    const isNationalAccountsQuery = qLower.includes('national accounts') || qLower.includes('gdp') || qLower.includes('gva') || qLower.includes('sna');
    const isSurveyDesignQuery = qLower.includes('survey design') || qLower.includes('questionnaire') || qLower.includes('capi');

    // 4. Deterministic Scoring Model (Requirement 4)
    const scoredCourses = [];

    for (const course of courses) {
      // Exclude already completed courses (Requirement 5)
      if (completedCourseIds.has(course.id)) {
        continue;
      }

      const courseComps = course.competencies || course.competencyMapping || [];
      const courseText = (course.title + ' ' + course.description + ' ' + (course.tags || []).join(' ')).toLowerCase();

      // --- Component 1: gapMatch (0 - 100, Weight 0.40) ---
      let gapMatch = 0;
      let matchedGap = null;

      for (const cc of courseComps) {
        const found = gapMap[cc.id] || gapMap[cc.competencyId] || (cc.name && gapMap[cc.name.toLowerCase()]);
        if (found) {
          matchedGap = found;
          if (found.gapStatus === 'Critical') gapMatch = Math.max(gapMatch, 100);
          else if (found.gapStatus === 'High') gapMatch = Math.max(gapMatch, 85);
          else if (found.gapStatus === 'Medium') gapMatch = Math.max(gapMatch, 65);
          else gapMatch = Math.max(gapMatch, 40);
        }
      }

      if (!matchedGap) {
        for (const g of priorityGaps) {
          if (courseText.includes(g.name.toLowerCase())) {
            matchedGap = g;
            gapMatch = (g.gapStatus === 'Critical' || g.gapStatus === 'High') ? 80 : 60;
            break;
          }
        }
      }

      // --- Component 2: roleMatch (0 - 100, Weight 0.20) ---
      let roleMatch = 50;
      const isSenior = user.grade === 'Group A' || user.designation?.toLowerCase().includes('director');
      if (isSenior) {
        if (course.difficulty === 'Advanced' || course.level === 'Advanced') roleMatch = 95;
        else if (course.difficulty === 'Intermediate' || course.level === 'Intermediate') roleMatch = 80;
        else roleMatch = 40;
      } else {
        if (course.difficulty === 'Intermediate' || course.level === 'Intermediate') roleMatch = 90;
        else if (course.difficulty === 'Beginner' || course.level === 'Beginner') roleMatch = 85;
        else roleMatch = 65;
      }
      if (user.jobRole && courseText.includes(user.jobRole.toLowerCase())) {
        roleMatch = Math.min(100, roleMatch + 15);
      }

      // --- Component 3: assignmentMatch (0 - 100, Weight 0.15) ---
      let assignmentMatch = 40;
      const assign = (user.currentAssignment || '').toLowerCase();
      if (assign) {
        const words = assign.split(/[\s,&()]+/).filter(w => w.length > 3);
        if (words.some(w => courseText.includes(w))) {
          assignmentMatch = 85;
        }
      }
      // Boost if query explicitly asks about this course's topic
      if (isPythonQuery && (courseText.includes('python') || course.id === 'igot-crs-001')) assignmentMatch = 100;
      if (isSamplingQuery && (courseText.includes('sampling') || course.id === 'igot-crs-009')) assignmentMatch = 100;
      if (isSurveyDesignQuery && (courseText.includes('survey design') || course.id === 'igot-crs-008')) assignmentMatch = 100;
      if (isPLFSQuery && (courseText.includes('labour') || courseText.includes('survey') || courseText.includes('plfs'))) assignmentMatch = 100;
      if (isNationalAccountsQuery && (courseText.includes('national accounts') || course.id === 'igot-crs-010')) assignmentMatch = 100;

      // --- Component 4: competencyMatch (0 - 100, Weight 0.15) ---
      let competencyMatch = 50;
      if (courseComps.some(c => c.weight === 'high')) competencyMatch = 90;
      else if (courseComps.some(c => c.weight === 'medium')) competencyMatch = 70;

      // --- Component 5: learningHistory (0 - 100, Weight 0.10) ---
      let learningHistory = 50;
      const isEnrolled = inProgressMap.has(course.id);
      if (isEnrolled) {
        learningHistory = 90; // Continuity
      } else if (user.skills?.some(s => courseText.includes(s.toLowerCase()))) {
        learningHistory = 75;
      }

      // Exact Formula (Requirement 4):
      let relevanceScore = (gapMatch * 0.40) + (roleMatch * 0.20) + (assignmentMatch * 0.15) + (competencyMatch * 0.15) + (learningHistory * 0.10);

      // Penalize courses completely unrelated to either user gaps or user explicit query
      const isTopicRequested = (isPythonQuery && courseText.includes('python')) ||
                               (isSamplingQuery && courseText.includes('sampling')) ||
                               (isSurveyDesignQuery && courseText.includes('survey')) ||
                               (isNationalAccountsQuery && courseText.includes('account')) ||
                               (isPLFSQuery && (courseText.includes('labour') || courseText.includes('survey')));

      if (gapMatch === 0 && !isTopicRequested) {
        relevanceScore *= 0.2; // Don't recommend random catalogue items
      }

      // Explainable Reason (Requirement 3)
      let reason = '';
      if (matchedGap) {
        reason = `Addresses your ${matchedGap.name} competency gap (Current: ${matchedGap.currentScore}%, Required: ${matchedGap.requiredScore}%).`;
      } else if (isPythonQuery && courseText.includes('python')) {
        reason = 'Directly targets Python programming and data automation.';
      } else if (isSamplingQuery && courseText.includes('sampling')) {
        reason = 'Focuses on sampling methodologies for official statistics.';
      } else if (isPLFSQuery) {
        reason = `Supports your current assignment on ${user.currentAssignment}.`;
      } else {
        reason = `Strengthens core statistical proficiencies for ${user.designation}.`;
      }

      scoredCourses.push({
        id: course.id,
        title: course.title,
        source: course.provider?.includes('NSSTA') ? 'NSSTA Programme' : 'iGOT Karmayogi',
        provider: course.provider || 'Capacity Building Commission',
        competency: matchedGap ? matchedGap.name : (courseComps[0]?.name || course.category || 'Statistical Analysis'),
        duration: course.duration,
        level: course.level || course.difficulty,
        actionUrl: `/igot/${course.id}`,
        relevanceScore: Math.round(relevanceScore),
        isEnrolled,
        progress: inProgressMap.get(course.id) || 0,
        actionLabel: isEnrolled ? 'Continue Learning' : 'View Course',
        reason,
        matchedGapId: matchedGap?.id || null
      });
    }

    // Sort by relevanceScore descending
    scoredCourses.sort((a, b) => b.relevanceScore - a.relevanceScore);
    const topRecommendedCourses = scoredCourses.filter(c => c.relevanceScore > 20).slice(0, 3);

    // 5. NSSTA Training Programmes matching the exact same gaps (Requirement 12)
    const allProgrammes = trainingService.getAllProgrammes();
    const scoredNSSTA = [];

    for (const prog of allProgrammes) {
      const progComps = prog.competencies || [];
      const progText = (prog.title + ' ' + (prog.description || '')).toLowerCase();
      let progScore = 0;
      let matchedGap = null;

      for (const pc of progComps) {
        const found = gapMap[pc.id] || gapMap[pc.name?.toLowerCase()];
        if (found) {
          matchedGap = found;
          progScore = Math.max(progScore, found.gapStatus === 'Critical' ? 95 : 85);
        }
      }

      if (!matchedGap) {
        for (const g of priorityGaps) {
          if (progText.includes(g.name.toLowerCase())) {
            matchedGap = g;
            progScore = (g.gapStatus === 'Critical' || g.gapStatus === 'High') ? 80 : 65;
            break;
          }
        }
      }

      // Check query match
      if (isSamplingQuery && progText.includes('sampling')) progScore = 95;
      if (isSurveyDesignQuery && progText.includes('survey')) progScore = 95;
      if (isNationalAccountsQuery && progText.includes('national accounts')) progScore = 95;

      if (progScore > 0) {
        scoredNSSTA.push({
          id: prog.id,
          title: prog.title,
          source: 'NSSTA Programme',
          provider: prog.institution || 'NSSTA Greater Noida',
          competency: matchedGap ? matchedGap.name : (progComps[0]?.name || 'Official Statistics'),
          duration: prog.duration || '5 Days (Residential)',
          level: prog.targetGroup?.includes('Senior') || prog.targetGroup?.includes('Group A') ? 'Executive' : 'Intermediate',
          actionUrl: '/training',
          reason: matchedGap ? `Addresses your ${matchedGap.name} skill gap via practical residential training.` : `Recommended residential programme at NSSTA.`,
          relevanceScore: progScore
        });
      }
    }

    scoredNSSTA.sort((a, b) => b.relevanceScore - a.relevanceScore);
    const topRecommendedTraining = scoredNSSTA.slice(0, 2);

    // 6. Formulate unified reasoning based on actual priority gaps
    const gapListText = priorityGaps.slice(0, 2).map(g => g.name).join(' and ');
    const reasoning = priorityGaps.length > 0
      ? `Based on your current competency profile as ${user.designation} in ${user.department}, your highest-priority gaps are ${gapListText}. I recommend strengthening these areas first.`
      : `Your competency profile is well-aligned with your role as ${user.designation}. Continuing advanced capacity building will maintain your high-performance status.`;

    // 7. Assemble Single Structured Recommendation Result (Requirement 7 & 10)
    return {
      user: {
        id: user.id,
        name: user.name,
        designation: user.designation,
        department: user.department,
        jobRole: user.jobRole,
        currentAssignment: user.currentAssignment,
        qualification: user.qualification,
        yearsOfService: user.yearsOfService,
        grade: user.grade
      },
      priorityGaps: priorityGaps.slice(0, 4),
      reasoning,
      recommendedCourses: topRecommendedCourses,
      recommendedTraining: topRecommendedTraining,
      nextSteps: [
        topRecommendedCourses[0] ? `Enroll in "${topRecommendedCourses[0].title}" on iGOT Karmayogi` : 'Review iGOT catalogue',
        topRecommendedTraining[0] ? `Nominate for "${topRecommendedTraining[0].title}" at NSSTA` : 'Check NSSTA calendar',
        'Retake competency knowledge check after module completion'
      ],
      debug: {
        userId: user.id,
        designation: user.designation,
        topSkillGaps: priorityGaps.slice(0, 4).map(g => `${g.name} (${g.gapScore || g.gap}% gap, ${g.gapStatus})`),
        recommendationScores: topRecommendedCourses.map(c => ({
          id: c.id,
          title: c.title,
          relevanceScore: c.relevanceScore,
          reason: c.reason,
          isEnrolled: c.isEnrolled
        })),
        selectedCourses: topRecommendedCourses.map(c => c.id),
        aiProviderStatus: 'active',
        fallbackUsed: false
      }
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
