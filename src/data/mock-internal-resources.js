/**
 * Mock Internal Learning Resources for MoSPI / Official Statistical System
 * 
 * Includes technical guidelines, SOP manuals, working papers, and internal toolkits.
 */

export const mockInternalResources = [
  {
    id: "INT-RES-001",
    title: "MoSPI Python & Pandas Data Processing Handbook",
    type: "manual",
    format: "PDF (142 pages)",
    competencyId: "COMP_PYTHON",
    competencies: ["COMP_PYTHON", "COMP_DATA_ANALYSIS"],
    department: "Data Informatics & Innovation Division (DIID)",
    author: "MoSPI Technical Working Group",
    description: "Standard operating procedures for cleaning, tabulating, and automating NSS microdata processing with Python and pandas.",
    accessUrl: "#",
    targetRoles: ["Statistical Officer", "Data Analyst", "Senior Statistician"]
  },
  {
    id: "INT-RES-002",
    title: "National Accounts Compilation Manual (SNA 2008 & 2011-12 Series)",
    type: "guideline",
    format: "PDF (320 pages)",
    competencyId: "COMP_NATIONAL_ACCOUNTS",
    competencies: ["COMP_NATIONAL_ACCOUNTS", "COMP_DATA_QUALITY"],
    department: "National Accounts Division (NAD)",
    author: "Advisory Committee on National Accounts",
    description: "Official methodological guidelines for Gross Value Added (GVA), Supply and Use Tables (SUT), and corporate sector blowing-up factors.",
    accessUrl: "#",
    targetRoles: ["Deputy Director", "Statistical Officer", "Director"]
  },
  {
    id: "INT-RES-003",
    title: "NSS Large-Scale Sample Survey Design & Weighting Protocol",
    type: "sop",
    format: "Technical Note",
    competencyId: "COMP_SURVEY_DESIGN",
    competencies: ["COMP_SURVEY_DESIGN", "COMP_SAMPLING"],
    department: "Survey Design & Research Division (SDRD)",
    author: "Dr. K. S. Murthy (NSSTA Visiting Faculty)",
    description: "Multi-stage stratified sampling design rules, multiplier calculation formulas, and non-response adjustment methods for PLFS and household surveys.",
    accessUrl: "#",
    targetRoles: ["Statistical Officer", "Field Director", "Assistant Director"]
  },
  {
    id: "INT-RES-004",
    title: "Machine Learning & AI in Official Statistics: Feasibility Study",
    type: "working-paper",
    format: "Working Paper No. 18",
    competencyId: "COMP_AI_ML",
    competencies: ["COMP_AI_ML", "COMP_CLOUD"],
    department: "Data Informatics & Innovation Division (DIID)",
    author: "MoSPI Emerging Tech Cell",
    description: "Evaluating natural language processing for industrial classification (NIC/NCO) and computer vision for agricultural crop acreage estimates.",
    accessUrl: "#",
    targetRoles: ["Statistical Officer", "Deputy Director", "Data Scientist"]
  },
  {
    id: "INT-RES-005",
    title: "QGIS & Geospatial Analysis for Census & Survey Mapping",
    type: "toolkit",
    format: "Interactive Lab Workbook",
    competencyId: "COMP_GIS",
    competencies: ["COMP_GIS", "COMP_VIZ"],
    department: "National Statistical Systems Training Academy (NSSTA)",
    author: "Geospatial Division, NSSTA",
    description: "Step-by-step tutorial on thematic boundary mapping, geotagging survey enumeration blocks, and district-level spatial statistics.",
    accessUrl: "#",
    targetRoles: ["Statistical Officer", "Investigator", "Deputy Director"]
  },
  {
    id: "INT-RES-006",
    title: "National Data Quality Framework for Official Statistics (NDQF)",
    type: "policy",
    format: "Government Gazette Publication",
    competencyId: "COMP_DATA_QUALITY",
    competencies: ["COMP_DATA_QUALITY", "COMP_METADATA"],
    department: "Social Statistics Division (SSD)",
    author: "National Statistical Commission (NSC)",
    description: "Official standards on data accuracy, relevance, timeliness, accessibility, and metadata preservation per international fundamental principles.",
    accessUrl: "#",
    targetRoles: ["All Statistical Officers", "Cadre Administrators"]
  },
  {
    id: "INT-RES-007",
    title: "Periodic Labour Force Survey (PLFS) Tabulation & Activity Status Manual",
    type: "manual",
    format: "Technical Guidance Note (96 pages)",
    competencyId: "COMP_LABOUR_STATISTICS",
    competencies: ["COMP_LABOUR_STATISTICS", "COMP_SURVEY_DESIGN", "COMP_SAMPLING"],
    department: "Labour Statistics Division (LSD)",
    author: "Technical Advisory Committee on Labour Statistics",
    description: "Methodological guide for classifying Usual Status (ps+ss), Current Weekly Status (CWS), Worker Population Ratio (WPR), and Labour Force Participation Rate (LFPR).",
    accessUrl: "#",
    targetRoles: ["Deputy Director", "Statistical Officer", "Senior Statistician"]
  },
  {
    id: "INT-RES-008",
    title: "Consumer Price Index (CPI) Item Basket & Price Collection SOP",
    type: "sop",
    format: "SOP Manual (84 pages)",
    competencyId: "COMP_PRICE_STATISTICS",
    competencies: ["COMP_PRICE_STATISTICS", "COMP_SAMPLING"],
    department: "Price Statistics Division (PSD)",
    author: "Standing Committee on Economic Statistics",
    description: "Guidelines on web-portal quotation entry, outlier truncation, geometric mean formula aggregation, and imputed rent calculation for urban CPI baskets.",
    accessUrl: "#",
    targetRoles: ["Statistical Officer", "Field Investigator", "Deputy Director"]
  },
  {
    id: "INT-RES-009",
    title: "R for Official Survey Weighting & Complex Variance Estimation",
    type: "toolkit",
    format: "R Code Repository & Vignette",
    competencyId: "COMP_R",
    competencies: ["COMP_R", "COMP_SAMPLING", "COMP_DATA_ANALYSIS"],
    department: "National Statistical Systems Training Academy (NSSTA)",
    author: "NSSTA Faculty of Computational Statistics",
    description: "Using the 'survey' and 'srvyr' R packages for jackknife, balanced repeated replication (BRR), and linear regression with complex NSS multistage weights.",
    accessUrl: "#",
    targetRoles: ["Statistical Officer", "Data Analyst", "Senior Statistician"]
  },
  {
    id: "INT-RES-010",
    title: "MoSPI Data Warehouse & SQL Query Optimization Standard",
    type: "guideline",
    format: "Engineering Guideline (68 pages)",
    competencyId: "COMP_SQL",
    competencies: ["COMP_SQL", "COMP_DATA_ANALYSIS"],
    department: "Computer Centre / DIID",
    author: "Database Administration Cell",
    description: "Best practices for writing performant SQL queries against large microdata tables (100M+ rows), partitioning survey years, and database security roles.",
    accessUrl: "#",
    targetRoles: ["Technical Officer", "Database Administrator", "Data Analyst"]
  },
  {
    id: "INT-RES-011",
    title: "Government Cyber Security Guidelines & Information Security Protocol",
    type: "policy",
    format: "MoSPI Security Directive 2026",
    competencyId: "COMP_CYBERSECURITY",
    competencies: ["COMP_CYBERSECURITY", "COMP_DATA_PRIVACY", "COMP_DIGITAL_GOV"],
    department: "Computer Centre / CERT-In Liaison",
    author: "Chief Information Security Officer (CISO)",
    description: "Standard security controls for survey portal login, password rotation, VPN access, multi-factor authentication, and safe transmission of non-anonymized field microdata.",
    accessUrl: "#",
    targetRoles: ["All Officers", "System Administrators", "Field Officers"]
  },
  {
    id: "INT-RES-012",
    title: "Leadership & Statistical Project Management in Public Administration",
    type: "guideline",
    format: "Executive Handbook (112 pages)",
    competencyId: "COMP_LEADERSHIP",
    competencies: ["COMP_LEADERSHIP", "COMP_PROJECT_MGMT", "COMP_COMMUNICATION"],
    department: "Ministry Administration & Human Resource Division",
    author: "Capacity Building Commission (CBC)",
    description: "Frameworks for heading nationwide census and survey divisions, managing multidisciplinary officer teams, inter-ministerial coordination, and parliamentary question responses.",
    accessUrl: "#",
    targetRoles: ["Deputy Director", "Joint Director", "Director", "Senior Statistical Officer"]
  }
];

export function getInternalResourcesByCompetency(competencyId) {
  return mockInternalResources.filter(r =>
    r.competencyId === competencyId || r.competencies.includes(competencyId)
  );
}
