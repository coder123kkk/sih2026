/**
 * Competency Framework for India's Official Statistical System
 * 
 * Four main categories:
 * 1. Statistical Competencies
 * 2. Technical Competencies
 * 3. Digital Governance
 * 4. Behavioural / Managerial
 */

export const competencyFramework = {
  categories: [
    {
      id: "statistical",
      name: "Statistical Competencies",
      icon: "bar-chart-2",
      color: "#3B82F6",
      description: "Core statistical knowledge and methodology for official statistics production",
      competencies: [
        {
          id: "COMP_SURVEY_DESIGN",
          name: "Survey Design",
          description: "Design and implementation of large-scale surveys and censuses",
          levels: [
            { level: 1, label: "Awareness", description: "Understands basic survey concepts" },
            { level: 2, label: "Basic", description: "Can contribute to survey design tasks" },
            { level: 3, label: "Intermediate", description: "Can independently design survey instruments" },
            { level: 4, label: "Advanced", description: "Can design complex multi-stage surveys" },
            { level: 5, label: "Expert", description: "Can lead national survey design and methodology" }
          ]
        },
        {
          id: "COMP_SAMPLING",
          name: "Sampling",
          description: "Probability and non-probability sampling techniques for official statistics",
          levels: [
            { level: 1, label: "Awareness", description: "Understands SRS concepts" },
            { level: 2, label: "Basic", description: "Can apply basic sampling techniques" },
            { level: 3, label: "Intermediate", description: "Can design stratified/cluster samples" },
            { level: 4, label: "Advanced", description: "Can design multi-stage national samples" },
            { level: 5, label: "Expert", description: "Can develop new sampling methodologies" }
          ]
        },
        {
          id: "COMP_NATIONAL_ACCOUNTS",
          name: "National Accounts",
          description: "National income accounting, GDP estimation, and SNA framework",
          levels: [
            { level: 1, label: "Awareness", description: "Understands GDP concepts" },
            { level: 2, label: "Basic", description: "Can compile basic national accounts data" },
            { level: 3, label: "Intermediate", description: "Can estimate sectoral GDP" },
            { level: 4, label: "Advanced", description: "Can handle SNA 2008 compilation" },
            { level: 5, label: "Expert", description: "Can lead national accounts revision exercises" }
          ]
        },
        {
          id: "COMP_PRICE_STATS",
          name: "Price Statistics",
          description: "CPI, WPI, and price index compilation methodology",
          levels: [
            { level: 1, label: "Awareness", description: "Understands CPI/WPI concepts" },
            { level: 2, label: "Basic", description: "Can assist in price data collection" },
            { level: 3, label: "Intermediate", description: "Can compute price indices" },
            { level: 4, label: "Advanced", description: "Can handle base year revision" },
            { level: 5, label: "Expert", description: "Can design national price statistics systems" }
          ]
        },
        {
          id: "COMP_LABOUR_STATS",
          name: "Labour Statistics",
          description: "Employment, labour force surveys, and ILO standards",
          levels: [
            { level: 1, label: "Awareness", description: "Understands employment indicators" },
            { level: 2, label: "Basic", description: "Can tabulate labour force data" },
            { level: 3, label: "Intermediate", description: "Can analyze PLFS data" },
            { level: 4, label: "Advanced", description: "Can design labour surveys" },
            { level: 5, label: "Expert", description: "Can develop labour statistics frameworks" }
          ]
        },
        {
          id: "COMP_AGRI_STATS",
          name: "Agricultural Statistics",
          description: "Crop estimation, agricultural census, and land use statistics",
          levels: [
            { level: 1, label: "Awareness", description: "Understands agricultural data sources" },
            { level: 2, label: "Basic", description: "Can process agricultural survey data" },
            { level: 3, label: "Intermediate", description: "Can analyze crop estimation data" },
            { level: 4, label: "Advanced", description: "Can design agricultural surveys" },
            { level: 5, label: "Expert", description: "Can lead agricultural census operations" }
          ]
        },
        {
          id: "COMP_INDUSTRIAL_STATS",
          name: "Industrial Statistics",
          description: "IIP, ASI, and industrial data systems",
          levels: [
            { level: 1, label: "Awareness", description: "Understands IIP concepts" },
            { level: 2, label: "Basic", description: "Can compile industrial data" },
            { level: 3, label: "Intermediate", description: "Can compute IIP" },
            { level: 4, label: "Advanced", description: "Can design industrial surveys" },
            { level: 5, label: "Expert", description: "Can modernize industrial statistics systems" }
          ]
        },
        {
          id: "COMP_SDG",
          name: "SDG Indicators",
          description: "Monitoring and reporting on Sustainable Development Goals",
          levels: [
            { level: 1, label: "Awareness", description: "Knows the SDG framework" },
            { level: 2, label: "Basic", description: "Can collect SDG-related data" },
            { level: 3, label: "Intermediate", description: "Can compute SDG indicators" },
            { level: 4, label: "Advanced", description: "Can design SDG monitoring systems" },
            { level: 5, label: "Expert", description: "Can lead national SDG reporting" }
          ]
        },
        {
          id: "COMP_METADATA",
          name: "Metadata Standards",
          description: "Statistical metadata standards, SDMX, and documentation",
          levels: [
            { level: 1, label: "Awareness", description: "Understands metadata importance" },
            { level: 2, label: "Basic", description: "Can document basic metadata" },
            { level: 3, label: "Intermediate", description: "Can apply SDMX standards" },
            { level: 4, label: "Advanced", description: "Can design metadata systems" },
            { level: 5, label: "Expert", description: "Can lead national metadata frameworks" }
          ]
        },
        {
          id: "COMP_DATA_QUALITY",
          name: "Data Quality",
          description: "Quality assurance and quality control in official statistics",
          levels: [
            { level: 1, label: "Awareness", description: "Understands data quality dimensions" },
            { level: 2, label: "Basic", description: "Can perform basic quality checks" },
            { level: 3, label: "Intermediate", description: "Can implement quality frameworks" },
            { level: 4, label: "Advanced", description: "Can design quality assurance systems" },
            { level: 5, label: "Expert", description: "Can lead national data quality initiatives" }
          ]
        }
      ]
    },
    {
      id: "technical",
      name: "Technical Competencies",
      icon: "code-2",
      color: "#8B5CF6",
      description: "Technical tools and technologies for modern statistical work",
      competencies: [
        {
          id: "COMP_PYTHON",
          name: "Python",
          description: "Python programming for data analysis, automation, and statistical computing",
          levels: [
            { level: 1, label: "Awareness", description: "Knows what Python is" },
            { level: 2, label: "Basic", description: "Can write simple scripts" },
            { level: 3, label: "Intermediate", description: "Can use pandas, numpy for analysis" },
            { level: 4, label: "Advanced", description: "Can build data pipelines and applications" },
            { level: 5, label: "Expert", description: "Can architect complex data systems in Python" }
          ]
        },
        {
          id: "COMP_R",
          name: "R",
          description: "R programming for statistical analysis and visualization",
          levels: [
            { level: 1, label: "Awareness", description: "Knows R exists as a statistical tool" },
            { level: 2, label: "Basic", description: "Can perform basic analysis in R" },
            { level: 3, label: "Intermediate", description: "Can use tidyverse for analysis" },
            { level: 4, label: "Advanced", description: "Can develop R packages" },
            { level: 5, label: "Expert", description: "Can build production statistical systems in R" }
          ]
        },
        {
          id: "COMP_SQL",
          name: "SQL",
          description: "Database querying and data management",
          levels: [
            { level: 1, label: "Awareness", description: "Understands database concepts" },
            { level: 2, label: "Basic", description: "Can write simple queries" },
            { level: 3, label: "Intermediate", description: "Can write complex joins and subqueries" },
            { level: 4, label: "Advanced", description: "Can design database schemas" },
            { level: 5, label: "Expert", description: "Can optimize large-scale government databases" }
          ]
        },
        {
          id: "COMP_STATA",
          name: "Stata",
          description: "Stata for statistical analysis and econometrics",
          levels: [
            { level: 1, label: "Awareness", description: "Knows Stata as a tool" },
            { level: 2, label: "Basic", description: "Can perform basic analysis" },
            { level: 3, label: "Intermediate", description: "Can run regression models" },
            { level: 4, label: "Advanced", description: "Can write do-files for automation" },
            { level: 5, label: "Expert", description: "Can develop custom Stata programs" }
          ]
        },
        {
          id: "COMP_GIS",
          name: "GIS",
          description: "Geographic Information Systems and geospatial analysis",
          levels: [
            { level: 1, label: "Awareness", description: "Understands GIS concepts" },
            { level: 2, label: "Basic", description: "Can view and navigate GIS data" },
            { level: 3, label: "Intermediate", description: "Can create thematic maps" },
            { level: 4, label: "Advanced", description: "Can perform spatial analysis" },
            { level: 5, label: "Expert", description: "Can build geospatial data infrastructure" }
          ]
        },
        {
          id: "COMP_VIZ",
          name: "Data Visualization",
          description: "Creating charts, dashboards, and visual data representations",
          levels: [
            { level: 1, label: "Awareness", description: "Knows chart types" },
            { level: 2, label: "Basic", description: "Can create basic charts" },
            { level: 3, label: "Intermediate", description: "Can design dashboards" },
            { level: 4, label: "Advanced", description: "Can create interactive visualizations" },
            { level: 5, label: "Expert", description: "Can build data visualization platforms" }
          ]
        },
        {
          id: "COMP_AI_ML",
          name: "AI/ML",
          description: "Artificial Intelligence and Machine Learning for government applications",
          levels: [
            { level: 1, label: "Awareness", description: "Understands AI concepts" },
            { level: 2, label: "Basic", description: "Can use pre-built AI tools" },
            { level: 3, label: "Intermediate", description: "Can build basic ML models" },
            { level: 4, label: "Advanced", description: "Can deploy AI solutions" },
            { level: 5, label: "Expert", description: "Can design AI systems for government" }
          ]
        },
        {
          id: "COMP_CLOUD",
          name: "Cloud Computing",
          description: "Cloud platforms and services for government applications",
          levels: [
            { level: 1, label: "Awareness", description: "Understands cloud concepts" },
            { level: 2, label: "Basic", description: "Can use cloud services" },
            { level: 3, label: "Intermediate", description: "Can deploy applications on cloud" },
            { level: 4, label: "Advanced", description: "Can architect cloud solutions" },
            { level: 5, label: "Expert", description: "Can design GI Cloud infrastructure" }
          ]
        },
        {
          id: "COMP_DATA_ANALYSIS",
          name: "Data Analysis",
          description: "Analyzing datasets to derive insights and support decision-making",
          levels: [
            { level: 1, label: "Awareness", description: "Understands analysis concepts" },
            { level: 2, label: "Basic", description: "Can perform descriptive analysis" },
            { level: 3, label: "Intermediate", description: "Can apply inferential statistics" },
            { level: 4, label: "Advanced", description: "Can conduct multivariate analysis" },
            { level: 5, label: "Expert", description: "Can design analytical frameworks" }
          ]
        },
        {
          id: "COMP_SPSS",
          name: "SPSS",
          description: "Statistical Package for the Social Sciences for survey tabulation and cross-sectional analysis",
          levels: [
            { level: 1, label: "Awareness", description: "Understands SPSS UI and workflow" },
            { level: 2, label: "Basic", description: "Can perform descriptive statistics and t-tests" },
            { level: 3, label: "Intermediate", description: "Can execute ANOVA and complex crosstabs" },
            { level: 4, label: "Advanced", description: "Can automate with SPSS syntax scripts" },
            { level: 5, label: "Expert", description: "Can build institutional macro libraries" }
          ]
        },
        {
          id: "COMP_SAS",
          name: "SAS",
          description: "Statistical Analysis System for large-scale enterprise data warehousing and analytics",
          levels: [
            { level: 1, label: "Awareness", description: "Knows SAS base architecture" },
            { level: 2, label: "Basic", description: "Can write DATA steps and PROC PRINT" },
            { level: 3, label: "Intermediate", description: "Can perform advanced PROC SQL and regression" },
            { level: 4, label: "Advanced", description: "Can develop SAS macro pipelines" },
            { level: 5, label: "Expert", description: "Can optimize high-volume census datasets" }
          ]
        },
        {
          id: "COMP_APIS",
          name: "APIs",
          description: "RESTful APIs and web services for inter-ministerial statistical data dissemination",
          levels: [
            { level: 1, label: "Awareness", description: "Understands API endpoints and JSON format" },
            { level: 2, label: "Basic", description: "Can query official APIs using Postman or Python" },
            { level: 3, label: "Intermediate", description: "Can integrate API data feeds into pipelines" },
            { level: 4, label: "Advanced", description: "Can design secure government API endpoints" },
            { level: 5, label: "Expert", description: "Can architect national statistical API gateways" }
          ]
        },
        {
          id: "COMP_OPEN_DATA",
          name: "Open Data",
          description: "Open government data publishing, NDSAP compliance, and NDAP data dissemination",
          levels: [
            { level: 1, label: "Awareness", description: "Understands Open Data principles and OGD portal" },
            { level: 2, label: "Basic", description: "Can prepare datasets in open formats (CSV/JSON)" },
            { level: 3, label: "Intermediate", description: "Can curate metadata per NDSAP guidelines" },
            { level: 4, label: "Advanced", description: "Can manage institutional Open Data catalog releases" },
            { level: 5, label: "Expert", description: "Can formulate open data governance policies" }
          ]
        }
      ]
    },
    {
      id: "digital",
      name: "Digital Governance",
      icon: "shield",
      color: "#10B981",
      description: "Digital governance, security, and public digital infrastructure",
      competencies: [
        {
          id: "COMP_CYBERSECURITY",
          name: "Cybersecurity",
          description: "Information security awareness and practices for government",
          levels: [
            { level: 1, label: "Awareness", description: "Knows basic security concepts" },
            { level: 2, label: "Basic", description: "Follows security policies" },
            { level: 3, label: "Intermediate", description: "Can implement security measures" },
            { level: 4, label: "Advanced", description: "Can manage security systems" },
            { level: 5, label: "Expert", description: "Can design security frameworks" }
          ]
        },
        {
          id: "COMP_DATA_PRIVACY",
          name: "Data Privacy",
          description: "Data protection, privacy laws, and compliance",
          levels: [
            { level: 1, label: "Awareness", description: "Understands privacy concepts" },
            { level: 2, label: "Basic", description: "Can handle data per privacy rules" },
            { level: 3, label: "Intermediate", description: "Can implement privacy measures" },
            { level: 4, label: "Advanced", description: "Can audit data privacy compliance" },
            { level: 5, label: "Expert", description: "Can design privacy frameworks" }
          ]
        },
        {
          id: "COMP_DIGITAL_SIGNATURE",
          name: "Digital Signatures",
          description: "Digital signature usage and PKI for government workflows",
          levels: [
            { level: 1, label: "Awareness", description: "Knows about digital signatures" },
            { level: 2, label: "Basic", description: "Can use digital signatures" },
            { level: 3, label: "Intermediate", description: "Can manage certificates" },
            { level: 4, label: "Advanced", description: "Can implement DSC workflows" },
            { level: 5, label: "Expert", description: "Can design PKI systems" }
          ]
        },
        {
          id: "COMP_GOV_CLOUD",
          name: "Government Cloud",
          description: "MeghRaj / GI Cloud and government cloud infrastructure",
          levels: [
            { level: 1, label: "Awareness", description: "Knows about GI Cloud" },
            { level: 2, label: "Basic", description: "Can use GI Cloud services" },
            { level: 3, label: "Intermediate", description: "Can deploy on GI Cloud" },
            { level: 4, label: "Advanced", description: "Can manage cloud infrastructure" },
            { level: 5, label: "Expert", description: "Can architect government cloud solutions" }
          ]
        },
        {
          id: "COMP_DPI",
          name: "Digital Public Infrastructure",
          description: "Understanding DPI stack — Aadhaar, UPI, DigiLocker, ONDC, etc.",
          levels: [
            { level: 1, label: "Awareness", description: "Knows DPI components" },
            { level: 2, label: "Basic", description: "Can use DPI services" },
            { level: 3, label: "Intermediate", description: "Can integrate with DPI APIs" },
            { level: 4, label: "Advanced", description: "Can build on DPI platforms" },
            { level: 5, label: "Expert", description: "Can contribute to DPI design" }
          ]
        }
      ]
    },
    {
      id: "behavioural",
      name: "Behavioural / Managerial",
      icon: "users",
      color: "#F59E0B",
      description: "Leadership, communication, and management competencies",
      competencies: [
        {
          id: "COMP_LEADERSHIP",
          name: "Leadership",
          description: "Strategic leadership and institutional management",
          levels: [
            { level: 1, label: "Awareness", description: "Understands leadership concepts" },
            { level: 2, label: "Basic", description: "Can lead small tasks" },
            { level: 3, label: "Intermediate", description: "Can lead teams" },
            { level: 4, label: "Advanced", description: "Can lead divisions/departments" },
            { level: 5, label: "Expert", description: "Can provide institutional leadership" }
          ]
        },
        {
          id: "COMP_COMMUNICATION",
          name: "Communication",
          description: "Written and oral communication for government contexts",
          levels: [
            { level: 1, label: "Awareness", description: "Can communicate basic information" },
            { level: 2, label: "Basic", description: "Can draft simple reports" },
            { level: 3, label: "Intermediate", description: "Can present to stakeholders" },
            { level: 4, label: "Advanced", description: "Can communicate complex statistical concepts" },
            { level: 5, label: "Expert", description: "Can lead communication strategy" }
          ]
        },
        {
          id: "COMP_PROJECT_MGMT",
          name: "Project Management",
          description: "Planning, execution, and monitoring of government projects",
          levels: [
            { level: 1, label: "Awareness", description: "Understands PM basics" },
            { level: 2, label: "Basic", description: "Can manage small tasks" },
            { level: 3, label: "Intermediate", description: "Can manage project components" },
            { level: 4, label: "Advanced", description: "Can manage complex programmes" },
            { level: 5, label: "Expert", description: "Can oversee national programmes" }
          ]
        },
        {
          id: "COMP_ETHICS",
          name: "Ethics",
          description: "Ethical conduct and integrity in statistical work and public service",
          levels: [
            { level: 1, label: "Awareness", description: "Knows ethical guidelines" },
            { level: 2, label: "Basic", description: "Follows ethical standards" },
            { level: 3, label: "Intermediate", description: "Can handle ethical dilemmas" },
            { level: 4, label: "Advanced", description: "Can mentor others on ethics" },
            { level: 5, label: "Expert", description: "Can design ethics frameworks" }
          ]
        },
        {
          id: "COMP_DECISION_MAKING",
          name: "Decision Making",
          description: "Evidence-based and strategic decision making",
          levels: [
            { level: 1, label: "Awareness", description: "Understands decision frameworks" },
            { level: 2, label: "Basic", description: "Can make routine decisions" },
            { level: 3, label: "Intermediate", description: "Can make data-informed decisions" },
            { level: 4, label: "Advanced", description: "Can make strategic decisions" },
            { level: 5, label: "Expert", description: "Can lead institutional decision making" }
          ]
        },
        {
          id: "COMP_CHANGE_MGMT",
          name: "Change Management",
          description: "Managing organizational change and transformation",
          levels: [
            { level: 1, label: "Awareness", description: "Understands change concepts" },
            { level: 2, label: "Basic", description: "Can adapt to change" },
            { level: 3, label: "Intermediate", description: "Can facilitate change" },
            { level: 4, label: "Advanced", description: "Can lead change initiatives" },
            { level: 5, label: "Expert", description: "Can drive institutional transformation" }
          ]
        }
      ]
    }
  ]
};

/** Flatten all competencies for easy lookup */
export function getAllCompetencies() {
  const all = [];
  for (const category of competencyFramework.categories) {
    for (const comp of category.competencies) {
      all.push({ ...comp, category: category.id, categoryName: category.name, categoryColor: category.color });
    }
  }
  return all;
}

/** Get a competency by ID */
export function getCompetencyById(id) {
  for (const category of competencyFramework.categories) {
    const found = category.competencies.find(c => c.id === id);
    if (found) return { ...found, category: category.id, categoryName: category.name };
  }
  return null;
}
