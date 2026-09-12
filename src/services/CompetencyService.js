/**
 * Competency Service
 * 
 * Manages the competency framework and user competency profiles.
 * Computes skill gaps, overall competency scores, and
 * identifies areas needing improvement.
 */

import { competencyFramework, getAllCompetencies, getCompetencyById } from '@/data/mock-competency-framework';
import { getUserById } from '@/data/mock-users';

export class CompetencyService {
  /**
   * Get the full competency framework
   */
  getFramework() {
    return competencyFramework;
  }

  /**
   * Get all competencies as a flat list
   */
  getAllCompetencies() {
    return getAllCompetencies();
  }

  /**
   * Get a user's competency profile with computed gaps
   * @param {string} userId
   * @returns {Object} { competencies: [...], overallScore, gapSummary }
   */
  getUserCompetencyProfile(userId) {
    const user = getUserById(userId);
    if (!user || !user.competencyProfile) return null;

    const allComps = getAllCompetencies();
    const profile = [];
    let totalCurrent = 0;
    let totalRequired = 0;
    let gapCount = 0;

    for (const comp of allComps) {
      const userComp = user.competencyProfile[comp.id];
      if (userComp) {
        const currentScore = userComp.currentScore !== undefined
          ? userComp.currentScore
          : Math.min(100, Math.round((userComp.currentLevel / 5) * 100));
        
        const requiredScore = userComp.requiredScore !== undefined
          ? userComp.requiredScore
          : Math.min(100, Math.round((userComp.requiredLevel / 5) * 100));

        const gapScore = userComp.gap !== undefined
          ? userComp.gap
          : Math.max(0, requiredScore - currentScore);

        const levelGap = userComp.requiredLevel - userComp.currentLevel;

        const gapStatus = userComp.gapStatus || this._getGapStatus(gapScore);

        profile.push({
          ...comp,
          currentLevel: userComp.currentLevel,
          requiredLevel: userComp.requiredLevel,
          currentLevelLabel: this._getLevelLabel(userComp.currentLevel),
          requiredLevelLabel: this._getLevelLabel(userComp.requiredLevel),
          currentScore,
          requiredScore,
          gapScore,
          gap: levelGap,
          gapSeverity: this._getGapSeverity(levelGap),
          gapStatus,
          status: gapStatus,
          percentScore: currentScore
        });

        totalCurrent += userComp.currentLevel;
        totalRequired += userComp.requiredLevel;
        if (gapScore > 0 || levelGap > 0) gapCount++;
      }
    }

    const overallScore = totalRequired > 0
      ? Math.round((totalCurrent / totalRequired) * 100)
      : 0;

    // Sort by gap (largest first) for gap summary
    const gaps = profile
      .filter(c => c.gap > 0)
      .sort((a, b) => b.gap - a.gap);

    return {
      userId,
      competencies: profile,
      overallScore,
      totalCompetencies: profile.length,
      competenciesWithGaps: gapCount,
      topGaps: gaps.slice(0, 5),
      allGaps: gaps,
      byCategory: this._groupByCategory(profile)
    };
  }

  /**
   * Update a user's competency scores and recalculate gaps
   * @param {string} userId 
   * @param {Object} updates - Map of competencyId -> { scoreDelta, newScore, newLevel }
   * @returns {Object} Updated competency profile
   */
  updateUserCompetencyProfile(userId, updates) {
    const user = getUserById(userId);
    if (!user || !user.competencyProfile) return null;

    for (const [compId, update] of Object.entries(updates)) {
      const targetId = compId === 'COMP_INDEX_NUMBERS' ? 'COMP_PRICE_STATS' : compId;
      const comp = user.competencyProfile[targetId];
      if (comp) {
        let newCurrentScore = comp.currentScore;
        if (update.newScore !== undefined) {
          newCurrentScore = Math.min(100, Math.max(0, update.newScore));
        } else if (update.scoreDelta !== undefined) {
          newCurrentScore = Math.min(100, Math.max(0, comp.currentScore + update.scoreDelta));
        }

        const requiredScore = comp.requiredScore !== undefined ? comp.requiredScore : 80;
        const newGap = Math.max(0, requiredScore - newCurrentScore);
        const newGapStatus = this._getGapStatus(newGap);

        let newCurrentLevel = comp.currentLevel;
        if (update.newLevel !== undefined) {
          newCurrentLevel = update.newLevel;
        } else {
          if (newCurrentScore >= 90) newCurrentLevel = Math.max(comp.currentLevel, 5);
          else if (newCurrentScore >= 75) newCurrentLevel = Math.max(comp.currentLevel, 4);
          else if (newCurrentScore >= 60) newCurrentLevel = Math.max(comp.currentLevel, 3);
          else if (newCurrentScore >= 40) newCurrentLevel = Math.max(comp.currentLevel, 2);
          else newCurrentLevel = Math.max(comp.currentLevel, 1);
        }

        comp.currentScore = newCurrentScore;
        comp.currentLevel = newCurrentLevel;
        comp.gap = newGap;
        comp.gapStatus = newGapStatus;
      }
    }

    return this.getUserCompetencyProfile(userId);
  }

  /**
   * Get skill gaps for a user
   * @param {string} userId
   * @returns {Array} Sorted list of skill gaps
   */
  getSkillGaps(userId) {
    const profile = this.getUserCompetencyProfile(userId);
    if (!profile) return [];
    return profile.allGaps;
  }

  /**
   * Get category-level scores for radar/overview
   * @param {string} userId
   * @returns {Array<{ category, score }>}
   */
  getCategoryScores(userId) {
    const profile = this.getUserCompetencyProfile(userId);
    if (!profile) return [];

    return Object.entries(profile.byCategory).map(([category, comps]) => {
      const avgScore = comps.reduce((sum, c) => sum + c.percentScore, 0) / comps.length;
      return {
        category,
        categoryName: comps[0]?.categoryName || category,
        score: Math.round(avgScore),
        competencyCount: comps.length,
        gapCount: comps.filter(c => c.gap > 0).length
      };
    });
  }

  /**
   * Determine user friendly level label
   * @private
   */
  _getLevelLabel(level) {
    if (level <= 1) return 'Beginner';
    if (level <= 3) return 'Intermediate';
    if (level === 4) return 'Advanced';
    return 'Expert';
  }

  /**
   * Determine gap status
   * @private
   */
  _getGapStatus(gapScore) {
    if (gapScore <= 10) return 'Low';
    if (gapScore <= 25) return 'Medium';
    if (gapScore <= 35) return 'High';
    return 'Critical';
  }

  /**
   * Determine gap severity
   * @private
   */
  _getGapSeverity(gap) {
    if (gap >= 3) return 'critical';
    if (gap >= 2) return 'high';
    if (gap >= 1) return 'medium';
    return 'none';
  }

  /**
   * Group competencies by category
   * @private
   */
  _groupByCategory(competencies) {
    const groups = {};
    for (const comp of competencies) {
      if (!groups[comp.category]) groups[comp.category] = [];
      groups[comp.category].push(comp);
    }
    return groups;
  }
}

let compInstance = null;
export function getCompetencyService() {
  if (!compInstance) compInstance = new CompetencyService();
  return compInstance;
}
