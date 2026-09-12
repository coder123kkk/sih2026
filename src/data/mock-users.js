/**
 * Mock User Profiles for Demo Mode
 * 
 * These represent realistic Indian Statistical Service officers
 * with competency profiles, skill levels, and learning history.
 */

export const mockUsers = [
  {
    id: "USR001",
    name: "Dr. Priya Sharma",
    email: "priya.sharma@mospi.gov.in",
    password: "demo123",
    avatar: null,
    designation: "Deputy Director",
    department: "Labour Statistics Division",
    ministry: "Ministry of Statistics & Programme Implementation",
    organization: "National Statistical Office",
    grade: "Group A",
    cadre: "Indian Statistical Service",
    location: "New Delhi",
    yearsOfService: 8,
    dateOfJoining: "2018-07-15",
    jobRole: "Survey Data Compilation & Statistical Analysis",
    currentAssignment: "Periodic Labour Force Survey (PLFS) & CPI Compilation",
    qualification: "Ph.D. in Agricultural Statistics, M.Stat",
    skills: ["Sample Survey Design", "Python", "Pandas", "Macroeconomic Aggregates", "Data Quality Framework"],
    parichayId: null,
    igotLearnerId: null,
    competencyProfile: {
      // STATISTICAL (10)
      "COMP_SURVEY_DESIGN": { currentLevel: 4, requiredLevel: 4, currentScore: 85, requiredScore: 85, gap: 0, gapStatus: "Low" },
      "COMP_SAMPLING": { currentLevel: 4, requiredLevel: 4, currentScore: 82, requiredScore: 85, gap: 3, gapStatus: "Low" },
      "COMP_NATIONAL_ACCOUNTS": { currentLevel: 2, requiredLevel: 4, currentScore: 45, requiredScore: 80, gap: 35, gapStatus: "High" },
      "COMP_PRICE_STATS": { currentLevel: 3, requiredLevel: 3, currentScore: 70, requiredScore: 75, gap: 5, gapStatus: "Low" },
      "COMP_LABOUR_STATS": { currentLevel: 4, requiredLevel: 5, currentScore: 88, requiredScore: 95, gap: 7, gapStatus: "Low" },
      "COMP_AGRI_STATS": { currentLevel: 5, requiredLevel: 4, currentScore: 92, requiredScore: 80, gap: 0, gapStatus: "Low" },
      "COMP_INDUSTRIAL_STATS": { currentLevel: 3, requiredLevel: 4, currentScore: 62, requiredScore: 80, gap: 18, gapStatus: "Medium" },
      "COMP_SDG": { currentLevel: 3, requiredLevel: 3, currentScore: 72, requiredScore: 75, gap: 3, gapStatus: "Low" },
      "COMP_METADATA": { currentLevel: 2, requiredLevel: 4, currentScore: 55, requiredScore: 80, gap: 25, gapStatus: "Medium" },
      "COMP_DATA_QUALITY": { currentLevel: 3, requiredLevel: 4, currentScore: 68, requiredScore: 85, gap: 17, gapStatus: "Medium" },

      // TECHNICAL (12)
      "COMP_PYTHON": { currentLevel: 2, requiredLevel: 4, currentScore: 52, requiredScore: 80, gap: 28, gapStatus: "High" },
      "COMP_R": { currentLevel: 3, requiredLevel: 3, currentScore: 74, requiredScore: 75, gap: 1, gapStatus: "Low" },
      "COMP_SQL": { currentLevel: 3, requiredLevel: 4, currentScore: 65, requiredScore: 80, gap: 15, gapStatus: "Medium" },
      "COMP_STATA": { currentLevel: 3, requiredLevel: 3, currentScore: 70, requiredScore: 75, gap: 5, gapStatus: "Low" },
      "COMP_SPSS": { currentLevel: 2, requiredLevel: 3, currentScore: 60, requiredScore: 75, gap: 15, gapStatus: "Medium" },
      "COMP_SAS": { currentLevel: 1, requiredLevel: 3, currentScore: 35, requiredScore: 75, gap: 40, gapStatus: "Critical" },
      "COMP_GIS": { currentLevel: 1, requiredLevel: 3, currentScore: 38, requiredScore: 75, gap: 37, gapStatus: "Critical" },
      "COMP_VIZ": { currentLevel: 3, requiredLevel: 4, currentScore: 65, requiredScore: 85, gap: 20, gapStatus: "Medium" },
      "COMP_AI_ML": { currentLevel: 1, requiredLevel: 3, currentScore: 30, requiredScore: 75, gap: 45, gapStatus: "Critical" },
      "COMP_CLOUD": { currentLevel: 1, requiredLevel: 2, currentScore: 40, requiredScore: 65, gap: 25, gapStatus: "Medium" },
      "COMP_APIS": { currentLevel: 2, requiredLevel: 3, currentScore: 48, requiredScore: 75, gap: 27, gapStatus: "High" },
      "COMP_OPEN_DATA": { currentLevel: 3, requiredLevel: 4, currentScore: 70, requiredScore: 80, gap: 10, gapStatus: "Low" },

      // DIGITAL GOVERNANCE (5)
      "COMP_CYBERSECURITY": { currentLevel: 2, requiredLevel: 3, currentScore: 50, requiredScore: 75, gap: 25, gapStatus: "Medium" },
      "COMP_DATA_PRIVACY": { currentLevel: 2, requiredLevel: 3, currentScore: 55, requiredScore: 75, gap: 20, gapStatus: "Medium" },
      "COMP_DIGITAL_SIGNATURE": { currentLevel: 4, requiredLevel: 4, currentScore: 80, requiredScore: 80, gap: 0, gapStatus: "Low" },
      "COMP_GOV_CLOUD": { currentLevel: 2, requiredLevel: 3, currentScore: 45, requiredScore: 70, gap: 25, gapStatus: "Medium" },
      "COMP_DPI": { currentLevel: 3, requiredLevel: 4, currentScore: 60, requiredScore: 80, gap: 20, gapStatus: "Medium" },

      // BEHAVIOURAL & MANAGERIAL (6)
      "COMP_LEADERSHIP": { currentLevel: 3, requiredLevel: 4, currentScore: 70, requiredScore: 85, gap: 15, gapStatus: "Medium" },
      "COMP_COMMUNICATION": { currentLevel: 3, requiredLevel: 4, currentScore: 75, requiredScore: 85, gap: 10, gapStatus: "Low" },
      "COMP_PROJECT_MGMT": { currentLevel: 3, requiredLevel: 3, currentScore: 72, requiredScore: 75, gap: 3, gapStatus: "Low" },
      "COMP_ETHICS": { currentLevel: 4, requiredLevel: 4, currentScore: 92, requiredScore: 90, gap: 0, gapStatus: "Low" },
      "COMP_DECISION_MAKING": { currentLevel: 3, requiredLevel: 4, currentScore: 68, requiredScore: 85, gap: 17, gapStatus: "Medium" },
      "COMP_CHANGE_MGMT": { currentLevel: 2, requiredLevel: 3, currentScore: 55, requiredScore: 75, gap: 20, gapStatus: "Medium" }
    },
    learningStats: {
      coursesCompleted: 12,
      coursesInProgress: 3,
      totalLearningHours: 48,
      assessmentsPassed: 9,
      certificatesEarned: 7
    },
    createdAt: "2024-01-15"
  },
  {
    id: "USR002",
    name: "Rajesh Kumar Verma",
    email: "rajesh.verma@mospi.gov.in",
    password: "demo123",
    avatar: null,
    designation: "Statistical Officer",
    department: "Price Statistics Division",
    ministry: "Ministry of Statistics & Programme Implementation",
    organization: "National Statistical Office",
    grade: "Group A",
    cadre: "Indian Statistical Service",
    location: "New Delhi",
    yearsOfService: 4,
    dateOfJoining: "2022-08-01",
    parichayId: null,
    igotLearnerId: null,
    competencyProfile: {
      "COMP_SURVEY_DESIGN": { currentLevel: 2, requiredLevel: 3 },
      "COMP_SAMPLING": { currentLevel: 2, requiredLevel: 3 },
      "COMP_PRICE_STATS": { currentLevel: 3, requiredLevel: 4 },
      "COMP_NATIONAL_ACCOUNTS": { currentLevel: 1, requiredLevel: 2 },
      "COMP_DATA_QUALITY": { currentLevel: 2, requiredLevel: 3 },
      "COMP_PYTHON": { currentLevel: 1, requiredLevel: 3 },
      "COMP_R": { currentLevel: 1, requiredLevel: 2 },
      "COMP_SQL": { currentLevel: 2, requiredLevel: 3 },
      "COMP_GIS": { currentLevel: 1, requiredLevel: 2 },
      "COMP_VIZ": { currentLevel: 2, requiredLevel: 3 },
      "COMP_AI_ML": { currentLevel: 1, requiredLevel: 2 },
      "COMP_DATA_ANALYSIS": { currentLevel: 2, requiredLevel: 3 },
      "COMP_CYBERSECURITY": { currentLevel: 1, requiredLevel: 2 },
      "COMP_COMMUNICATION": { currentLevel: 2, requiredLevel: 3 },
      "COMP_ETHICS": { currentLevel: 3, requiredLevel: 3 }
    },
    learningStats: {
      coursesCompleted: 5,
      coursesInProgress: 2,
      totalLearningHours: 22,
      assessmentsPassed: 4,
      certificatesEarned: 3
    },
    createdAt: "2024-06-10"
  }
];

/** Get user by email (for demo login) */
export function getUserByEmail(email) {
  return mockUsers.find(u => u.email === email) || null;
}

/** Get user by ID */
export function getUserById(id) {
  return mockUsers.find(u => u.id === id) || null;
}

/** Update user by ID */
export function updateUser(id, updates) {
  const user = mockUsers.find(u => u.id === id);
  if (!user) return null;
  Object.assign(user, updates);
  return user;
}
