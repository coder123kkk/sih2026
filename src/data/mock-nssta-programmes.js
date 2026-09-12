/**
 * Mock NSSTA / TPAC Training Programmes
 * 
 * National Statistical Systems Training Academy (NSSTA)
 * and Training Programme Advisory Committee (TPAC) programmes.
 */

export const mockNSSTAProgrammes = [
  {
    id: "NSSTA001",
    title: "National Accounts Statistics — Methodology & Practice",
    description: "Comprehensive training on national income accounting, GDP estimation using production, income, and expenditure approaches. Covers SNA 2008 framework, IO tables, and India's national accounts practice.",
    source: "nssta",
    institution: "NSSTA, Greater Noida",
    duration: "5 days",
    durationDays: 5,
    mode: "classroom",
    startDate: "2026-11-15",
    endDate: "2026-11-19",
    targetGroup: "Deputy Directors, Statistical Officers (Group A & B)",
    competencies: [
      { competencyId: "COMP_NATIONAL_ACCOUNTS", name: "National Accounts", weight: "high" },
      { competencyId: "COMP_DATA_QUALITY", name: "Data Quality", weight: "medium" },
      { competencyId: "COMP_DATA_ANALYSIS", name: "Data Analysis", weight: "medium" }
    ],
    eligibility: "Officers with 2+ years in statistical divisions",
    seats: 30,
    seatsAvailable: 12,
    status: "upcoming",
    coordinator: "Dr. A.K. Gupta",
    venue: "NSSTA Campus, Greater Noida, Uttar Pradesh"
  },
  {
    id: "NSSTA002",
    title: "Advanced Sampling Techniques for Large-Scale Surveys",
    description: "In-depth training on multi-stage sampling, stratification, cluster sampling, PPS sampling, and estimation techniques used in NSS rounds, PLFS, and other national surveys.",
    source: "nssta",
    institution: "NSSTA, Greater Noida",
    duration: "4 days",
    durationDays: 4,
    mode: "classroom",
    startDate: "2026-12-02",
    endDate: "2026-12-05",
    targetGroup: "Statistical Officers, Research Officers",
    competencies: [
      { competencyId: "COMP_SAMPLING", name: "Sampling", weight: "high" },
      { competencyId: "COMP_SURVEY_DESIGN", name: "Survey Design", weight: "high" },
      { competencyId: "COMP_DATA_QUALITY", name: "Data Quality", weight: "medium" }
    ],
    eligibility: "Officers working with survey data",
    seats: 25,
    seatsAvailable: 8,
    status: "upcoming",
    coordinator: "Prof. S. Mukherjee",
    venue: "NSSTA Campus, Greater Noida, Uttar Pradesh"
  },
  {
    id: "NSSTA003",
    title: "Python and R for Statistical Computing",
    description: "Hands-on training in Python and R for official statisticians. Covers data manipulation, statistical tests, regression, time series analysis, and automated report generation using government datasets.",
    source: "nssta",
    institution: "NSSTA, Greater Noida",
    duration: "5 days",
    durationDays: 5,
    mode: "hybrid",
    startDate: "2027-01-13",
    endDate: "2027-01-17",
    targetGroup: "All statistical officers and technical staff",
    competencies: [
      { competencyId: "COMP_PYTHON", name: "Python", weight: "high" },
      { competencyId: "COMP_R", name: "R", weight: "high" },
      { competencyId: "COMP_DATA_ANALYSIS", name: "Data Analysis", weight: "medium" }
    ],
    eligibility: "Basic computer proficiency required",
    seats: 40,
    seatsAvailable: 22,
    status: "upcoming",
    coordinator: "Dr. M. Patel",
    venue: "NSSTA Campus + Online (Hybrid)"
  },
  {
    id: "NSSTA004",
    title: "Labour Force Survey Methodology (PLFS)",
    description: "Specialized training on Periodic Labour Force Survey design, data collection (CAPI), estimation, weighting, and analysis of employment/unemployment indicators per ILO standards.",
    source: "nssta",
    institution: "NSSTA, Greater Noida",
    duration: "3 days",
    durationDays: 3,
    mode: "classroom",
    startDate: "2026-10-21",
    endDate: "2026-10-23",
    targetGroup: "Officers in Labour Statistics Division",
    competencies: [
      { competencyId: "COMP_LABOUR_STATS", name: "Labour Statistics", weight: "high" },
      { competencyId: "COMP_SURVEY_DESIGN", name: "Survey Design", weight: "high" },
      { competencyId: "COMP_SAMPLING", name: "Sampling", weight: "medium" }
    ],
    eligibility: "Officers involved in PLFS operations",
    seats: 30,
    seatsAvailable: 15,
    status: "upcoming",
    coordinator: "Dr. R. Singh",
    venue: "NSSTA Campus, Greater Noida, Uttar Pradesh"
  },
  {
    id: "NSSTA005",
    title: "GIS and Geospatial Analysis for Statistical Mapping",
    description: "Training on QGIS for creating statistical maps, spatial data integration, thematic mapping of survey results, and building geospatial dashboards for government reporting.",
    source: "nssta",
    institution: "NSSTA, Greater Noida",
    duration: "4 days",
    durationDays: 4,
    mode: "classroom",
    startDate: "2027-02-10",
    endDate: "2027-02-13",
    targetGroup: "Statistical and technical officers",
    competencies: [
      { competencyId: "COMP_GIS", name: "GIS", weight: "high" },
      { competencyId: "COMP_VIZ", name: "Data Visualization", weight: "medium" },
      { competencyId: "COMP_DATA_ANALYSIS", name: "Data Analysis", weight: "low" }
    ],
    eligibility: "Officers with basic data handling skills",
    seats: 25,
    seatsAvailable: 20,
    status: "upcoming",
    coordinator: "Dr. K. Nair",
    venue: "NSSTA Campus, Greater Noida, Uttar Pradesh"
  },
  {
    id: "NSSTA006",
    title: "AI and Machine Learning for Government Statistics",
    description: "Introduction to AI/ML concepts and their applications in official statistics — imputation, anomaly detection, NLP for survey coding, image classification, and predictive analytics.",
    source: "nssta",
    institution: "NSSTA, Greater Noida",
    duration: "5 days",
    durationDays: 5,
    mode: "hybrid",
    startDate: "2027-03-03",
    endDate: "2027-03-07",
    targetGroup: "Officers with programming background",
    competencies: [
      { competencyId: "COMP_AI_ML", name: "AI/ML", weight: "high" },
      { competencyId: "COMP_PYTHON", name: "Python", weight: "medium" },
      { competencyId: "COMP_DATA_ANALYSIS", name: "Data Analysis", weight: "medium" }
    ],
    eligibility: "Basic Python or R knowledge required",
    seats: 30,
    seatsAvailable: 25,
    status: "upcoming",
    coordinator: "Prof. B. Iyer",
    venue: "NSSTA Campus + Online (Hybrid)"
  },
  {
    id: "NSSTA007",
    title: "SDG Monitoring and Indicator Reporting Workshop",
    description: "Workshop on SDG indicator methodology, data requirements, dashboard creation, and India's Voluntary National Review process. Includes hands-on exercises with SDG India Index.",
    source: "nssta",
    institution: "NSSTA, Greater Noida",
    duration: "3 days",
    durationDays: 3,
    mode: "online",
    startDate: "2026-11-04",
    endDate: "2026-11-06",
    targetGroup: "Officers involved in SDG monitoring",
    competencies: [
      { competencyId: "COMP_SDG", name: "SDG Indicators", weight: "high" },
      { competencyId: "COMP_DATA_QUALITY", name: "Data Quality", weight: "medium" },
      { competencyId: "COMP_VIZ", name: "Data Visualization", weight: "medium" }
    ],
    eligibility: "Open to all statistical officers",
    seats: 50,
    seatsAvailable: 35,
    status: "upcoming",
    coordinator: "Dr. N. Chandra",
    venue: "Online (Microsoft Teams)"
  }
];

/** Get all programmes */
export function getAllProgrammes() {
  return mockNSSTAProgrammes;
}

/** Get programme by ID */
export function getProgrammeById(id) {
  return mockNSSTAProgrammes.find(p => p.id === id) || null;
}
