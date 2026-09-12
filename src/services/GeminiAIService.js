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
        temperature: options.temperature ?? 0.4,
        maxOutputTokens: options.maxOutputTokens ?? 4096,
        responseMimeType: options.jsonMode ? 'application/json' : 'text/plain'
      }
    };

    if (systemInstruction) {
      requestBody.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
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
  }

  /**
   * MoSPI Statistical Copilot Chat
   * @param {Array} messages - Array of { role: 'user'|'assistant', text: string }
   * @param {Object} userContext - Current user's profile and skill gaps
   */
  async chatWithCopilot(messages, userContext = {}) {
    const systemPrompt = `${PLATFORM_CONTEXT}
You are "Karmayogi AI Assistant", an expert statistical advisor for Indian Government statisticians.
Current User Context:
- Name: ${userContext.name || 'Dr. Priya Sharma'}
- Designation: ${userContext.designation || 'Statistical Officer'}
- Department: ${userContext.department || 'Labour Statistics Division, MoSPI'}
- Identified Skill Gaps: ${JSON.stringify(userContext.gaps || ['National Accounts Statistics', 'Sample Survey Design', 'Python'])}

Provide authoritative, professional, practical guidance referencing MoSPI standard operating procedures, official statistical guidelines (e.g., SNA 2008, NSS survey designs, CPI base revisions), and recommend specific iGOT Karmayogi courses or NSSTA programmes when relevant. Format responses cleanly using markdown bullet points, bold text, and numbered lists where appropriate.`;

    const formattedHistory = messages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`).join('\n\n');
    const prompt = `Conversation history:\n${formattedHistory}\n\nPlease provide your helpful, accurate response as Karmayogi AI Assistant:`;

    try {
      const reply = await this.generateContent(prompt, systemPrompt);
      return { success: true, reply };
    } catch (error) {
      console.error('Copilot Chat Error:', error);
      return {
        success: false,
        error: error.message,
        reply: `Offline Fallback: For ${userContext.designation || 'MoSPI Officers'}, addressing key gaps in National Accounts and Survey Design is best achieved by enrolling in the recommended iGOT Karmayogi courses: "National Accounts Statistics — Methodology" and "Sample Survey Design & Estimation".`
      };
    }
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
      const responseText = await this.generateContent(prompt, systemPrompt, { jsonMode: true, temperature: 0.3, maxOutputTokens: 4096 });
      const cleaned = this._cleanJson(responseText);
      const parsed = JSON.parse(cleaned);
      return { success: true, data: parsed };
    } catch (error) {
      console.error('Pathway generation failed:', error);
      // Fallback structured data
      return {
        success: false,
        data: {
          pathwayTitle: `${currentRole} to ${targetRole} Progression Pathway`,
          executiveSummary: `Targeted capability roadmap bridging functional and statistical competencies for elevation to ${targetRole}.`,
          readinessScore: 68,
          targetTimeline,
          phases: [
            {
              phaseNumber: 1,
              title: "Core Statistical Foundations & Methodology",
              duration: "Months 1-4",
              objective: "Close critical gaps in National Accounts and Sample Survey Design.",
              competenciesTargeted: ["National Accounts Statistics", "Sample Survey Design"],
              recommendedIGOTCourses: [
                { id: "CRS002", title: "National Accounts Statistics — Concepts & Compilation", relevance: "Directly addresses critical gap in SNA 2008 framework" },
                { id: "CRS004", title: "Sample Survey Design & Estimation Techniques", relevance: "Strengthens survey sampling and weighting methodology" }
              ],
              recommendedNSSTAProgrammes: [
                { id: "NSSTA001", title: "National Accounts Statistics — Methodology & Practice", relevance: "Hands-on SUT compilation at NSSTA Greater Noida" }
              ],
              practicalMilestone: "Complete MoSPI pilot SUT exercise and submit verification report."
            },
            {
              phaseNumber: 2,
              title: "Digital Analytics & Modern Computing Tools",
              duration: "Months 5-8",
              objective: "Upskill in automated data validation, Python/R, and microdata processing.",
              competenciesTargeted: ["Python for Data Analysis", "Data Visualization & Dashboards"],
              recommendedIGOTCourses: [
                { id: "CRS001", title: "Python for Data Analysis in Government", relevance: "Automate routine statistical tabulations" },
                { id: "CRS007", title: "Data Visualization & Dashboard Design for Policy", relevance: "Design executive dashboards for ministerial reporting" }
              ],
              recommendedNSSTAProgrammes: [
                { id: "NSSTA004", title: "R Programming for Official Statistics", relevance: "Advanced statistical modeling" }
              ],
              practicalMilestone: "Build an automated quarterly statistical bulletin pipeline."
            },
            {
              phaseNumber: 3,
              title: "Strategic Leadership & Dissemination",
              duration: "Months 9-12",
              objective: "Master data governance, official release protocols, and SDG 2030 monitoring.",
              competenciesTargeted: ["Official Statistics Governance", "Public Policy Analytics"],
              recommendedIGOTCourses: [
                { id: "CRS006", title: "Data Governance & Quality Framework for Official Statistics", relevance: "NDSAP compliance and metadata standards" },
                { id: "CRS008", title: "Monitoring Sustainable Development Goals (SDGs)", relevance: "National Indicator Framework monitoring" }
              ],
              recommendedNSSTAProgrammes: [
                { id: "NSSTA005", title: "Leadership Development for Senior Statistical Officers", relevance: "Executive decision making and inter-ministerial coordination" }
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
        success: false,
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
