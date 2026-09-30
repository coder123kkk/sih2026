/**
 * Mock iGOT Learner Data
 * 
 * Simulates learner-specific data that would come from iGOT APIs:
 * enrollments, progress, completions, certificates.
 */

export const mockLearnerData = {
  "USR001": {
    enrollments: [
      {
        courseId: "igot-crs-001",
        enrolledAt: "2026-06-01",
        progress: 65,
        status: "in-progress",
        lastAccessedAt: "2026-09-10",
        completedAt: null,
        certificateUrl: null,
        assessmentScore: null
      },
      {
        courseId: "igot-crs-002",
        enrolledAt: "2026-04-15",
        progress: 100,
        status: "completed",
        lastAccessedAt: "2026-05-20",
        completedAt: "2026-05-20",
        certificateUrl: "/certificates/data-driven-decision.pdf",
        assessmentScore: 88
      },
      {
        courseId: "igot-crs-005",
        enrolledAt: "2026-07-10",
        progress: 40,
        status: "in-progress",
        lastAccessedAt: "2026-09-08",
        completedAt: null,
        certificateUrl: null,
        assessmentScore: null
      },
      {
        courseId: "igot-crs-007",
        enrolledAt: "2026-03-01",
        progress: 100,
        status: "completed",
        lastAccessedAt: "2026-04-15",
        completedAt: "2026-04-15",
        certificateUrl: "/certificates/r-programming.pdf",
        assessmentScore: 92
      },
      {
        courseId: "igot-crs-003",
        enrolledAt: "2026-02-01",
        progress: 100,
        status: "completed",
        lastAccessedAt: "2026-03-20",
        completedAt: "2026-03-20",
        certificateUrl: "/certificates/ai-governance.pdf",
        assessmentScore: 95
      },
      {
        courseId: "igot-crs-011",
        enrolledAt: "2026-08-01",
        progress: 25,
        status: "in-progress",
        lastAccessedAt: "2026-09-05",
        completedAt: null,
        certificateUrl: null,
        assessmentScore: null
      },
      {
        courseId: "igot-crs-006",
        enrolledAt: "2026-05-01",
        progress: 100,
        status: "completed",
        lastAccessedAt: "2026-05-30",
        completedAt: "2026-05-30",
        certificateUrl: "/certificates/cybersecurity.pdf",
        assessmentScore: 78
      },
      {
        courseId: "igot-crs-012",
        enrolledAt: "2026-01-15",
        progress: 100,
        status: "completed",
        lastAccessedAt: "2026-02-28",
        completedAt: "2026-02-28",
        certificateUrl: "/certificates/leadership.pdf",
        assessmentScore: 85
      }
    ],
    learningHistory: [
      { date: "2026-09", hours: 6 },
      { date: "2026-08", hours: 8 },
      { date: "2026-07", hours: 5 },
      { date: "2026-06", hours: 10 },
      { date: "2026-05", hours: 7 },
      { date: "2026-04", hours: 4 },
      { date: "2026-03", hours: 8 }
    ]
  },
  "USR002": {
    enrollments: [
      {
        courseId: "igot-crs-001",
        enrolledAt: "2026-07-15",
        progress: 30,
        status: "in-progress",
        lastAccessedAt: "2026-09-09",
        completedAt: null,
        certificateUrl: null,
        assessmentScore: null
      },
      {
        courseId: "igot-crs-002",
        enrolledAt: "2026-06-01",
        progress: 100,
        status: "completed",
        lastAccessedAt: "2026-07-10",
        completedAt: "2026-07-10",
        certificateUrl: "/certificates/data-driven.pdf",
        assessmentScore: 82
      },
      {
        courseId: "igot-crs-016",
        enrolledAt: "2026-08-01",
        progress: 50,
        status: "in-progress",
        lastAccessedAt: "2026-09-11",
        completedAt: null,
        certificateUrl: null,
        assessmentScore: null
      }
    ],
    learningHistory: [
      { date: "2026-09", hours: 4 },
      { date: "2026-08", hours: 6 },
      { date: "2026-07", hours: 5 },
      { date: "2026-06", hours: 3 }
    ]
  },
  "USR003": {
    enrollments: [
      {
        courseId: "igot-crs-001",
        enrolledAt: "2026-05-01",
        progress: 100,
        status: "completed",
        lastAccessedAt: "2026-06-15",
        completedAt: "2026-06-15",
        certificateUrl: "/certificates/python-data.pdf",
        assessmentScore: 94
      },
      {
        courseId: "igot-crs-003",
        enrolledAt: "2026-06-01",
        progress: 100,
        status: "completed",
        lastAccessedAt: "2026-07-20",
        completedAt: "2026-07-20",
        certificateUrl: "/certificates/ai-gov.pdf",
        assessmentScore: 90
      },
      {
        courseId: "igot-crs-006",
        enrolledAt: "2026-07-01",
        progress: 100,
        status: "completed",
        lastAccessedAt: "2026-08-10",
        completedAt: "2026-08-10",
        certificateUrl: "/certificates/cybersecurity.pdf",
        assessmentScore: 88
      },
      {
        courseId: "igot-crs-005",
        enrolledAt: "2026-08-15",
        progress: 55,
        status: "in-progress",
        lastAccessedAt: "2026-09-08",
        completedAt: null,
        certificateUrl: null,
        assessmentScore: null
      },
      {
        courseId: "igot-crs-010",
        enrolledAt: "2026-09-01",
        progress: 30,
        status: "in-progress",
        lastAccessedAt: "2026-09-11",
        completedAt: null,
        certificateUrl: null,
        assessmentScore: null
      }
    ],
    learningHistory: [
      { date: "2026-09", hours: 6 },
      { date: "2026-08", hours: 10 },
      { date: "2026-07", hours: 8 },
      { date: "2026-06", hours: 8 }
    ]
  }
};

// Also index by Demo Learner IDs
mockLearnerData["IGOT-DEMO-001"] = mockLearnerData["USR001"];
mockLearnerData["IGOT-DEMO-002"] = mockLearnerData["USR002"];
mockLearnerData["IGOT-DEMO-003"] = mockLearnerData["USR003"];

/**
 * 2–3 Pre-configured Demo iGOT Learner Profiles
 * For demonstration and testing of mock iGOT learner synchronization.
 */
export const demoLearnerProfiles = [
  {
    learnerId: "IGOT-DEMO-001",
    name: "Dr. Priya Sharma (MoSPI Official Profile)",
    designation: "Deputy Director / Senior Statistician",
    department: "Labour Statistics Division (ISS Cadre)",
    enrolledCount: 8,
    completedCount: 5,
    learningHours: 48,
    certificatesCount: 5,
    assessmentsCount: 8,
    description: "Advanced civil services profile with completed certifications in Sample Survey Design, R Computing, Data-Driven Governance, Leadership, and Cybersecurity.",
    keySkills: ["Sample Surveys", "R Computing", "Governance", "Leadership"],
    enrollments: mockLearnerData["USR001"].enrollments,
    learningHistory: mockLearnerData["USR001"].learningHistory
  },
  {
    learnerId: "IGOT-DEMO-002",
    name: "Rajesh Kumar Verma (Field Cadre)",
    designation: "Statistical Officer / Field Survey Lead",
    department: "Survey Design & Research Division (SSS Cadre)",
    enrolledCount: 3,
    completedCount: 1,
    learningHours: 18,
    certificatesCount: 1,
    assessmentsCount: 3,
    description: "Field operations profile focusing on NSS survey methods and Data-Driven Decision Making with active Python coursework.",
    keySkills: ["Survey Methodology", "Data Decision", "Python (Basics)"],
    enrollments: mockLearnerData["USR002"].enrollments,
    learningHistory: mockLearnerData["USR002"].learningHistory
  },
  {
    learnerId: "IGOT-DEMO-003",
    name: "Ananya Sen (Data Informatics)",
    designation: "Assistant Director / Analytics Lead",
    department: "Data Informatics & Innovation Division (DIID)",
    enrolledCount: 5,
    completedCount: 3,
    learningHours: 32,
    certificatesCount: 3,
    assessmentsCount: 5,
    description: "Technical analytics profile with completions in Python Data Analysis, AI for Public Service, and Government Cybersecurity.",
    keySkills: ["Python & Pandas", "AI in Government", "Cybersecurity", "GIS"],
    enrollments: mockLearnerData["USR003"].enrollments,
    learningHistory: mockLearnerData["USR003"].learningHistory
  }
];

/** Get all available demo learner profiles */
export function getDemoLearnerProfiles() {
  return demoLearnerProfiles;
}

/** Get learner data by user ID or Demo Learner ID */
export function getLearnerData(identifier) {
  return mockLearnerData[identifier] || { enrollments: [], learningHistory: [] };
}

/** Get enrollment for a specific course */
export function getEnrollment(identifier, courseId) {
  const data = mockLearnerData[identifier];
  if (!data) return null;
  return data.enrollments.find(e => e.courseId === courseId) || null;
}
