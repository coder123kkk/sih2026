/**
 * Mock iGOT Karmayogi Course Catalogue
 * 
 * These represent realistic iGOT course structures.
 * In production, this data would come from official iGOT APIs.
 * 
 * IMPORTANT: These are MOCK entries for development/demo purposes.
 * No real iGOT API data is used here.
 */

export const mockIGOTCourses = [
  {
    id: "igot-crs-001",
    externalId: "do_31390001",
    title: "Python for Data Analysis in Government",
    description: "Learn Python programming for data analysis, statistical computing, and automation in government statistical workflows. Covers pandas, NumPy, matplotlib, and real-world government data use cases including survey data processing and report generation.",
    provider: "Capacity Building Commission",
    duration: "2h 30m",
    durationMinutes: 150,
    difficulty: "Intermediate",
    level: "Intermediate",
    category: "Data Science",
    skills: ["Python","Data Analysis","Data Visualization"],
    courseType: "online",
    imageUrl: "/assets/courses/python-data.jpg",
    tags: ["python", "data-analysis", "statistics", "automation", "pandas"],
    learningObjectives: [
      "Use Python for statistical data processing",
      "Analyze government datasets with pandas",
      "Create data visualizations for reports",
      "Automate repetitive data tasks"
    ],
    competencyMapping: [
      { competencyId: "COMP_PYTHON", name: "Python", weight: "high" },
      { competencyId: "COMP_DATA_ANALYSIS", name: "Data Analysis", weight: "high" },
      { competencyId: "COMP_VIZ", name: "Data Visualization", weight: "medium" }
    ],
    modules: [
      { title: "Introduction to Python", duration: "30m" },
      { title: "Working with Pandas", duration: "45m" },
      { title: "Data Visualization with Matplotlib", duration: "35m" },
      { title: "Government Data Case Studies", duration: "40m" }
    ],
    externalUrl: "https://igotkarmayogi.gov.in",
    language: "English",
    lastUpdated: "2026-03-15"
  },
  {
    id: "igot-crs-002",
    externalId: "do_31390002",
    title: "Data Driven Decision Making for Government",
    description: "Understand the principles and practices of data-driven decision making in government. Learn to use evidence, data analytics, and statistical insights to support policy formulation and programme implementation.",
    provider: "Capacity Building Commission",
    duration: "3h 00m",
    durationMinutes: 180,
    difficulty: "Beginner",
    level: "Beginner",
    category: "Digital Governance",
    skills: ["Data Analysis","Decision Making","Data Visualization"],
    courseType: "online",
    imageUrl: "/assets/courses/data-decision.jpg",
    tags: ["decision-making", "data", "governance", "policy", "evidence-based"],
    learningObjectives: [
      "Apply data-driven approaches to policy decisions",
      "Interpret statistical evidence for governance",
      "Use dashboards and reports for decision support",
      "Understand ethical considerations in data use"
    ],
    competencyMapping: [
      { competencyId: "COMP_DATA_ANALYSIS", name: "Data Analysis", weight: "high" },
      { competencyId: "COMP_DECISION_MAKING", name: "Decision Making", weight: "high" },
      { competencyId: "COMP_VIZ", name: "Data Visualization", weight: "low" }
    ],
    modules: [
      { title: "Foundations of Data-Driven Governance", duration: "45m" },
      { title: "Statistical Evidence for Policy", duration: "50m" },
      { title: "Dashboard Interpretation", duration: "40m" },
      { title: "Case Studies in Indian Governance", duration: "45m" }
    ],
    externalUrl: "https://igotkarmayogi.gov.in",
    language: "English",
    lastUpdated: "2026-04-10"
  },
  {
    id: "igot-crs-003",
    externalId: "do_31390003",
    title: "Introduction to Artificial Intelligence for Public Service",
    description: "An introductory course on AI concepts, machine learning basics, and their applications in government services. Covers responsible AI, NLP, computer vision, and practical examples from Indian government initiatives.",
    provider: "Ministry of Electronics & IT",
    duration: "4h 00m",
    durationMinutes: 240,
    difficulty: "Beginner",
    level: "Beginner",
    category: "AI/ML",
    skills: ["AI/ML","Data Analysis","Python"],
    courseType: "online",
    imageUrl: "/assets/courses/ai-intro.jpg",
    tags: ["ai", "machine-learning", "nlp", "government", "digital-india"],
    learningObjectives: [
      "Understand fundamental AI and ML concepts",
      "Identify AI applications in government",
      "Evaluate AI solutions for public service",
      "Understand responsible AI principles"
    ],
    competencyMapping: [
      { competencyId: "COMP_AI_ML", name: "AI/ML", weight: "high" },
      { competencyId: "COMP_DATA_ANALYSIS", name: "Data Analysis", weight: "medium" },
      { competencyId: "COMP_PYTHON", name: "Python", weight: "low" }
    ],
    modules: [
      { title: "What is AI?", duration: "45m" },
      { title: "Machine Learning Fundamentals", duration: "60m" },
      { title: "NLP and Computer Vision", duration: "50m" },
      { title: "AI in Government — Case Studies", duration: "65m" }
    ],
    externalUrl: "https://igotkarmayogi.gov.in",
    language: "English",
    lastUpdated: "2026-05-20"
  },
  {
    id: "igot-crs-004",
    externalId: "do_31390004",
    title: "GIS and Geospatial Analysis for Government",
    description: "Learn Geographic Information Systems and geospatial analysis techniques for government planning, resource allocation, and monitoring. Covers QGIS, spatial data handling, and thematic mapping for Indian administrative data.",
    provider: "National Informatics Centre",
    duration: "5h 00m",
    durationMinutes: 300,
    difficulty: "Intermediate",
    level: "Intermediate",
    category: "Data Science",
    skills: ["GIS","Data Visualization","Data Analysis"],
    courseType: "online",
    imageUrl: "/assets/courses/gis-govt.jpg",
    tags: ["gis", "geospatial", "mapping", "qgis", "spatial-data"],
    learningObjectives: [
      "Use QGIS for government data mapping",
      "Perform spatial analysis on administrative data",
      "Create thematic maps for reports",
      "Integrate geospatial data with statistical data"
    ],
    competencyMapping: [
      { competencyId: "COMP_GIS", name: "GIS", weight: "high" },
      { competencyId: "COMP_VIZ", name: "Data Visualization", weight: "medium" },
      { competencyId: "COMP_DATA_ANALYSIS", name: "Data Analysis", weight: "medium" }
    ],
    modules: [
      { title: "Introduction to GIS", duration: "60m" },
      { title: "Spatial Data in Government", duration: "75m" },
      { title: "Thematic Mapping", duration: "90m" },
      { title: "Geospatial Analysis Projects", duration: "75m" }
    ],
    externalUrl: "https://igotkarmayogi.gov.in",
    language: "English",
    lastUpdated: "2026-02-28"
  },
  {
    id: "igot-crs-005",
    externalId: "do_31390005",
    title: "SQL for Government Data Management",
    description: "Master SQL for querying, managing, and analyzing large government databases. Covers relational database design, complex queries, data aggregation, and best practices for handling sensitive government data.",
    provider: "Capacity Building Commission",
    duration: "3h 30m",
    durationMinutes: 210,
    difficulty: "Beginner",
    level: "Beginner",
    category: "Data Science",
    skills: ["SQL","Data Analysis"],
    courseType: "online",
    imageUrl: "/assets/courses/sql-govt.jpg",
    tags: ["sql", "database", "data-management", "queries", "government-data"],
    learningObjectives: [
      "Write SQL queries for government databases",
      "Design relational database schemas",
      "Perform data aggregation and reporting",
      "Apply data security best practices"
    ],
    competencyMapping: [
      { competencyId: "COMP_SQL", name: "SQL", weight: "high" },
      { competencyId: "COMP_DATA_ANALYSIS", name: "Data Analysis", weight: "medium" }
    ],
    modules: [
      { title: "SQL Fundamentals", duration: "50m" },
      { title: "Advanced Queries", duration: "60m" },
      { title: "Database Design", duration: "50m" },
      { title: "Government Data Case Studies", duration: "50m" }
    ],
    externalUrl: "https://igotkarmayogi.gov.in",
    language: "English",
    lastUpdated: "2026-01-12"
  },
  {
    id: "igot-crs-006",
    externalId: "do_31390006",
    title: "Cybersecurity Awareness for Government Officials",
    description: "Essential cybersecurity knowledge for government officials. Covers data protection, secure communication, phishing prevention, password management, and compliance with government IT security policies.",
    provider: "Ministry of Electronics & IT",
    duration: "2h 00m",
    durationMinutes: 120,
    difficulty: "Beginner",
    level: "Beginner",
    category: "Cybersecurity",
    skills: ["Cybersecurity","Data Privacy"],
    courseType: "online",
    imageUrl: "/assets/courses/cybersecurity.jpg",
    tags: ["cybersecurity", "data-protection", "security", "compliance", "government"],
    learningObjectives: [
      "Identify common cybersecurity threats",
      "Apply secure communication practices",
      "Follow government IT security policies",
      "Protect sensitive government data"
    ],
    competencyMapping: [
      { competencyId: "COMP_CYBERSECURITY", name: "Cybersecurity", weight: "high" },
      { competencyId: "COMP_DATA_PRIVACY", name: "Data Privacy", weight: "high" }
    ],
    modules: [
      { title: "Threat Landscape", duration: "30m" },
      { title: "Secure Communication", duration: "30m" },
      { title: "Data Protection Practices", duration: "30m" },
      { title: "Government IT Security Compliance", duration: "30m" }
    ],
    externalUrl: "https://igotkarmayogi.gov.in",
    language: "English",
    lastUpdated: "2026-06-01"
  },
  {
    id: "igot-crs-007",
    externalId: "do_31390007",
    title: "R Programming for Statistical Analysis",
    description: "Learn R programming for statistical computing, hypothesis testing, regression analysis, and survey data analysis. Tailored for government statisticians working with national-level surveys and censuses.",
    provider: "Indian Statistical Institute",
    duration: "4h 30m",
    durationMinutes: 270,
    difficulty: "Intermediate",
    level: "Intermediate",
    category: "Statistics",
    skills: ["R","Survey Design","Sampling","Data Analysis"],
    courseType: "online",
    imageUrl: "/assets/courses/r-stats.jpg",
    tags: ["r-programming", "statistics", "regression", "survey-analysis", "hypothesis-testing"],
    learningObjectives: [
      "Use R for statistical hypothesis testing",
      "Perform regression analysis on survey data",
      "Process and clean large government datasets",
      "Generate publication-quality statistical reports"
    ],
    competencyMapping: [
      { competencyId: "COMP_R", name: "R", weight: "high" },
      { competencyId: "COMP_SURVEY_DESIGN", name: "Survey Design", weight: "medium" },
      { competencyId: "COMP_SAMPLING", name: "Sampling", weight: "medium" },
      { competencyId: "COMP_DATA_ANALYSIS", name: "Data Analysis", weight: "high" }
    ],
    modules: [
      { title: "R Basics and Data Types", duration: "60m" },
      { title: "Statistical Tests in R", duration: "75m" },
      { title: "Survey Data Analysis", duration: "70m" },
      { title: "Report Generation with R Markdown", duration: "65m" }
    ],
    externalUrl: "https://igotkarmayogi.gov.in",
    language: "English",
    lastUpdated: "2026-04-22"
  },
  {
    id: "igot-crs-008",
    externalId: "do_31390008",
    title: "Survey Design and Methodology",
    description: "Comprehensive course on survey design, questionnaire development, pilot testing, and survey implementation for large-scale national statistical programmes. Covers both CAPI and paper-based approaches.",
    provider: "National Statistical Systems Training Academy",
    duration: "6h 00m",
    durationMinutes: 360,
    difficulty: "Advanced",
    level: "Advanced",
    category: "Statistics",
    skills: ["Survey Design","Sampling","Data Quality","Metadata"],
    courseType: "online",
    imageUrl: "/assets/courses/survey-design.jpg",
    tags: ["survey-design", "questionnaire", "methodology", "capi", "national-surveys"],
    learningObjectives: [
      "Design survey questionnaires for national programmes",
      "Plan and execute pilot surveys",
      "Implement CAPI-based data collection",
      "Apply quality control in survey operations"
    ],
    competencyMapping: [
      { competencyId: "COMP_SURVEY_DESIGN", name: "Survey Design", weight: "high" },
      { competencyId: "COMP_SAMPLING", name: "Sampling", weight: "high" },
      { competencyId: "COMP_DATA_QUALITY", name: "Data Quality", weight: "medium" },
      { competencyId: "COMP_METADATA", name: "Metadata", weight: "low" }
    ],
    modules: [
      { title: "Survey Design Principles", duration: "90m" },
      { title: "Questionnaire Development", duration: "80m" },
      { title: "Sampling Frame and Methodology", duration: "100m" },
      { title: "Quality Assurance in Surveys", duration: "90m" }
    ],
    externalUrl: "https://igotkarmayogi.gov.in",
    language: "English",
    lastUpdated: "2026-03-05"
  },
  {
    id: "igot-crs-009",
    externalId: "do_31390009",
    title: "Sampling Techniques for Official Statistics",
    description: "Master probability and non-probability sampling techniques used in India's official statistical system. Covers SRS, stratified, cluster, multi-stage sampling, and estimation techniques with practical Indian examples.",
    provider: "Indian Statistical Institute",
    duration: "5h 00m",
    durationMinutes: 300,
    difficulty: "Advanced",
    level: "Advanced",
    category: "Statistics",
    skills: ["Sampling","Survey Design","Data Quality"],
    courseType: "online",
    imageUrl: "/assets/courses/sampling.jpg",
    tags: ["sampling", "probability", "stratified", "cluster", "estimation"],
    learningObjectives: [
      "Apply probability sampling methods",
      "Design multi-stage sampling for national surveys",
      "Calculate sample sizes and estimation",
      "Handle non-response in large-scale surveys"
    ],
    competencyMapping: [
      { competencyId: "COMP_SAMPLING", name: "Sampling", weight: "high" },
      { competencyId: "COMP_SURVEY_DESIGN", name: "Survey Design", weight: "medium" },
      { competencyId: "COMP_DATA_QUALITY", name: "Data Quality", weight: "low" }
    ],
    modules: [
      { title: "Simple Random Sampling", duration: "60m" },
      { title: "Stratified and Cluster Sampling", duration: "80m" },
      { title: "Multi-Stage Sampling Design", duration: "90m" },
      { title: "Estimation and Variance", duration: "70m" }
    ],
    externalUrl: "https://igotkarmayogi.gov.in",
    language: "English",
    lastUpdated: "2026-05-15"
  },
  {
    id: "igot-crs-010",
    externalId: "do_31390010",
    title: "National Accounts Statistics",
    description: "Understand India's National Accounts framework including GDP estimation, Input-Output tables, SNA 2008 compliance, and the methodology behind national income accounting used by CSO/NSO.",
    provider: "National Statistical Systems Training Academy",
    duration: "4h 00m",
    durationMinutes: 240,
    difficulty: "Advanced",
    level: "Advanced",
    category: "Statistics",
    skills: ["National Accounts","Data Analysis","Data Quality"],
    courseType: "online",
    imageUrl: "/assets/courses/national-accounts.jpg",
    tags: ["national-accounts", "gdp", "sna", "national-income", "cso"],
    learningObjectives: [
      "Understand SNA 2008 framework",
      "Compute GDP estimates using different approaches",
      "Analyze Input-Output tables",
      "Interpret national income statistics"
    ],
    competencyMapping: [
      { competencyId: "COMP_NATIONAL_ACCOUNTS", name: "National Accounts", weight: "high" },
      { competencyId: "COMP_DATA_ANALYSIS", name: "Data Analysis", weight: "medium" },
      { competencyId: "COMP_DATA_QUALITY", name: "Data Quality", weight: "medium" }
    ],
    modules: [
      { title: "SNA 2008 Framework", duration: "60m" },
      { title: "GDP Estimation Methods", duration: "70m" },
      { title: "Input-Output Analysis", duration: "60m" },
      { title: "India's National Accounts Practice", duration: "50m" }
    ],
    externalUrl: "https://igotkarmayogi.gov.in",
    language: "English",
    lastUpdated: "2026-01-20"
  },
  {
    id: "igot-crs-011",
    externalId: "do_31390011",
    title: "Data Visualization and Storytelling",
    description: "Learn to create compelling data visualizations and narratives from government data. Covers chart selection, dashboard design, infographics, and presenting statistical findings to diverse audiences.",
    provider: "Capacity Building Commission",
    duration: "2h 45m",
    durationMinutes: 165,
    difficulty: "Beginner",
    level: "Beginner",
    category: "Data Science",
    skills: ["Data Visualization","Communication","Data Analysis"],
    courseType: "online",
    imageUrl: "/assets/courses/data-viz.jpg",
    tags: ["visualization", "dashboards", "infographics", "storytelling", "charts"],
    learningObjectives: [
      "Select appropriate chart types for data",
      "Design effective dashboards",
      "Create infographics from statistical data",
      "Present data stories to non-technical audiences"
    ],
    competencyMapping: [
      { competencyId: "COMP_VIZ", name: "Data Visualization", weight: "high" },
      { competencyId: "COMP_COMMUNICATION", name: "Communication", weight: "medium" },
      { competencyId: "COMP_DATA_ANALYSIS", name: "Data Analysis", weight: "low" }
    ],
    modules: [
      { title: "Principles of Data Visualization", duration: "40m" },
      { title: "Chart Types and Selection", duration: "45m" },
      { title: "Dashboard Design", duration: "40m" },
      { title: "Data Storytelling", duration: "40m" }
    ],
    externalUrl: "https://igotkarmayogi.gov.in",
    language: "English",
    lastUpdated: "2026-06-10"
  },
  {
    id: "igot-crs-012",
    externalId: "do_31390012",
    title: "Leadership in Public Administration",
    description: "Develop leadership capabilities for senior government officials. Covers strategic thinking, team management, institutional leadership, change management, and ethical decision making in public service.",
    provider: "Lal Bahadur Shastri National Academy of Administration",
    duration: "3h 00m",
    durationMinutes: 180,
    difficulty: "Intermediate",
    level: "Intermediate",
    category: "Management",
    skills: ["Leadership","Decision Making","Change Management","Ethics"],
    courseType: "online",
    imageUrl: "/assets/courses/leadership.jpg",
    tags: ["leadership", "management", "public-administration", "strategic-thinking", "ethics"],
    learningObjectives: [
      "Apply strategic leadership in government",
      "Manage cross-functional teams effectively",
      "Drive institutional change",
      "Practice ethical decision making"
    ],
    competencyMapping: [
      { competencyId: "COMP_LEADERSHIP", name: "Leadership", weight: "high" },
      { competencyId: "COMP_DECISION_MAKING", name: "Decision Making", weight: "medium" },
      { competencyId: "COMP_CHANGE_MGMT", name: "Change Management", weight: "medium" },
      { competencyId: "COMP_ETHICS", name: "Ethics", weight: "medium" }
    ],
    modules: [
      { title: "Strategic Leadership", duration: "50m" },
      { title: "Team Management", duration: "45m" },
      { title: "Change Management", duration: "45m" },
      { title: "Ethics in Public Service", duration: "40m" }
    ],
    externalUrl: "https://igotkarmayogi.gov.in",
    language: "English",
    lastUpdated: "2026-02-18"
  },
  {
    id: "igot-crs-013",
    externalId: "do_31390013",
    title: "SDG Indicators — Monitoring and Reporting",
    description: "Learn to monitor and report on Sustainable Development Goal indicators using national statistical frameworks. Covers SDG indicator methodology, data collection, dashboards, and India's SDG reporting mechanisms.",
    provider: "NITI Aayog",
    duration: "3h 30m",
    durationMinutes: 210,
    difficulty: "Intermediate",
    level: "Intermediate",
    category: "Statistics",
    skills: ["SDG Indicators","Data Quality","Metadata","Data Visualization"],
    courseType: "online",
    imageUrl: "/assets/courses/sdg-indicators.jpg",
    tags: ["sdg", "sustainable-development", "indicators", "monitoring", "niti-aayog"],
    learningObjectives: [
      "Understand the SDG indicator framework",
      "Collect and validate SDG-related data",
      "Use dashboards for SDG monitoring",
      "Prepare SDG progress reports"
    ],
    competencyMapping: [
      { competencyId: "COMP_SDG", name: "SDG Indicators", weight: "high" },
      { competencyId: "COMP_DATA_QUALITY", name: "Data Quality", weight: "medium" },
      { competencyId: "COMP_METADATA", name: "Metadata", weight: "medium" },
      { competencyId: "COMP_VIZ", name: "Data Visualization", weight: "low" }
    ],
    modules: [
      { title: "SDG Framework Overview", duration: "50m" },
      { title: "Indicator Methodology", duration: "60m" },
      { title: "Data Collection for SDGs", duration: "50m" },
      { title: "India's SDG Dashboard", duration: "50m" }
    ],
    externalUrl: "https://igotkarmayogi.gov.in",
    language: "English",
    lastUpdated: "2026-07-01"
  },
  {
    id: "igot-crs-014",
    externalId: "do_31390014",
    title: "Cloud Computing for Government",
    description: "Introduction to cloud computing concepts and MeghRaj / GI Cloud for government deployments. Covers IaaS, PaaS, SaaS models, cloud security, and data residency requirements for government data.",
    provider: "National Informatics Centre",
    duration: "2h 30m",
    durationMinutes: 150,
    difficulty: "Beginner",
    level: "Beginner",
    category: "Digital Governance",
    skills: ["Cloud Computing","Cybersecurity","Government Cloud"],
    courseType: "online",
    imageUrl: "/assets/courses/cloud-govt.jpg",
    tags: ["cloud", "meghraj", "gi-cloud", "iaas", "government-cloud"],
    learningObjectives: [
      "Understand cloud computing service models",
      "Navigate MeghRaj / GI Cloud infrastructure",
      "Apply cloud security best practices",
      "Assess cloud readiness for government applications"
    ],
    competencyMapping: [
      { competencyId: "COMP_CLOUD", name: "Cloud Computing", weight: "high" },
      { competencyId: "COMP_CYBERSECURITY", name: "Cybersecurity", weight: "medium" },
      { competencyId: "COMP_GOV_CLOUD", name: "Government Cloud", weight: "high" }
    ],
    modules: [
      { title: "Cloud Computing Basics", duration: "35m" },
      { title: "MeghRaj / GI Cloud", duration: "40m" },
      { title: "Cloud Security for Government", duration: "40m" },
      { title: "Migration and Deployment", duration: "35m" }
    ],
    externalUrl: "https://igotkarmayogi.gov.in",
    language: "English",
    lastUpdated: "2026-05-05"
  },
  {
    id: "igot-crs-015",
    externalId: "do_31390015",
    title: "Project Management for Government Programmes",
    description: "Learn project management methodologies adapted for government programme implementation. Covers planning, budgeting, stakeholder management, risk mitigation, and monitoring & evaluation frameworks.",
    provider: "Capacity Building Commission",
    duration: "3h 00m",
    durationMinutes: 180,
    difficulty: "Intermediate",
    level: "Intermediate",
    category: "Management",
    skills: ["Project Management","Leadership","Communication"],
    courseType: "online",
    imageUrl: "/assets/courses/project-mgmt.jpg",
    tags: ["project-management", "planning", "monitoring", "evaluation", "government"],
    learningObjectives: [
      "Apply PM methodologies to government projects",
      "Plan budgets and timelines",
      "Manage stakeholders effectively",
      "Monitor and evaluate programme outcomes"
    ],
    competencyMapping: [
      { competencyId: "COMP_PROJECT_MGMT", name: "Project Management", weight: "high" },
      { competencyId: "COMP_LEADERSHIP", name: "Leadership", weight: "medium" },
      { competencyId: "COMP_COMMUNICATION", name: "Communication", weight: "medium" }
    ],
    modules: [
      { title: "Project Planning in Government", duration: "45m" },
      { title: "Budgeting and Resource Allocation", duration: "45m" },
      { title: "Stakeholder Management", duration: "45m" },
      { title: "Monitoring and Evaluation", duration: "45m" }
    ],
    externalUrl: "https://igotkarmayogi.gov.in",
    language: "English",
    lastUpdated: "2026-04-01"
  },
  {
    id: "igot-crs-016",
    externalId: "do_31390016",
    title: "Price Statistics and Index Numbers",
    description: "Understand the methodology of price statistics including CPI, WPI, and other price indices. Covers index number theory, weighting patterns, base year revision, and India's price statistics framework.",
    provider: "National Statistical Systems Training Academy",
    duration: "4h 00m",
    durationMinutes: 240,
    difficulty: "Advanced",
    level: "Advanced",
    category: "Statistics",
    skills: ["Price Statistics","Data Analysis","Data Quality"],
    courseType: "online",
    imageUrl: "/assets/courses/price-stats.jpg",
    tags: ["price-statistics", "cpi", "wpi", "index-numbers", "inflation"],
    learningObjectives: [
      "Understand CPI and WPI computation methodology",
      "Apply index number theory",
      "Analyze price trends and inflation",
      "Contribute to base year revision exercises"
    ],
    competencyMapping: [
      { competencyId: "COMP_PRICE_STATS", name: "Price Statistics", weight: "high" },
      { competencyId: "COMP_DATA_ANALYSIS", name: "Data Analysis", weight: "medium" },
      { competencyId: "COMP_DATA_QUALITY", name: "Data Quality", weight: "medium" }
    ],
    modules: [
      { title: "Index Number Theory", duration: "60m" },
      { title: "CPI Methodology", duration: "70m" },
      { title: "WPI and Other Indices", duration: "60m" },
      { title: "Practical Exercises", duration: "50m" }
    ],
    externalUrl: "https://igotkarmayogi.gov.in",
    language: "English",
    lastUpdated: "2026-03-25"
  },
  {
    id: "igot-crs-017",
    externalId: "do_31390017",
    title: "Labour Statistics and Employment Surveys",
    description: "Comprehensive coverage of labour statistics methodology, PLFS design, employment-unemployment estimation, informal sector measurement, and ILO standards for labour force statistics.",
    provider: "National Statistical Systems Training Academy",
    duration: "5h 30m",
    durationMinutes: 330,
    difficulty: "Advanced",
    level: "Advanced",
    category: "Statistics",
    skills: ["Labour Statistics","Survey Design","Sampling"],
    courseType: "online",
    imageUrl: "/assets/courses/labour-stats.jpg",
    tags: ["labour-statistics", "plfs", "employment", "ilo", "informal-sector"],
    learningObjectives: [
      "Understand PLFS methodology and design",
      "Estimate employment-unemployment indicators",
      "Apply ILO standards for labour statistics",
      "Measure informal sector employment"
    ],
    competencyMapping: [
      { competencyId: "COMP_LABOUR_STATS", name: "Labour Statistics", weight: "high" },
      { competencyId: "COMP_SURVEY_DESIGN", name: "Survey Design", weight: "high" },
      { competencyId: "COMP_SAMPLING", name: "Sampling", weight: "medium" }
    ],
    modules: [
      { title: "Labour Statistics Framework", duration: "70m" },
      { title: "PLFS Design and Methodology", duration: "80m" },
      { title: "Employment Estimation", duration: "90m" },
      { title: "Informal Sector Measurement", duration: "90m" }
    ],
    externalUrl: "https://igotkarmayogi.gov.in",
    language: "English",
    lastUpdated: "2026-06-20"
  }
];

/** All unique categories from the course catalogue */
export const mockIGOTCategories = [
  "Statistics",
  "Data Science",
  "AI/ML",
  "Digital Governance",
  "Cybersecurity",
  "Management"
];

export const mockIGOTSkills = [
  "Python",
  "R",
  "SQL",
  "GIS",
  "AI/ML",
  "Data Visualization",
  "Sampling",
  "Survey Design",
  "Data Analysis",
  "Cybersecurity",
  "National Accounts",
  "Leadership",
  "Project Management"
];

export const mockIGOTDurations = [
  { id: 'short', label: '< 2 Hours', value: '<2h' },
  { id: 'medium', label: '2 – 4 Hours', value: '2-4h' },
  { id: 'long', label: '4+ Hours', value: '4h+' }
];

/** All unique providers from the course catalogue */
export const mockIGOTProviders = [
  "Capacity Building Commission",
  "Ministry of Electronics & IT",
  "National Informatics Centre",
  "Indian Statistical Institute",
  "National Statistical Systems Training Academy",
  "Lal Bahadur Shastri National Academy of Administration",
  "NITI Aayog"
];

/** All unique difficulty levels */
export const mockIGOTDifficulties = [
  "Beginner",
  "Intermediate",
  "Advanced"
];
