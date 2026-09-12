/**
 * Assessment Service
 * 
 * Manages assessment question banks, tests, submissions,
 * scoring, and history across multiple question types:
 * - Single-answer MCQ
 * - Multiple-answer MCQ
 * - True / False
 * - Numerical Calculation
 * - Scenario-Based Case Question
 */

export const mockQuestionBank = [
  {
    id: "Q001",
    type: "single-mcq",
    category: "statistical",
    competencyId: "COMP_NATIONAL_ACCOUNTS",
    question: "Which approach is primary for estimating Gross Value Added (GVA) for the manufacturing sector in India's National Accounts (2011-12 series)?",
    options: [
      "Income approach using factor payments",
      "Production approach using output minus intermediate consumption from MCA-21 and ASI",
      "Expenditure approach using final consumption data",
      "Commodity flow method only"
    ],
    correctAnswer: 1,
    explanation: "In India's National Accounts, manufacturing GVA is compiled using the production approach (Gross Value of Output minus Intermediate Consumption) utilizing MCA-21 database for corporate and ASI for registered factories.",
    points: 10
  },
  {
    id: "Q002",
    type: "multi-mcq",
    category: "statistical",
    competencyId: "COMP_SURVEY_DESIGN",
    question: "Which of the following are stratification criteria commonly utilized in MoSPI's Periodic Labour Force Survey (PLFS) sampling design? (Select all that apply)",
    options: [
      "Rural and Urban sector division within each district",
      "Household monthly consumer expenditure / affluence status",
      "Individual voter registration records",
      "Sub-stratification based on household size and education of head"
    ],
    correctAnswers: [0, 1, 3],
    explanation: "PLFS stratifies districts into rural and urban sectors, and within selected FSU villages/blocks, households are sub-stratified by affluence, household size, and education level.",
    points: 15
  },
  {
    id: "Q003",
    type: "true-false",
    category: "technical",
    competencyId: "COMP_PYTHON",
    question: "In Python pandas library, the `.dropna()` method modifies the original DataFrame in-place by default without needing `inplace=True`.",
    options: ["True", "False"],
    correctAnswer: 1, // False
    explanation: "In pandas, `.dropna()` returns a new DataFrame copy by default. It only mutates the original DataFrame if `inplace=True` is explicitly passed.",
    points: 5
  },
  {
    id: "Q004",
    type: "numerical",
    category: "statistical",
    competencyId: "COMP_INDEX_NUMBERS",
    question: "If base year price P0 = 100, current year price P1 = 125, base year quantity Q0 = 20, and current year quantity Q1 = 22. What is the Laspeyres Price Relative for this item? (Calculate in percentage, e.g. 125)",
    correctNumeric: 125,
    tolerance: 0.1,
    explanation: "Laspeyres price relative = (P1 / P0) * 100 = (125 / 100) * 100 = 125%.",
    points: 10
  },
  {
    id: "Q005",
    type: "scenario",
    category: "digital-governance",
    competencyId: "COMP_DATA_QUALITY",
    question: "Case Scenario: A field investigator in FOD collects survey microdata where 12% of values in rural income are missing non-randomly (MNAR). According to MoSPI National Data Quality Framework guidelines, what is the approved remediation protocol?",
    options: [
      "Delete all incomplete records completely to prevent bias",
      "Document the pattern of missingness in survey metadata, apply multiple imputation or hot-deck within homogeneous strata, and publish sensitivity analysis",
      "Replace all missing values with national median without documentation",
      "Duplicate adjacent interview responses"
    ],
    correctAnswer: 1,
    explanation: "Per MoSPI Data Quality protocols, non-random missingness must be documented in data provenance metadata, treated using appropriate stratified imputation (like hot-deck), and accompanied by sensitivity disclosure.",
    points: 20
  }
];

export const mockAssessmentHistory = [
  {
    id: "HIST-001",
    assessmentTitle: "National Accounts & GVA Certification Exam",
    date: "2026-08-20",
    score: 85,
    maxScore: 100,
    status: "passed",
    competenciesUpdated: ["National Accounts Statistics (+1 Level)"],
    certificateUrl: "#"
  },
  {
    id: "HIST-002",
    assessmentTitle: "NSS & PLFS Sampling Methodology Quiz",
    date: "2026-07-14",
    score: 90,
    maxScore: 100,
    status: "passed",
    competenciesUpdated: ["Sample Survey Design (+1 Level)"],
    certificateUrl: "#"
  },
  {
    id: "HIST-003",
    assessmentTitle: "Python for Official Statistics Diagnostic Test",
    date: "2026-06-02",
    score: 60,
    maxScore: 100,
    status: "needs-improvement",
    competenciesUpdated: ["Python for Data Analysis (Gap Identified)"],
    certificateUrl: null
  }
];

import { getCompetencyService } from './CompetencyService.js';
import { getUserById } from '@/data/mock-users';

export class AssessmentService {
  getAllQuestions() {
    return mockQuestionBank;
  }

  getQuestionsByCompetency(competencyId) {
    return mockQuestionBank.filter(q => q.competencyId === competencyId);
  }

  getAssessmentHistory(userId) {
    return mockAssessmentHistory;
  }

  /**
   * Evaluates assessment submission, maps questions to competencies,
   * updates competency scores, recalculates skill gaps, and records history.
   */
  submitAssessment({ userId = 'USR001', answers = {} }) {
    let earnedPoints = 0;
    let totalPoints = 0;
    const details = [];
    const strengths = [];
    const weakAreas = [];
    const competencyUpdates = {};

    const compService = getCompetencyService();
    const userProfileBefore = compService.getUserCompetencyProfile(userId);
    const compMap = {};
    if (userProfileBefore && userProfileBefore.competencies) {
      userProfileBefore.competencies.forEach(c => {
        compMap[c.id] = c;
      });
    }

    for (const q of mockQuestionBank) {
      totalPoints += q.points;
      const userAns = answers[q.id];
      let isCorrect = false;

      if (q.type === 'single-mcq' || q.type === 'scenario' || q.type === 'true-false') {
        isCorrect = userAns === q.correctAnswer;
      } else if (q.type === 'multi-mcq') {
        if (Array.isArray(userAns)) {
          isCorrect = JSON.stringify(userAns.slice().sort()) === JSON.stringify((q.correctAnswers || []).slice().sort());
        }
      } else if (q.type === 'numerical') {
        isCorrect = Math.abs(parseFloat(userAns) - q.correctNumeric) <= (q.tolerance || 0.1);
      }

      if (isCorrect) earnedPoints += q.points;

      // Map competency ID alias if needed
      const compId = q.competencyId === 'COMP_INDEX_NUMBERS' ? 'COMP_PRICE_STATS' : q.competencyId;
      const compInfo = compMap[compId];
      const compName = compInfo?.name || (compId === 'COMP_PRICE_STATS' ? 'Price Statistics & Index Numbers' : compId);

      const prevScore = compInfo?.currentScore ?? (compInfo?.percentScore ?? 50);
      const requiredScore = compInfo?.requiredScore ?? 80;

      let scoreDelta = 0;
      if (isCorrect) {
        // Boost proportional to question points (e.g. 10pts -> +12%, 15pts -> +15%, 20pts -> +18%)
        scoreDelta = Math.min(20, Math.max(8, Math.round(q.points * 0.95)));
        const newScore = Math.min(100, prevScore + scoreDelta);
        const newGap = Math.max(0, requiredScore - newScore);

        competencyUpdates[compId] = { scoreDelta };
        strengths.push({
          questionId: q.id,
          competencyId: compId,
          competencyName: compName,
          previousScore: prevScore,
          newScore,
          scoreDelta,
          requiredScore,
          previousGap: compInfo?.gapScore ?? Math.max(0, requiredScore - prevScore),
          newGap,
          category: q.category
        });
      } else {
        const gap = compInfo?.gapScore ?? Math.max(0, requiredScore - prevScore);
        weakAreas.push({
          questionId: q.id,
          competencyId: compId,
          competencyName: compName,
          currentScore: prevScore,
          requiredScore,
          gap,
          gapStatus: compInfo?.gapStatus || (gap >= 25 ? 'High' : 'Medium'),
          category: q.category,
          recommendedLearning: `iGOT & NSSTA Modules for ${compName}`
        });
      }

      details.push({
        questionId: q.id,
        question: q.question,
        competencyId: compId,
        competencyName: compName,
        isCorrect,
        pointsEarned: isCorrect ? q.points : 0,
        maxPoints: q.points,
        explanation: q.explanation
      });
    }

    const percentage = Math.round((earnedPoints / totalPoints) * 100);
    const passed = percentage >= 70;

    // 3 & 4. Update competency scores and recalculate gaps in Competency Service
    const updatedProfile = compService.updateUserCompetencyProfile(userId, competencyUpdates);

    // 5. Update user learning stats in mock-users
    const user = getUserById(userId);
    if (user && user.learningStats) {
      if (passed) {
        user.learningStats.assessmentsPassed = (user.learningStats.assessmentsPassed || 0) + 1;
      }
    }

    // 7. Save attempt in Assessment History & Records
    const historyItem = {
      id: `HIST-${Date.now()}`,
      assessmentTitle: "Statistical Officer Comprehensive Diagnostic (Stage II)",
      date: new Date().toISOString().split('T')[0],
      score: earnedPoints,
      maxScore: totalPoints,
      percentage,
      status: passed ? "passed" : "needs-improvement",
      competenciesUpdated: strengths.map(s => `${s.competencyName} (+${s.scoreDelta}%)`),
      identifiedGaps: weakAreas.map(w => `${w.competencyName} (${w.gap}% Gap)`),
      certificateUrl: passed ? "#" : null
    };
    mockAssessmentHistory.unshift(historyItem);

    return {
      success: true,
      earnedPoints,
      totalPoints,
      percentage,
      passed,
      details,
      strengths,
      weakAreas,
      competencyUpdates: strengths,
      newProfile: updatedProfile,
      historyItem
    };
  }
}

let assessmentInstance = null;
export function getAssessmentService() {
  if (!assessmentInstance) assessmentInstance = new AssessmentService();
  return assessmentInstance;
}
