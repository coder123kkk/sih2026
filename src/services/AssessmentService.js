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

// Assessment Courses Catalog
export const assessmentCourses = [
  {
    id: "COURSE_ALL",
    title: "Statistical Officer Comprehensive Diagnostic (Stage II)",
    description: "Full cadre evaluation covering all 5 core competency domains",
    icon: "shield",
    questionsCount: 5,
    passingGrade: 70,
    competencies: "5 Core Domains",
    difficulty: "Advanced",
    duration: "45 min"
  },
  {
    id: "COURSE_NATIONAL_ACCOUNTS",
    title: "National Accounts & GVA Certification",
    description: "Focused evaluation on National Accounts compilation, GVA estimation, and GDP methodology",
    icon: "bar-chart",
    questionsCount: 3,
    passingGrade: 70,
    competencies: "National Accounts Statistics",
    difficulty: "Intermediate",
    duration: "20 min"
  },
  {
    id: "COURSE_SURVEY_SAMPLING",
    title: "NSS & PLFS Sampling Methodology",
    description: "Assessment on survey design, stratification, sample size estimation and PLFS methodology",
    icon: "layers",
    questionsCount: 3,
    passingGrade: 70,
    competencies: "Sample Survey Design",
    difficulty: "Advanced",
    duration: "25 min"
  },
  {
    id: "COURSE_DATA_TECH",
    title: "Python & Data Quality for Official Statistics",
    description: "Technical evaluation on Python programming, data quality frameworks and digital governance",
    icon: "code",
    questionsCount: 3,
    passingGrade: 70,
    competencies: "Technical & Digital Governance",
    difficulty: "Intermediate",
    duration: "20 min"
  },
  {
    id: "COURSE_PRICE_STATS",
    title: "Price Statistics & Index Numbers",
    description: "Evaluation on CPI/WPI compilation, index number theory, Laspeyres and Paasche indices",
    icon: "trending-up",
    questionsCount: 3,
    passingGrade: 70,
    competencies: "Price Statistics",
    difficulty: "Intermediate",
    duration: "20 min"
  }
];

export const mockQuestionBank = [
  // ---- National Accounts questions ----
  {
    id: "Q001",
    type: "single-mcq",
    category: "statistical",
    courseId: "COURSE_NATIONAL_ACCOUNTS",
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
    id: "Q006",
    type: "single-mcq",
    category: "statistical",
    courseId: "COURSE_NATIONAL_ACCOUNTS",
    competencyId: "COMP_NATIONAL_ACCOUNTS",
    question: "What is the base year currently used for India's GDP estimation under the revised National Accounts methodology?",
    options: [
      "2004-05",
      "2011-12",
      "2017-18",
      "2000-01"
    ],
    correctAnswer: 1,
    explanation: "India's GDP is currently compiled at 2011-12 base year prices under the revised National Accounts methodology introduced by CSO (now NSO).",
    points: 10
  },
  {
    id: "Q007",
    type: "true-false",
    category: "statistical",
    courseId: "COURSE_NATIONAL_ACCOUNTS",
    competencyId: "COMP_NATIONAL_ACCOUNTS",
    question: "GDP at Market Prices equals GVA at Basic Prices plus Product Taxes minus Production Subsidies.",
    options: ["True", "False"],
    correctAnswer: 0,
    explanation: "GDP at Market Prices = GVA at Basic Prices + Product Taxes (net of subsidies on products). This is the standard identity used in SNA 2008.",
    points: 5
  },
  // ---- Survey & Sampling questions ----
  {
    id: "Q002",
    type: "multi-mcq",
    category: "statistical",
    courseId: "COURSE_SURVEY_SAMPLING",
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
    id: "Q008",
    type: "single-mcq",
    category: "statistical",
    courseId: "COURSE_SURVEY_SAMPLING",
    competencyId: "COMP_SURVEY_DESIGN",
    question: "In PLFS, what is the rotation pattern used for urban sample households?",
    options: [
      "No rotation — same households surveyed every quarter",
      "75% rotation — replace 25% of panels each quarter (4-quarter rotation)",
      "50% rotation — replace half the sample every round",
      "100% rotation — entirely new sample each quarter"
    ],
    correctAnswer: 1,
    explanation: "PLFS uses a rotational panel design where 25% of urban First Stage Units (FSUs) are replaced each quarter, creating a 75% overlap between consecutive quarters for robust quarterly estimates.",
    points: 10
  },
  {
    id: "Q009",
    type: "numerical",
    category: "statistical",
    courseId: "COURSE_SURVEY_SAMPLING",
    competencyId: "COMP_SURVEY_DESIGN",
    question: "If a stratified random sample has 4 strata with equal allocation of 50 units each from populations of 1000, 2000, 3000, and 4000. What is the total sample size?",
    correctNumeric: 200,
    tolerance: 0.1,
    explanation: "With equal allocation of 50 units per stratum across 4 strata: 50 × 4 = 200 total sample units.",
    points: 10
  },
  // ---- Python & Data Quality questions ----
  {
    id: "Q003",
    type: "true-false",
    category: "technical",
    courseId: "COURSE_DATA_TECH",
    competencyId: "COMP_PYTHON",
    question: "In Python pandas library, the `.dropna()` method modifies the original DataFrame in-place by default without needing `inplace=True`.",
    options: ["True", "False"],
    correctAnswer: 1, // False
    explanation: "In pandas, `.dropna()` returns a new DataFrame copy by default. It only mutates the original DataFrame if `inplace=True` is explicitly passed.",
    points: 5
  },
  {
    id: "Q005",
    type: "scenario",
    category: "digital-governance",
    courseId: "COURSE_DATA_TECH",
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
  },
  {
    id: "Q010",
    type: "single-mcq",
    category: "technical",
    courseId: "COURSE_DATA_TECH",
    competencyId: "COMP_PYTHON",
    question: "Which Python library is most commonly used for reading fixed-width format (FWF) files from NSS survey raw data tapes?",
    options: [
      "csv module with custom delimiters",
      "pandas read_fwf() function",
      "json module with schema mapping",
      "openpyxl with column parsing"
    ],
    correctAnswer: 1,
    explanation: "pandas.read_fwf() is specifically designed for reading fixed-width formatted text files, which is the standard format for NSS and Census microdata tapes.",
    points: 10
  },
  // ---- Price Statistics & Index Numbers questions ----
  {
    id: "Q004",
    type: "numerical",
    category: "statistical",
    courseId: "COURSE_PRICE_STATS",
    competencyId: "COMP_INDEX_NUMBERS",
    question: "If base year price P0 = 100, current year price P1 = 125, base year quantity Q0 = 20, and current year quantity Q1 = 22. What is the Laspeyres Price Relative for this item? (Calculate in percentage, e.g. 125)",
    correctNumeric: 125,
    tolerance: 0.1,
    explanation: "Laspeyres price relative = (P1 / P0) * 100 = (125 / 100) * 100 = 125%.",
    points: 10
  },
  {
    id: "Q011",
    type: "single-mcq",
    category: "statistical",
    courseId: "COURSE_PRICE_STATS",
    competencyId: "COMP_INDEX_NUMBERS",
    question: "What is the current base year for India's Consumer Price Index (CPI) compiled by NSO?",
    options: [
      "2010",
      "2012",
      "2016",
      "2001"
    ],
    correctAnswer: 1,
    explanation: "India's CPI (Combined, Rural, Urban) is currently compiled with 2012 as the base year by the National Statistical Office.",
    points: 10
  },
  {
    id: "Q012",
    type: "multi-mcq",
    category: "statistical",
    courseId: "COURSE_PRICE_STATS",
    competencyId: "COMP_INDEX_NUMBERS",
    question: "Which of the following are key differences between Laspeyres and Paasche price indices? (Select all that apply)",
    options: [
      "Laspeyres uses base-period quantities as weights",
      "Paasche uses current-period quantities as weights",
      "Both use the same weighting scheme",
      "Fisher's Ideal Index is the geometric mean of Laspeyres and Paasche"
    ],
    correctAnswers: [0, 1, 3],
    explanation: "Laspeyres uses base-period quantity weights (Q0), Paasche uses current-period weights (Q1), and Fisher's Ideal Index = √(Laspeyres × Paasche).",
    points: 15
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
  getCourses() {
    return assessmentCourses;
  }

  getAllQuestions() {
    return mockQuestionBank;
  }

  getQuestionsByCourse(courseId) {
    if (!courseId || courseId === 'COURSE_ALL') {
      return mockQuestionBank;
    }
    return mockQuestionBank.filter(q => q.courseId === courseId);
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
  submitAssessment({ userId = 'USR001', answers = {}, courseId = 'COURSE_ALL' }) {
    const questionsToScore = this.getQuestionsByCourse(courseId);
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

    for (const q of questionsToScore) {
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

    const courseInfo = assessmentCourses.find(c => c.id === courseId) || assessmentCourses[0];
    // 7. Save attempt in Assessment History & Records
    const historyItem = {
      id: `HIST-${Date.now()}`,
      assessmentTitle: courseInfo.title,
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
