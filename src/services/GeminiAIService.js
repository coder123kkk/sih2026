/**
 * Gemini AI Service
 * 
 * Powers AI-enabled Competency Intelligence, Career Progression Pathways,
 * MoSPI Statistical Copilot, and Knowledge Check Assessments for
 * India's Official Statistical System.
 * 
 * Directly interfaces with Google Gemini 2.5/1.5 Flash API.
 */

import { mockIGOTCourses } from '../data/mock-igot-courses.js';
import { mockNSSTAProgrammes } from '../data/mock-nssta-programmes.js';
import { competencyFramework } from '../data/mock-competency-framework.js';
import { getUserById } from '../data/mock-users.js';
import { getRecommendationService } from './RecommendationService.js';
import { getCompetencyService } from './CompetencyService.js';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

// Knowledge base summary for grounding Gemini
const PLATFORM_CONTEXT = `
You are the AI Competency & Learning Copilot for India's Official Statistical System (MoSPI - Ministry of Statistics and Programme Implementation).
Target audience: Indian Statistical Service (ISS) officers, Subordinate Statistical Service (SSS) officers, and statistical staff across Central and State ministries.
Key institutions:
- MoSPI Divisions: National Accounts Division (NAD), Field Operations Division (FOD), Economic Statistics Division (ESD), Social Statistics Division (SSD), Survey Design and Research Division (SDRD), Data Informatics and Innovation Division (DIID).
- Training Academy: National Statistical Systems Training Academy (NSSTA), Greater Noida.
- Civil Services Learning Platform: iGOT Karmayogi (Capacity Building Commission).

Available iGOT Courses in Platform:
${mockIGOTCourses.map(c => `- [${c.id}] ${c.title} (${c.difficulty}, ${c.duration}) - Competencies: ${(c.competencyMapping || c.competencies || []).map(x => x.name).join(', ')}`).join('\n')}

Available NSSTA Training Programmes:
${mockNSSTAProgrammes.map(p => `- [${p.id}] ${p.title} (${p.duration}, ${p.mode}, Institution: ${p.institution})`).join('\n')}

Available Competencies:
${competencyFramework.categories.map(cat => `${cat.name}: ` + cat.competencies.map(c => c.name).join(', ')).join('\n')}
`;

export class GeminiAIService {
  constructor() {
    this.model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  }

  getApiKey() {
    return process.env.GEMINI_API_KEY || '';
  }

  /**
   * Raw call to Google Gemini REST API
   * @param {string} prompt
   * @param {string} systemInstruction
   * @param {Object} options
   */
  async generateContent(prompt, systemInstruction = '', options = {}) {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('Gemini API key is not configured in environment');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: options.temperature ?? 0.5,
        maxOutputTokens: options.maxOutputTokens ?? 4096,
        responseMimeType: options.jsonMode ? 'application/json' : 'text/plain',
        ...(this.model.includes('2.5') || this.model.includes('2.0') ? {
          thinkingConfig: { thinkingBudget: options.thinkingBudget ?? 0 }
        } : {})
      }
    };

    if (systemInstruction) {
      requestBody.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    const controller = new AbortController();
    const timeoutMs = options.timeoutMs || 20000;
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API Error:', response.status, errorText);
        throw new Error(`Gemini API error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const candidate = data?.candidates?.[0];
      const text = candidate?.content?.parts?.[0]?.text || '';
      return text;
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * MoSPI Statistical Copilot Chat
   * @param {Array} messages - Array of { role: 'user'|'assistant', text: string }
   * @param {Object} userContext - Current user's profile and context
   */
  async chatWithCopilot(messages, userContext = {}) {
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.text || '';
    const userId = userContext.userId || userContext.id || 'USR001';
    const user = getUserById(userId) || getUserById('USR001');

    // Reuse existing Competency Engine & Recommendation Service (Requirements 2, 4, 7)
    const recService = getRecommendationService();
    const recResult = await recService.getPersonalizedCopilotRecommendations(user.id, lastUserMessage);
    const compService = getCompetencyService();
    const compProfile = compService.getUserCompetencyProfile(user.id) || {};

    const topGapsSummary = recResult.priorityGaps
      .map(g => `- ${g.name}: Current ${g.currentScore}%, Required ${g.requiredScore}% (Gap: -${g.gapScore || g.gap}%, Severity: ${g.gapStatus})`)
      .join('\n');

    const recommendedCoursesSummary = recResult.recommendedCourses
      .map(c => `- [${c.id}] ${c.title} (${c.level}, ${c.duration}, Provider: ${c.provider}) -> Reason: ${c.reason}`)
      .join('\n');

    const recommendedTrainingSummary = recResult.recommendedTraining
      .map(t => `- [${t.id}] ${t.title} (${t.duration}, Venue: ${t.provider}) -> Reason: ${t.reason}`)
      .join('\n');

    const systemPrompt = `${PLATFORM_CONTEXT}
You are "Karmayogi AI Assistant", an expert statistical advisor for Indian Government statisticians in the Ministry of Statistics and Programme Implementation (MoSPI).

CURRENT LOGGED-IN OFFICER PROFILE & REAL COMPETENCY ENGINE DATA:
- Officer Name: ${user.name}
- Designation: ${user.designation} (${user.grade})
- Department: ${user.department}
- Current Assignment: ${user.currentAssignment}
- Job Role: ${user.jobRole}
- Overall Competency Index: ${compProfile?.overallScore || 76}%
- Highest Priority Skill Gaps (from MoSPI Competency Engine):
${topGapsSummary || 'None identified'}

DETERMINISTIC RECOMMENDATIONS (Strict Requirement: Recommend ONLY these courses and training programmes):
iGOT Courses:
${recommendedCoursesSummary || 'No specific course required'}

NSSTA Training Programmes:
${recommendedTrainingSummary || 'No specific training required'}

CRITICAL INSTRUCTIONS:
1. Ground your response STRICTLY in the above profile, skill gaps, and recommendations.
2. DO NOT recommend "Python for Data Analysis" unless Python is explicitly listed in the officer's priority skill gaps above or the officer explicitly asked about Python.
3. If the user asks for course recommendations, your recommended courses MUST match the ones listed above.
4. Address the user respectfully by their name (${user.name}) and designation (${user.designation}).
5. Use clean markdown with headers and bullet points.`;

    const formattedHistory = messages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`).join('\n\n');
    const prompt = `Conversation history:\n${formattedHistory}\n\nPlease provide your helpful, accurate response as Karmayogi AI Assistant:`;

    try {
      const apiKey = this.getApiKey();
      if (!apiKey) {
        throw new Error('Gemini API key is not configured; invoking local rule-based intelligence engine');
      }

      const reply = await this.generateContent(prompt, systemPrompt, { timeoutMs: 10000 });
      // Sanity check: Ensure reply doesn't claim lack of access to user's scores
      if (reply.toLowerCase().includes('do not have specific "scores"') || 
          reply.toLowerCase().includes('do not have access to a comprehensive "competency score"') ||
          reply.toLowerCase().includes('do not have access to specific scores')) {
        const localReply = this._generateLocalRuleBasedResponse(lastUserMessage, user, compProfile, recResult);
        return {
          success: true,
          reply: localReply,
          priorityGaps: recResult.priorityGaps,
          reasoning: recResult.reasoning,
          recommendedCourses: recResult.recommendedCourses,
          recommendedTraining: recResult.recommendedTraining,
          nextSteps: recResult.nextSteps,
          debug: {
            ...recResult.debug,
            aiProviderStatus: 'gemini-fallback-local',
            fallbackUsed: true
          }
        };
      }

      return {
        success: true,
        reply,
        priorityGaps: recResult.priorityGaps,
        reasoning: recResult.reasoning,
        recommendedCourses: recResult.recommendedCourses,
        recommendedTraining: recResult.recommendedTraining,
        nextSteps: recResult.nextSteps,
        debug: {
          ...recResult.debug,
          aiProviderStatus: 'gemini-live',
          fallbackUsed: false
        }
      };
    } catch (error) {
      console.warn('Copilot Chat API unavailable or offline, generating contextual local rule-based response:', error.message);
      const fallbackReply = this._generateLocalRuleBasedResponse(lastUserMessage, user, compProfile, recResult);
      return {
        success: true,
        fallback: true,
        reply: fallbackReply,
        priorityGaps: recResult.priorityGaps,
        reasoning: recResult.reasoning,
        recommendedCourses: recResult.recommendedCourses,
        recommendedTraining: recResult.recommendedTraining,
        nextSteps: recResult.nextSteps,
        debug: {
          ...recResult.debug,
          aiProviderStatus: 'offline-local-rule-engine',
          fallbackUsed: true
        }
      };
    }
  }

  /**
   * Dynamic local rule-based response generator using the officer's real competency profile
   * (Requirements 1, 2, 3, 6, 8, 9)
   */
  _generateLocalRuleBasedResponse(query, user, compProfile = {}, recResult) {
    const q = (query || '').toLowerCase();
    const officerName = user.name || 'Dr. Priya Sharma';
    const designation = user.designation || 'Deputy Director';
    const dept = user.department || 'MoSPI';
    const assignment = user.currentAssignment || 'Statistical Survey Operations';
    const priorityGaps = recResult.priorityGaps || [];
    const recommendedCourses = recResult.recommendedCourses || [];
    const recommendedTraining = recResult.recommendedTraining || [];
    const gapNames = priorityGaps.slice(0, 2).map(g => g.name).join(' and ') || 'identified competencies';

    // 1. SPECIFIC COMPETENCY WEAKNESS INQUIRY: "Why am I weak in Sampling?" / "Why is my score low?"
    if (q.includes('why') && (q.includes('weak') || q.includes('low') || q.includes('gap') || q.includes('score') || q.includes('sampling') || q.includes('survey'))) {
      // Find matching competency in user's profile
      const allComps = compProfile.competencies || [];
      let targetComp = null;
      if (q.includes('sampling')) {
        targetComp = allComps.find(c => c.name.toLowerCase().includes('sampling')) || priorityGaps.find(g => g.name.toLowerCase().includes('sampling'));
      } else if (q.includes('survey')) {
        targetComp = allComps.find(c => c.name.toLowerCase().includes('survey')) || priorityGaps.find(g => g.name.toLowerCase().includes('survey'));
      } else if (q.includes('account') || q.includes('gdp') || q.includes('national')) {
        targetComp = allComps.find(c => c.name.toLowerCase().includes('account')) || priorityGaps.find(g => g.name.toLowerCase().includes('account'));
      } else if (q.includes('python')) {
        targetComp = allComps.find(c => c.name.toLowerCase().includes('python')) || priorityGaps.find(g => g.name.toLowerCase().includes('python'));
      } else {
        targetComp = priorityGaps[0] || allComps[0];
      }

      const compName = targetComp?.name || 'Sampling & Survey Methodology';
      const curScore = targetComp?.currentScore ?? 50;
      const reqScore = targetComp?.requiredScore ?? 80;
      const gapScore = targetComp?.gapScore ?? (reqScore - curScore);
      const severity = targetComp?.gapStatus || (gapScore >= 35 ? 'Critical' : gapScore >= 25 ? 'High' : 'Medium');

      return `Namaste ${officerName},

Here is the detailed competency diagnostic explaining your evaluation in **${compName}**:

---

### Competency Diagnostic Summary
- **Current Assessed Score**: **${curScore}%** (Level: ${targetComp?.currentLevelLabel || 'Intermediate'})
- **Required Benchmark**: **${reqScore}%** (Level: ${targetComp?.requiredLevelLabel || 'Advanced'})
- **Competency Gap**: **-${gapScore}%** (Severity: **${severity}**)
- **Target Role / Cadre Level**: ${designation} (${user.grade || 'Group A'})
- **Active Assignment Context**: ${assignment}

---

### Root Cause Analysis & Role Impact
1. **Assessment & Operational Gap**:
   Your current score of ${curScore}% indicates solid foundational knowledge, but falls short of the ${reqScore}% benchmark mandated for ${designation} responsibilities. Under MoSPI guidelines, officers at your level are expected to oversee complex sample frame design, stratification, and variance estimation.
2. **Relevance to Current Assignment**:
   In your work on **${assignment}**, precision in ${compName} directly influences sample weighting, non-sampling error control, and the statistical reliability of published indicators.
3. **DPC / Promotion Prerequisite**:
   Closing this ${gapScore}% gap is necessary to meet the 75% domain threshold required for cadre progression.

---

### Recommended Remediation Action
${recommendedCourses.length > 0 ? `* **Primary Digital Course**: Enroll in **[${recommendedCourses[0].id}] ${recommendedCourses[0].title}** on iGOT Karmayogi (${recommendedCourses[0].duration}). ${recommendedCourses[0].reason}` : ''}
${recommendedTraining.length > 0 ? `* **Hands-on Training**: Nominate for **[${recommendedTraining[0].id}] ${recommendedTraining[0].title}** at NSSTA Greater Noida (${recommendedTraining[0].duration}).` : ''}

Would you like to start this course or review the detailed syllabus?`;
    }

    // 2. SPECIFIC PYTHON INQUIRY: "How can I improve my Python?"
    if (q.includes('python')) {
      const pythonComp = (compProfile.competencies || []).find(c => c.name.toLowerCase().includes('python'));
      const pythonScore = pythonComp?.currentScore ?? (user.skills?.includes('Python') ? 92 : 52);
      const isProficient = pythonScore >= 80;

      if (isProficient) {
        return `Namaste ${officerName},

Your competency evaluation indicates that you already possess **strong proficiency in Python** with a score of **${pythonScore}%** (Expert Level).

---

### Your Python Competency Status
- **Current Score**: **${pythonScore}%** (Exceeds the required benchmark of 80%)
- **Status**: **Strong Core Competency**
- **Recommended Application**: Mentor junior colleagues, develop automated data pipelines for ${assignment}, and explore advanced machine learning integration.

---

### Priority Focus Areas
Because your Python skills are already well-developed, your capacity building focus should be directed toward your **highest-priority competency gaps**:
${priorityGaps.slice(0, 2).map((g, i) => `${i + 1}. **${g.name}** (Current: ${g.currentScore}%, Required: ${g.requiredScore}%, Gap: -${g.gapScore || g.gap}%)`).join('\n')}

${recommendedCourses.length > 0 ? `To strengthen these priority areas, I recommend enrolling in **[${recommendedCourses[0].id}] ${recommendedCourses[0].title}** on iGOT Karmayogi.` : ''}`;
      } else {
        return `Namaste ${officerName},

Here is your targeted action plan to strengthen your **Python for Tabulation & Data Analysis** capabilities:

---

### Competency Breakdown
- **Current Score**: **${pythonScore}%** | **Required Benchmark**: **80%** | **Gap**: **-${80 - pythonScore}%**
- **Target Application**: Automating survey cleaning, cross-tabulation routines, and reproducible statistical pipelines for ${assignment}.

---

### Recommended Capacity Building Pathway
1. **[igot-crs-001] Python for Data Analysis in Government**
   - **Provider**: Capacity Building Commission (CBC) | **Duration**: 2h 30m
   - **Focus**: NumPy, Pandas for large-scale microdata handling, and automated report generation.
2. **Practical Milestone**:
   - Build automated tabulation scripts for quarterly survey releases in ${dept} to replace manual spreadsheet validation.`;
      }
    }

    // 3. ASSIGNMENT / PLFS INQUIRY: "I am working on PLFS. What should I learn?"
    if (q.includes('plfs') || q.includes('labour') || q.includes('working on')) {
      return `Namaste ${officerName},

For your assignment on **${assignment}** in the **${dept}**, targeted capacity building in survey methodology and macroeconomic data interfaces is critical.

Based on your active competency profile, here are your highest-priority learning interventions to excel in PLFS operations:

---

### Priority Capacity Building for PLFS Operations
${recommendedCourses.map((c, i) => `${i + 1}. **[${c.id}] ${c.title}**
   - **Provider**: ${c.provider} | **Duration**: ${c.duration} | **Level**: ${c.level}
   - **Target Competency**: ${c.competency}
   - **Why Recommended**: ${c.reason}`).join('\n\n')}

${recommendedTraining.length > 0 ? `---

### Relevant NSSTA Training Programme
* **[${recommendedTraining[0].id}] ${recommendedTraining[0].title}**
  - **Venue**: ${recommendedTraining[0].provider} | **Duration**: ${recommendedTraining[0].duration}
  - **Focus**: ${recommendedTraining[0].reason}` : ''}

Completing these resources will directly strengthen your survey estimation accuracy and tabulation efficiency for upcoming PLFS bulletins.`;
    }

    // 4. "WHAT SHOULD I LEARN NEXT?" or "SKILL GAPS" or "DPC READINESS"
    if (q.includes('what should i learn next') || q.includes('learn next') || q.includes('skill gap') || q.includes('dpc') || q.includes('readiness') || q.includes('promotion')) {
      return `Namaste ${officerName},

Based on your current competency profile as **${designation}** in **${dept}**, your highest-priority gaps are **${gapNames}**. I recommend strengthening these areas first.

---

### 1. Identified Priority Skill Gaps
| Competency | Domain | Current Score | Required Score | Gap | Severity |
|---|---|---|---|---|---|
${priorityGaps.map(g => `| **${g.name}** | ${g.category || 'Statistical'} | **${g.currentScore}%** | ${g.requiredScore}% | **-${g.gapScore || g.gap}%** | **${g.gapStatus}** |`).join('\n')}

---

### 2. Immediate Recommended Next Steps
${recommendedCourses.map((c, i) => `${i + 1}. **Step ${i + 1}**: Enroll in **[${c.id}] ${c.title}** on iGOT Karmayogi (${c.duration}).
   - *Reason*: ${c.reason}`).join('\n')}
${recommendedTraining.length > 0 ? `${recommendedCourses.length + 1}. **Step ${recommendedCourses.length + 1}**: Nominate for **[${recommendedTraining[0].id}] ${recommendedTraining[0].title}** at NSSTA Greater Noida (${recommendedTraining[0].duration}).` : ''}

Bridging these priority gaps will ensure your competency index surpasses the 75% threshold across all domains, placing your profile in optimal standing for cadre progression.`;
    }

    // 5. "RECOMMEND COURSES FOR ME"
    if (q.includes('recommend') || q.includes('course') || q.includes('catalogue')) {
      return `Namaste ${officerName},

Based on your current competency profile as **${designation}** in the **${dept}**, your highest-priority gaps are **${gapNames}**. I recommend strengthening these areas first.

---

### Priority iGOT Karmayogi Digital Courses
${recommendedCourses.map((c, i) => `${i + 1}. **[${c.id}] ${c.title}**
   - **Provider**: ${c.provider}
   - **Duration**: ${c.duration} | **Level**: ${c.level}
   - **Competency Targeted**: ${c.competency}
   - **Why Recommended**: ${c.reason}`).join('\n\n')}

---

### Priority NSSTA Training Programmes (In-Person / Hybrid)
${recommendedTraining.map((t, i) => `* **[${t.id}] ${t.title}**
  - **Location**: ${t.provider} | **Duration**: ${t.duration}
  - **Focus**: ${t.reason}`).join('\n')}

You can enroll directly via the course cards below or navigate to your personalized Learning Pathway.`;
    }

    // 6. EXPLAIN COMPETENCY SCORE
    if (q.includes('score') || q.includes('explain') || q.includes('domain')) {
      const domains = compProfile.domainScores || { statistical: 78, technical: 65, digitalGovernance: 70, behavioural: 82 };
      return `Namaste ${officerName},

Here is the official breakdown of your **Competency Profile Scores** within the MoSPI Competency Framework:

---

### Overall Competency Index: **${compProfile.overallScore || 76}%**
- **Cadre Benchmark Target**: **80%** (Required for cadre elevation)
- **Current Designation**: ${designation}

---

### Domain Breakdown
- **Statistical Domain**: **${domains.statistical || 78}%**
- **Technical Domain**: **${domains.technical || 65}%**
- **Digital Governance**: **${domains.digitalGovernance || 70}%**
- **Behavioural & Leadership**: **${domains.behavioural || 82}%**

---

### Highest Priority Skill Gaps
${priorityGaps.map(g => `* **${g.name}**: Current **${g.currentScore}%** vs Required **${g.requiredScore}%** (Gap: -${g.gapScore || g.gap}%, Severity: ${g.gapStatus})`).join('\n')}

---

### Recommended Remediation
To elevate your index above the 80% benchmark, I recommend beginning with **[${recommendedCourses[0]?.id}] ${recommendedCourses[0]?.title}**, which directly targets your primary gap in ${priorityGaps[0]?.name || 'Official Statistics'}.`;
    }

    // 7. LEARNING PLAN
    if (q.includes('learning plan') || q.includes('12-month') || q.includes('plan')) {
      return `Namaste ${officerName},

Here is your tailored **12-Month Capacity Building Learning Plan** engineered for **${designation}** cadre progression:

---

### Phase 1: Months 1–3 — Core Priority Gap Remediation
* **Primary Focus**: Close highest-priority gaps in ${gapNames}.
* **Courses**:
  ${recommendedCourses.slice(0, 2).map(c => `- **[${c.id}] ${c.title}** (${c.duration})`).join('\n  ')}
* **Operational Milestone**: Apply methodology updates directly to ${assignment}.

---

### Phase 2: Months 4–6 — Advanced Methodology & Hands-on Training
* **Primary Focus**: Residential deep-dive at NSSTA Greater Noida.
* **Programmes**:
  ${recommendedTraining.map(t => `- **[${t.id}] ${t.title}** (${t.duration})`).join('\n  ')}

---

### Phase 3: Months 7–9 — Quality Assurance & Metadata Standards
* **Primary Focus**: Implement SDMX metadata structures and reproducible survey validation.

---

### Phase 4: Months 10–12 — Cadre Progression Dossier Review
* **Target Outcome**: Aggregate Competency Score reaches **>= 82%** with zero Critical gaps.`;
    }

    // 8. CPI-C Elementary Aggregates
    if (q.includes('cpi') || q.includes('elementary aggregate') || q.includes('aggregates')) {
      return `Namaste ${officerName},

In India's **Consumer Price Index - Combined (CPI-C, Base Year 2012=100)** compiled by the Central Statistics Office (CSO/NSO) under MoSPI, **elementary aggregates** represent the lowest level of aggregation for which price data is collected without item-level weights.

---

### 1. Mathematical Formulation for Elementary Price Relatives
For each selected commodity/service $i$ in market $m$ at current period $t$ compared to base period $0$:
1. **Geometric Mean of Price Relatives (Jevons Index Formula)**:
   Used primarily for items across comparable quality specifications to avoid substitution bias:
   $$I_{elementary} = \\left( \\prod_{k=1}^{n} \\frac{P_{kt}}{P_{k0}} \\right)^{\\frac{1}{n}} \\times 100$$
   where $P_{kt}$ is the current price quotation and $P_{k0}$ is the base price quotation for variety $k$.

2. **Ratio of Arithmetic Mean Prices (Dutot Formula)**:
   Applied when quotations are strictly homogeneous in packaging and quality:
   $$I_{elementary}^{Dutot} = \\frac{\\frac{1}{n}\\sum_{k=1}^n P_{kt}}{\\frac{1}{n}\\sum_{k=1}^n P_{k0}} \\times 100$$

---

### 2. Aggregation Structure to All-India CPI-C
* **Step 1 — Market Level**: Price quotations from **1,181 rural village markets** and **1,114 urban markets** collected monthly by Field Operations Division (FOD).
* **Step 2 — State / UT Level Aggregation**: Elementary indices are aggregated into **sub-groups** (e.g., Cereals, Meat & Fish, Fuel & Light) using expenditure weights derived from the **Consumer Expenditure Survey (CES)**.
* **Step 3 — Weighted Laspeyres Aggregation**:
  $$I_{Composite} = \\frac{\\sum_{j} W_j \\times I_j}{\\sum_{j} W_j}$$
  where $W_j$ is the expenditure weight of sub-group $j$.
* **Step 4 — National CPI-C**: Rural and Urban indices are combined using population and consumption expenditure shares to produce the headline CPI Combined released on the 12th of every month.`;
    }

    // 9. SNA 2008 Gross Value Added (GVA)
    if (q.includes('sna') || q.includes('gva') || q.includes('gross value added') || (q.includes('national accounts') && (q.includes('equation') || q.includes('formula') || q.includes('framework')))) {
      return `Namaste ${officerName},

Under the **UN System of National Accounts (SNA 2008)**, adopted by MoSPI's **National Accounts Division (NAD)** with the 2011-12 base revision:

---

### 1. Fundamental Accounting Equation for GVA
At the institutional and industry level, **Gross Value Added at Basic Prices** measures the net contribution of an industry to the economy:

$$\\mathbf{GVA\\text{ at basic prices}} = \\mathbf{Gross\\text{ Output at basic prices}} - \\mathbf{Intermediate\\text{ Consumption at purchasers' prices}}$$

where:
* **Gross Output**: Total value of goods and services produced, including market output, output for own final use, and other non-market output.
* **Intermediate Consumption**: Value of goods and services consumed as inputs in production (excluding consumption of fixed capital).

---

### 2. Transition from GVA to GDP
To transition from sector-level GVA to national **Gross Domestic Product (GDP) at Market Prices**:

$$\\mathbf{GDP\\text{ at market prices}} = \\sum \\mathbf{GVA\\text{ at basic prices}} + \\mathbf{Product\\text{ Taxes}} - \\mathbf{Product\\text{ Subsidies}}$$

* **Product Taxes**: GST, excise duties, customs duties, stamp duty, sales tax.
* **Product Subsidies**: Food, fertilizer, petroleum subsidies paid directly per unit of product.
* *(Production taxes/subsidies such as land revenue or municipal taxes are already incorporated into GVA at basic prices).*

---

### 3. Sectoral Compilation in India (8 Broad Sectors)
1. Agriculture, Forestry & Fishing
2. Mining & Quarrying
3. Manufacturing *(leveraging MCA-21 corporate balance sheets and ASI)*
4. Electricity, Gas, Water Supply & Other Utility Services
5. Construction
6. Trade, Repair, Hotels, Transport, Communication & Broadcasting
7. Financial, Real Estate & Professional Services
8. Public Administration, Defence & Other Services

This compilation is maintained and released quarterly and annually by the National Accounts Division (NAD), MoSPI.`;
    }

    // 10. ISS Group A Promotion
    if (q.includes('iss group a') || (q.includes('promotion') && q.includes('cadre')) || q.includes('group a promotion')) {
      return `Namaste ${officerName},

Here are the official service prerequisites and guidelines for promotion within the **Indian Statistical Service (ISS Group A)** from **Deputy Director (Senior Time Scale, Pay Level 11)** to **Joint Director (Junior Administrative Grade, Pay Level 12)** governed by DoPT and ISS Cadre Rules:

---

### 1. Statutory Cadre Eligibility Criteria
* **Minimum Residency Service**:
  - Minimum of **5 years approved regular service** in the grade of Deputy Director (STS, Level 11).
* **APAR Benchmark**:
  - Minimum grading of **"Very Good"** in the Annual Performance Assessment Reports (APAR) for all 5 qualifying years preceding the DPC.
  - No adverse entries or vigilance penalties in the integrity dossier.
* **Clearance of Mandatory Training**:
  - Completion of **Mid-Career Training Programme (MCTP) Phase-II / Phase-III** conducted by the National Statistical Systems Training Academy (NSSTA).

---

### 2. MoSPI Competency & Capacity Building Benchmark
Under the Capacity Building Commission (CBC) framework:
* **Aggregate Competency Score**: Recommended minimum threshold of **>= 75%**.
* **Domain Minimums**: No domain score below **65%**; zero unresolved **Critical Severity** gaps.
* **Key Areas Evaluated**:
  - Leadership & Public Policy Formulation
  - Modern Statistical Computing (Python / R)
  - Macroeconomic Statistics (SNA 2008 compliance)
  - Inter-ministerial coordination and administrative stewardship.`;
    }

    // 11. UPSS Employment Criteria in PLFS
    if (q.includes('upss') || (q.includes('employment') && q.includes('criteria')) || q.includes('usual principal')) {
      return `Namaste ${officerName},

In the **Periodic Labour Force Survey (PLFS)** designed and compiled by the National Sample Survey Office (NSSO) under MoSPI, the **Usual Principal and Subsidiary Status (UPSS)** is the official headline indicator for measuring overall workforce and employment in India over a long-term reference period:

---

### 1. Conceptual Framework & Reference Period
* **Reference Period**: Exactly **365 days** preceding the date of household enumeration.
* The economic activity status of a person is determined through a two-stage sequential classification:

---

### 2. Stage 1: Usual Principal Status (UPS)
1. An individual is first classified by the activity in which they spent the **majority of time (relatively long time, >= 183 days)** during the 365-day reference period.
2. Major activity categories:
   - **In Labour Force**:
     - *Employed / Working* (self-employed, regular wage/salaried, casual labour)
     - *Unemployed* (seeking or available for work for majority of the year)
   - **Out of Labour Force**:
     - Attending educational institutions, domestic duties only, rentiers, pensioners, disabled, etc.

---

### 3. Stage 2: Subsidiary Economic Status (SS)
1. If a person is categorized as a **non-worker (unemployed or out of labour force)** under their Principal Status:
2. Any economic activity pursued for **at least 30 days** during the 365-day reference period qualifies them as a **Subsidiary Status Worker**.

---

### 4. Definition of UPSS Worker
$$\\mathbf{UPSS\\text{ Employed (Workforce)}} = \\mathbf{UPS\\text{ Workers}} + \\mathbf{Subsidiary\\text{ Status Workers}}$$

* **Analytical Significance**:
  - UPSS captures both perennial/regular workers and **intermittent, seasonal, or informal workers** (especially agricultural and rural women workers who work during harvesting or sowing seasons for > 30 days).
  - It provides the most comprehensive measure of total employment and Labour Force Participation Rate (LFPR) in the Indian economy.`;
    }

    // 12. DEFAULT DYNAMIC CONTEXTUAL RESPONSE (No static fallback, fully personalized to user)
    return `Namaste ${officerName},

Based on your current competency profile as **${designation}** in **${dept}**, your highest-priority gaps are **${gapNames}**. I recommend strengthening these areas first.

### Priority Capacity Building Recommendations
Here are your recommended capacity building resources tailored to your active assignment on **${assignment}**:

${recommendedCourses.map((c, i) => `${i + 1}. **[${c.id}] ${c.title}** (${c.duration}) — ${c.reason}`).join('\n')}

${recommendedTraining.length > 0 ? `### Recommended Academy Training\n* **[${recommendedTraining[0].id}] ${recommendedTraining[0].title}** (${recommendedTraining[0].duration}) — ${recommendedTraining[0].reason}\n` : ''}
How else can I assist your capacity building today?`;
  }

  /**
   * Generate an intelligent Career Progression Pathway
   * @param {Object} params
   */
  _cleanJson(text) {
    if (!text) return '{}';
    let cleaned = text.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    return cleaned.trim();
  }

  async generateCareerPathway({ currentRole, targetRole, department, skillGaps, targetTimeline = '12 Months' }) {
    const systemPrompt = `${PLATFORM_CONTEXT}
Generate a structured, actionable Competency Development Pathway for an Indian official statistician progressing from their current role to a target role.
Return the result strictly as valid JSON matching this schema:
{
  "pathwayTitle": "string",
  "executiveSummary": "string",
  "readinessScore": number (1 to 100),
  "targetTimeline": "string",
  "phases": [
    {
      "phaseNumber": number,
      "title": "string",
      "duration": "string",
      "objective": "string",
      "competenciesTargeted": ["string"],
      "recommendedIGOTCourses": [
        { "id": "string", "title": "string", "relevance": "string" }
      ],
      "recommendedNSSTAProgrammes": [
        { "id": "string", "title": "string", "relevance": "string" }
      ],
      "practicalMilestone": "string"
    }
  ],
  "issCareerTips": ["string"]
}`;

    const prompt = `Current Role: ${currentRole}
Target Role: ${targetRole}
Department: ${department}
Target Timeline: ${targetTimeline}
Known Skill Gaps: ${JSON.stringify(skillGaps)}

Generate the career development pathway with exact matching courses from the iGOT and NSSTA lists provided.`;

    try {
      const responseText = await this.generateContent(prompt, systemPrompt, { jsonMode: true, temperature: 0.75, maxOutputTokens: 4096 });
      const cleaned = this._cleanJson(responseText);
      const parsed = JSON.parse(cleaned);
      return { success: true, data: parsed };
    } catch (error) {
      console.error('Pathway generation failed or timed out, serving structured MoSPI cadre progression fallback:', error.message);
      // Robust Fallback structured data
      return {
        success: true,
        fallback: true,
        data: {
          pathwayTitle: `${currentRole} to ${targetRole} Progression Pathway`,
          executiveSummary: `Targeted capability roadmap bridging functional and statistical competencies for elevation to ${targetRole}.`,
          readinessScore: 68,
          targetTimeline,
          phases: [
            {
              phaseNumber: 1,
              title: "Core Statistical Foundations & Macroeconomic Methodology",
              duration: targetTimeline.includes('6') ? "Months 1-2" : "Months 1-4",
              objective: "Close critical gaps in National Accounts and Sample Survey Design.",
              competenciesTargeted: ["National Accounts Statistics", "Sample Survey Design"],
              recommendedIGOTCourses: [
                { id: "igot-crs-010", title: "National Accounts Statistics", relevance: "Directly addresses critical gap in SNA 2008 framework and GVA compilation" },
                { id: "igot-crs-008", title: "Survey Design and Methodology", relevance: "Strengthens survey sampling, CAPI design, and weighting methodology" }
              ],
              recommendedNSSTAProgrammes: [
                { id: "NSSTA001", title: "National Accounts Statistics — Methodology & Practice", relevance: "Hands-on SUT compilation at NSSTA Greater Noida" }
              ],
              practicalMilestone: "Complete MoSPI pilot SUT exercise and submit verification report."
            },
            {
              phaseNumber: 2,
              title: "Digital Analytics & Modern Computing Tools",
              duration: targetTimeline.includes('6') ? "Months 3-4" : "Months 5-8",
              objective: "Upskill in automated data validation, Python/R, and microdata processing.",
              competenciesTargeted: ["Python for Tabulation & Data Analysis", "R Programming"],
              recommendedIGOTCourses: [
                { id: "igot-crs-001", title: "Python for Data Analysis in Government", relevance: "Automate routine statistical tabulations and data wrangling" },
                { id: "igot-crs-007", title: "R Programming for Statistical Analysis", relevance: "Advanced statistical modeling and survey quality checks" }
              ],
              recommendedNSSTAProgrammes: [
                { id: "NSSTA005", title: "GIS and Geospatial Analysis for Statistical Mapping", relevance: "Practical spatial boundary and thematic mapping" }
              ],
              practicalMilestone: "Build an automated quarterly statistical bulletin pipeline."
            },
            {
              phaseNumber: 3,
              title: "Strategic Leadership & Dissemination",
              duration: targetTimeline.includes('6') ? "Months 5-6" : "Months 9-12",
              objective: "Master data governance, official release protocols, and SDG 2030 monitoring.",
              competenciesTargeted: ["Official Statistics Governance", "Public Policy Analytics"],
              recommendedIGOTCourses: [
                { id: "igot-crs-012", title: "Leadership in Public Administration", relevance: "Strategic public leadership and inter-departmental collaboration" },
                { id: "igot-crs-013", title: "SDG Indicators — Monitoring and Reporting", relevance: "National Indicator Framework monitoring" }
              ],
              recommendedNSSTAProgrammes: [
                { id: "NSSTA002", title: "Advanced Sampling Techniques for Large-Scale Surveys", relevance: "Executive decision making and precision estimation" }
              ],
              practicalMilestone: "Lead inter-departmental statistical coordination working group."
            }
          ],
          issCareerTips: [
            "Align your training record with the Annual Performance Assessment Report (APAR) competency matrix.",
            "Complete the mandatory NSSTA in-service workshop before the Departmental Promotion Committee (DPC) review.",
            "Publish a methodological working paper in MoSPI's 'Sarvekshana' journal."
          ]
        }
      };
    }
  }

  /**
   * Generate an interactive Competency Assessment Quiz
   * @param {Object} params
   */
  async generateAssessment({ competencyName, level = 'Intermediate' }) {
    const systemPrompt = `${PLATFORM_CONTEXT}
Generate a 3-question scenario-based assessment quiz to evaluate an Indian official statistician's mastery in the given competency.
All questions MUST be practical scenarios from Indian official statistics (e.g., NSS surveys, ASI, CPI, GDP compilation, SDG indicators).
Return strictly valid JSON with this schema:
{
  "competencyName": "string",
  "level": "string",
  "questions": [
    {
      "id": 1,
      "scenario": "string",
      "question": "string",
      "options": [
        "A) Option text",
        "B) Option text",
        "C) Option text",
        "D) Option text"
      ],
      "correctOptionIndex": number (0 for A, 1 for B, 2 for C, 3 for D),
      "explanation": "string",
      "practicalTip": "string"
    }
  ]
}`;

    const prompt = `Generate a realistic 3-question evaluation quiz for competency: "${competencyName}" at "${level}" level for an officer in MoSPI.`;

    try {
      const responseText = await this.generateContent(prompt, systemPrompt, { jsonMode: true, temperature: 0.2, maxOutputTokens: 4096 });
      const cleaned = this._cleanJson(responseText);
      const parsed = JSON.parse(cleaned);
      return { success: true, data: parsed };
    } catch (error) {
      console.error('Assessment generation failed:', error);
      return {
        success: true,
        fallback: true,
        data: {
          competencyName,
          level,
          questions: [
            {
              id: 1,
              scenario: "In the compilation of the Consumer Price Index (CPI-C) for rural and urban sectors, a specific item shows sudden price volatility due to temporary supply shocks.",
              question: "Which index compilation formula is officially adopted at the elementary aggregate level in India's CPI?",
              options: [
                "A) Laspeyres Price Index formula with base year quantities",
                "B) Geometric Mean (Jevons Index) of price relatives",
                "C) Simple Arithmetic Mean (Carli Index) without weighting",
                "D) Paasche Price Index using current year expenditure weights"
              ],
              correctOptionIndex: 1,
              explanation: "In official price statistics guidelines, elementary aggregates are compiled using the Jevons formula (Geometric Mean of price relatives) to avoid the upward substitution bias inherent in the Carli index.",
              practicalTip: "Refer to the MoSPI CPI Technical Manual Section 4 on Elementary Aggregates."
            },
            {
              id: 2,
              scenario: "During the Periodic Labour Force Survey (PLFS), a field investigator records an individual engaged in household farming for 35 days in the reference year.",
              question: "Under the Usual Principal and Subsidiary Status (UPSS) approach, when is the person classified as employed?",
              options: [
                "A) If they worked for at least 183 days in the reference year",
                "B) Under subsidiary status if they engaged for 30 days or more, even if principal status was out of labour force",
                "C) Only if they received cash wages for the work performed",
                "D) Under Current Weekly Status (CWS) only"
              ],
              correctOptionIndex: 1,
              explanation: "Under the UPSS approach, an individual whose principal status is outside the labour force or unemployed is categorized as employed (UPSS) if they worked in a subsidiary economic activity for 30 days or more during the 365 days reference period.",
              practicalTip: "PLFS Activity Code definitions are detailed in the MoSPI PLFS Instructions to Field Staff."
            },
            {
              id: 3,
              scenario: "In National Accounts compilation (2011-12 base), the transition from establishment approach to enterprise approach utilizes MCA-21 database records.",
              question: "What is the primary method to address non-reporting or 'active-shell' companies in MCA-21 blowing-up factors?",
              options: [
                "A) Replace all non-reporting companies with zero gross value added",
                "B) Calculate the ratio of paid-up capital of reporting vs. active companies within each NIC 2-digit class",
                "C) Impute using state-level Annual Survey of Industries (ASI) factory weights",
                "D) Exclude non-filing companies from aggregate GDP completely without adjustment"
              ],
              correctOptionIndex: 1,
              explanation: "The National Accounts Division (NAD) uses the Paid-Up Capital (PUC) blowing-up method by 2-digit National Industrial Classification (NIC) to scale up reporting MCA-21 enterprises to the universe of active companies.",
              practicalTip: "Review the Advisory Committee on National Accounts working paper on Corporate Sector GVA Estimation."
            }
          ]
        }
      };
    }
  }
}

let geminiServiceInstance = null;
export function getGeminiAIService() {
  if (!geminiServiceInstance) {
    geminiServiceInstance = new GeminiAIService();
  }
  return geminiServiceInstance;
}
