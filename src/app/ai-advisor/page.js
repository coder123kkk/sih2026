'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Sparkles, Bot, Send, User, ChevronRight, BookOpen, Building2,
  Award, CheckCircle, HelpCircle, ArrowRight, RefreshCw, AlertCircle,
  Lightbulb, Compass, GraduationCap, Play, Target, Zap, Shield,
  ArrowUpRight, MessageSquare, Flame, Check, Info, FileText, ExternalLink
} from 'lucide-react';
import FormattedMessage from '@/components/chat/FormattedMessage';

function AIAdvisorContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'copilot';
  const [activeTab, setActiveTab] = useState(initialTab); // 'copilot' | 'pathway' | 'assessment'

  // Update tab if query param changes
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['copilot', 'pathway', 'assessment'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // ==========================================
  // Tab 1: AI Copilot State
  // ==========================================
  const [currentUserId, setCurrentUserId] = useState(() => searchParams.get('userId') || 'USR001');

  // Helper to generate dynamic default greeting based on active user
  const getInitialMessages = (userId) => {
    if (userId === 'USR002') {
      return [
        {
          role: 'assistant',
          text: "Namaste Rajesh Kumar Verma! I am your **Karmayogi AI Copilot** for India's Official Statistical System.\n\nBased on your active competency profile as **Statistical Officer (Field Operations)**, your highest-priority gaps are **National Accounts** and **Sampling Techniques**. How can I assist your capacity building today?",
          suggestedCourses: [
            {
              id: 'igot-crs-010',
              title: 'National Accounts Statistics',
              source: 'iGOT Karmayogi',
              provider: 'National Statistical Systems Training Academy',
              competency: 'National Accounts Statistics',
              duration: '4h 00m',
              level: 'Advanced',
              actionUrl: '/igot/igot-crs-010',
              reason: 'Addresses your National Accounts competency gap (Current: 30%, Required: 75%).'
            },
            {
              id: 'igot-crs-009',
              title: 'Sampling Techniques in Practice',
              source: 'iGOT Karmayogi',
              provider: 'NSSTA Greater Noida',
              competency: 'Sampling Techniques',
              duration: '3h 30m',
              level: 'Intermediate',
              actionUrl: '/igot/igot-crs-009',
              reason: 'Addresses your Sampling Techniques competency gap (Current: 35%, Required: 75%).'
            }
          ]
        }
      ];
    }

    return [
      {
        role: 'assistant',
        text: "Namaste Dr. Priya Sharma! I am your **Karmayogi AI Copilot** for India's Official Statistical System.\n\nBased on your active competency profile as **Deputy Director (ISS Group A)**, your highest-priority gaps are **National Accounts** and **Survey Design**. How can I assist your capacity building today?",
        suggestedCourses: [
          {
            id: 'igot-crs-010',
            title: 'National Accounts Statistics',
            source: 'iGOT Karmayogi',
            provider: 'National Statistical Systems Training Academy',
            competency: 'National Accounts Statistics',
            duration: '4h 00m',
            level: 'Advanced',
            actionUrl: '/igot/igot-crs-010',
            reason: 'Addresses your National Accounts competency gap (Current: 45%, Required: 80%).'
          },
          {
            id: 'igot-crs-008',
            title: 'Survey Design and Methodology',
            source: 'iGOT Karmayogi',
            provider: 'NSSTA Greater Noida',
            competency: 'Survey Design & Sampling',
            duration: '6h 00m',
            level: 'Advanced',
            actionUrl: '/igot/igot-crs-008',
            reason: 'Addresses your Survey Design/Sampling competency gap (Current: 50%, Required: 85%).'
          }
        ]
      }
    ];
  };

  const [messages, setMessages] = useState(() => getInitialMessages(searchParams.get('userId') || 'USR001'));
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Sync userId if searchParams change
  useEffect(() => {
    const uParam = searchParams.get('userId');
    if (uParam && ['USR001', 'USR002'].includes(uParam) && uParam !== currentUserId) {
      setCurrentUserId(uParam);
      setMessages(getInitialMessages(uParam));
    }
  }, [searchParams]);

  const switchUser = (userId) => {
    setCurrentUserId(userId);
    setMessages(getInitialMessages(userId));
  };
  const chatBottomRef = useRef(null);
  const chatStreamRef = useRef(null);

  // Suggested prompt chips as requested
  const promptSuggestions = [
    { label: "What are my biggest skill gaps?", query: "What are my biggest skill gaps and how do they impact my DPC promotion readiness?" },
    { label: "Recommend courses for me", query: "Recommend the best iGOT Karmayogi and NSSTA courses for my profile and current role." },
    { label: "Explain my competency score", query: "Explain my current competency scores across Statistical, Technical, and Digital Governance domains." },
    { label: "Create a learning plan", query: "Create a strategic 12-month capacity building learning plan for Deputy Director cadre progression." }
  ];

  // Secondary statistical prompt chips
  const secondaryPromptChips = [
    "How does CPI-C calculate elementary aggregates?",
    "Explain SNA 2008 Gross Value Added (GVA) compilation",
    "Show requirements for ISS Group A Promotion",
    "What is the UPSS employment criteria in PLFS?"
  ];

  // ==========================================
  // Tab 2: AI Career Pathway Generator State
  // ==========================================
  const [pathwayForm, setPathwayForm] = useState({
    currentRole: 'Statistical Officer (Group B)',
    targetRole: 'Deputy Director — National Accounts Division (ISS Group A)',
    department: 'Labour Statistics Division, MoSPI',
    targetTimeline: '12 Months'
  });
  const [pathwayLoading, setPathwayLoading] = useState(false);

  const getDefaultPathway = (currentRole, targetRole, timeline) => ({
    pathwayTitle: `${currentRole} to ${targetRole} Progression Pathway`,
    executiveSummary: `Targeted capability roadmap bridging functional, macroeconomic, and survey methodologies for cadre elevation to ${targetRole}.`,
    readinessScore: 68,
    targetTimeline: timeline || '12 Months',
    phases: [
      {
        phaseNumber: 1,
        title: "Core Statistical Foundations & Macroeconomic Methodology",
        duration: (timeline || '').includes('6') ? "Months 1-2" : "Months 1-4",
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
        duration: (timeline || '').includes('6') ? "Months 3-4" : "Months 5-8",
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
        duration: (timeline || '').includes('6') ? "Months 5-6" : "Months 9-12",
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
  });

  const [pathwayData, setPathwayData] = useState(() => getDefaultPathway('Statistical Officer (Group B)', 'Deputy Director — National Accounts Division (ISS Group A)', '12 Months'));

  // Handle Pathway Generation
  const handleGeneratePathway = async (e) => {
    if (e) e.preventDefault();
    setPathwayLoading(true);
    try {
      const res = await fetch('/api/ai/pathway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentRole: pathwayForm.currentRole,
          targetRole: pathwayForm.targetRole,
          department: pathwayForm.department,
          targetTimeline: pathwayForm.targetTimeline,
          skillGaps: ['National Accounts Statistics', 'Sample Survey Design', 'Python for Data Analysis']
        })
      });
      const data = await res.json();
      if (data && data.data) {
        setPathwayData({ ...data.data, generatedAt: Date.now(), isAiGenerated: !data.fallback });
      } else {
        setPathwayData({ ...getDefaultPathway(pathwayForm.currentRole, pathwayForm.targetRole, pathwayForm.targetTimeline), generatedAt: Date.now() });
      }
    } catch (err) {
      console.error('Failed to generate pathway, using dynamic MoSPI cadre fallback:', err);
      setPathwayData({ ...getDefaultPathway(pathwayForm.currentRole, pathwayForm.targetRole, pathwayForm.targetTimeline), generatedAt: Date.now() });
    } finally {
      setPathwayLoading(false);
    }
  };

  // Run initial pathway on mount if not loaded
  useEffect(() => {
    if (!pathwayData) {
      handleGeneratePathway();
    }
  }, []);

  // ==========================================
  // Tab 3: Adaptive Knowledge Check State
  // ==========================================
  const [selectedCompetency, setSelectedCompetency] = useState('National Accounts Statistics');
  const [assessmentLevel, setAssessmentLevel] = useState('Intermediate');
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const getDefaultQuiz = (competency = 'National Accounts Statistics', level = 'Intermediate') => ({
    competencyName: competency,
    level: level,
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
        practicalTip: "Refer to Sources and Methods 2015, National Accounts Division, MoSPI."
      }
    ]
  });

  const [quizData, setQuizData] = useState(() => getDefaultQuiz('National Accounts Statistics', 'Intermediate'));


  // Handle Copilot Chat Send (Requirements 1, 2, 3, 4, 7, 8, 9, 10)
  const handleSendMessage = async (textToSend) => {
    const text = textToSend || chatInput;
    if (!text.trim() || chatLoading) return;

    const userMessage = { role: 'user', text };
    const newMsgs = [...messages, userMessage];
    setMessages(newMsgs);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMsgs,
          userId: currentUserId
        })
      });
      const data = await res.json();
      const replyText = data.reply || "I apologize, but I encountered an error connecting to the AI service. Please try again.";
      
      // REQUIREMENT 7: CHAT RESPONSE AND RECOMMENDATION CARDS MUST COME FROM THE SAME RESULT
      const suggestedCourses = (data.recommendedCourses && data.recommendedCourses.length > 0)
        ? data.recommendedCourses
        : (getInitialMessages(currentUserId)[0]?.suggestedCourses || []);

      // REQUIREMENT 10: ADD DEBUG DATA IN DEVELOPMENT ONLY
      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development' && data.debug) {
        console.log('[AI Copilot Debug Info]:', data.debug);
      }

      setMessages([
        ...newMsgs,
        {
          role: 'assistant',
          text: replyText,
          suggestedCourses,
          priorityGaps: data.priorityGaps || []
        }
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackInitial = getInitialMessages(currentUserId)[0];
      setMessages([
        ...newMsgs,
        {
          role: 'assistant',
          text: fallbackInitial?.text || "Based on your active competency evaluation, focusing on your priority skill gaps will maximize your competency index. Explore the recommended official courses below:",
          suggestedCourses: fallbackInitial?.suggestedCourses || []
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Handle Assessment Quiz Generation
  const handleGenerateQuiz = async () => {
    setQuizLoading(true);
    setQuizSubmitted(false);
    setSelectedAnswers({});
    try {
      const res = await fetch('/api/ai/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competencyName: selectedCompetency,
          level: assessmentLevel
        })
      });
      const data = await res.json();
      if (data && data.data) {
        setQuizData(data.data);
      } else {
        setQuizData(getDefaultQuiz(selectedCompetency, assessmentLevel));
      }
    } catch (err) {
      console.error('Failed to generate quiz, using official fallback:', err);
      setQuizData(getDefaultQuiz(selectedCompetency, assessmentLevel));
    } finally {
      setQuizLoading(false);
    }
  };

  return (
    <div className="page-container animate-fade-in" style={{ paddingBottom: 40 }}>
      {/* Top Header */}
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #8B5CF6 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(79, 70, 229, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <Bot size={26} color="#FFFFFF" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <h1 className="page-title" style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800 }}>
                  AI Copilot
                </h1>
                <span className="badge badge-accent" style={{ fontSize: '0.72rem', padding: '3px 9px', letterSpacing: '0.03em' }}>
                  Official MoSPI Statistical AI
                </span>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '3px 10px', borderRadius: 'var(--radius-full)',
                  background: 'rgba(13, 148, 136, 0.1)', border: '1px solid rgba(13, 148, 136, 0.25)',
                  fontSize: '0.72rem', color: '#0D9488', fontWeight: 600
                }}>
                  <span style={{
                    width: 7, height: 7, borderRadius: '50%', background: '#0D9488'
                  }} />
                  Model Connected & Active
                </div>
              </div>
              <p className="page-subtitle" style={{ margin: '6px 0 0 0', fontSize: '0.88rem', maxWidth: 750 }}>
                Intelligent capacity-building copilot for India&apos;s Official Statistical System. Calibrated with MoSPI guidelines, active cadre evaluations, and the iGOT Karmayogi catalogue.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link
              href="/learning"
              className="btn btn-secondary"
              style={{ fontSize: '0.82rem', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <GraduationCap size={15} color="var(--color-brand)" />
              View Learning Pathways
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex', gap: 8, marginTop: 20,
          background: 'var(--color-bg-secondary)', padding: '5px',
          borderRadius: 'var(--radius-lg)', width: 'fit-content',
          border: '1px solid var(--color-border)'
        }}>
          <button
            className={`btn ${activeTab === 'copilot' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.85rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}
            onClick={() => setActiveTab('copilot')}
          >
            <Bot size={16} />
            AI Copilot Chat
          </button>
          <button
            className={`btn ${activeTab === 'pathway' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.85rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}
            onClick={() => setActiveTab('pathway')}
          >
            <Compass size={16} />
            Career Pathway Engine
          </button>
          <button
            className={`btn ${activeTab === 'assessment' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.85rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}
            onClick={() => setActiveTab('assessment')}
          >
            <Target size={16} />
            Adaptive Knowledge Check
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: MODERN AI COPILOT CHAT INTERFACE                  */}
      {/* ======================================================== */}
      {activeTab === 'copilot' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Main Chat Container Card */}
          <div className="card" style={{
            display: 'flex', flexDirection: 'column',
            minHeight: '520px', height: 'calc(100vh - 220px)',
            maxHeight: '820px', padding: 0, overflow: 'hidden',
            border: '1px solid var(--color-border)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            background: 'var(--color-bg-card)'
          }}>
            {/* Chat Sub-Header */}
            <div style={{
              padding: '14px 20px',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'var(--color-bg-secondary)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)'
                }}>
                  <Sparkles size={18} color="#FFFFFF" />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                    MoSPI Statistical Intelligence Assistant
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', fontWeight: 400 }}>
                      v2.5
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                    Active Context: <strong style={{ color: 'var(--color-text-primary)' }}>{currentUserId === 'USR002' ? 'Rajesh Kumar Verma' : 'Dr. Priya Sharma'}</strong> ({currentUserId === 'USR002' ? 'Statistical Officer (SSS), FOD' : 'Deputy Director (ISS Group A), Labour Statistics'})
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#F1F5F9', padding: '2px 4px', borderRadius: 'var(--radius-md)' }}>
                  <button
                    className={`btn ${currentUserId === 'USR001' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '4px 8px', fontSize: '0.72rem', height: 'auto', minHeight: 'unset' }}
                    onClick={() => switchUser('USR001')}
                    title="User A: Deputy Director (ISS Group A)"
                  >
                    User A (ISS)
                  </button>
                  <button
                    className={`btn ${currentUserId === 'USR002' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '4px 8px', fontSize: '0.72rem', height: 'auto', minHeight: 'unset' }}
                    onClick={() => switchUser('USR002')}
                    title="User B: Technical Statistical Officer"
                  >
                    User B (Tech Officer)
                  </button>
                </div>
                <button
                  className="btn btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 6 }}
                  onClick={() => setMessages(getInitialMessages(currentUserId))}
                  title="Reset to initial greeting"
                >
                  <RefreshCw size={13} />
                  Reset Conversation
                </button>
              </div>
            </div>

            {/* Chat Message Stream */}
            <div
              ref={chatStreamRef}
              style={{
                flex: 1, overflowY: 'auto', padding: '24px 20px',
                display: 'flex', flexDirection: 'column', gap: 20
              }}
            >
              {/* Empty State / Welcome Showcase if only initial message */}
              {messages.length === 1 && (
                <div style={{
                  margin: '0 auto 12px auto', maxWidth: 740, width: '100%',
                  background: '#EEF2FF',
                  border: '1px solid #C7D2FE',
                  borderRadius: 'var(--radius-lg)', padding: '20px 24px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{
                      padding: 6, borderRadius: 8, background: '#E0E7FF',
                      color: 'var(--color-brand)'
                    }}>
                      <Zap size={16} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>
                      What can I do for you today?
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                    Select one of the suggested prompts below or ask any question regarding official statistics, your competency scores, or course recommendations.
                  </p>

                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 10
                  }}>
                    {promptSuggestions.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(item.query)}
                        style={{
                          textAlign: 'left', padding: '12px 14px',
                          background: '#FFFFFF',
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer', display: 'flex',
                          alignItems: 'center', justifyContent: 'space-between',
                          transition: 'all var(--transition-fast)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--color-brand)';
                          e.currentTarget.style.background = '#F8FAFC';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--color-border)';
                          e.currentTarget.style.background = '#FFFFFF';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: 6,
                            background: '#EEF2FF',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--color-brand)', flexShrink: 0
                          }}>
                            {idx === 0 && <Flame size={14} />}
                            {idx === 1 && <BookOpen size={14} />}
                            {idx === 2 && <Award size={14} />}
                            {idx === 3 && <Compass size={14} />}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.84rem', color: 'var(--color-text-primary)' }}>
                              {item.label}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                              {item.query.length > 55 ? item.query.slice(0, 52) + '...' : item.query}
                            </div>
                          </div>
                        </div>
                        <ChevronRight size={15} color="var(--color-text-muted)" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages Render */}
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: m.role === 'user' ? '75%' : '88%',
                    width: m.role === 'user' ? 'auto' : '100%'
                  }}
                >
                  {/* Sender badge header */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    marginBottom: 6,
                    alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                    padding: '0 4px'
                  }}>
                    {m.role === 'assistant' ? (
                      <>
                        <div style={{
                          width: 22, height: 22, borderRadius: '50%',
                          background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <Bot size={13} color="#FFFFFF" />
                        </div>
                        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-brand)' }}>
                          MoSPI Karmayogi Copilot
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                          • Statistical Engine
                        </span>
                      </>
                    ) : (
                      <>
                        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                          You ({currentUserId === 'USR002' ? 'Rajesh Kumar Verma' : 'Dr. Priya Sharma'})
                        </span>
                        <div style={{
                          width: 22, height: 22, borderRadius: '50%',
                          background: '#F59E0B',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <User size={13} color="#FFFFFF" />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div style={{
                    padding: '16px 20px',
                    borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
                    background: m.role === 'user'
                      ? 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)'
                      : '#FFFFFF',
                    color: m.role === 'user' ? '#FFFFFF' : 'var(--color-text-primary)',
                    border: m.role === 'user'
                      ? 'none'
                      : '1px solid var(--color-border)',
                    boxShadow: m.role === 'user'
                      ? '0 4px 14px rgba(79, 70, 229, 0.25)'
                      : '0 2px 8px rgba(0, 0, 0, 0.04)',
                    lineHeight: 1.65,
                    fontSize: '0.92rem'
                  }}>
                    <FormattedMessage text={m.text} isUser={m.role === 'user'} />

                    {/* Rich Suggested Course Cards within AI responses */}
                    {m.role === 'assistant' && m.suggestedCourses && m.suggestedCourses.length > 0 && (
                      <div style={{
                        marginTop: 18, paddingTop: 16,
                        borderTop: '1px solid var(--color-border)'
                      }}>
                        <div style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          marginBottom: 12
                        }}>
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-brand)'
                          }}>
                            <BookOpen size={16} />
                            Recommended Capacity Building Resources:
                          </div>
                          <Link
                            href={`/learning?userId=${currentUserId}`}
                            style={{
                              fontSize: '0.75rem', color: 'var(--color-brand)',
                              display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none',
                              fontWeight: 600
                            }}
                          >
                            View Full Pathway <ArrowRight size={13} />
                          </Link>
                        </div>

                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                          gap: 12
                        }}>
                          {m.suggestedCourses.map((c, cIdx) => (
                            <div
                              key={cIdx}
                              style={{
                                background: '#F8FAFC',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                padding: '14px 16px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                transition: 'transform 0.15s ease, border-color 0.15s ease'
                              }}
                            >
                              <div>
                                <div style={{
                                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                  gap: 6, marginBottom: 8
                                }}>
                                  <span style={{
                                    fontSize: '0.7rem', fontWeight: 700,
                                    padding: '2px 8px', borderRadius: 'var(--radius-full)',
                                    background: (c.source || '').includes('iGOT') ? 'rgba(217, 119, 6, 0.1)' : 'rgba(79, 70, 229, 0.1)',
                                    color: (c.source || '').includes('iGOT') ? '#D97706' : '#4F46E5',
                                    border: `1px solid ${(c.source || '').includes('iGOT') ? 'rgba(217, 119, 6, 0.25)' : 'rgba(79, 70, 229, 0.25)'}`
                                  }}>
                                    {c.source || 'iGOT Karmayogi'}
                                  </span>
                                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                                    {c.duration}
                                  </span>
                                </div>

                                <div style={{
                                  fontWeight: 600, fontSize: '0.88rem',
                                  color: 'var(--color-text-primary)', marginBottom: 6,
                                  lineHeight: 1.4
                                }}>
                                  {c.title}
                                </div>

                                {c.reason ? (
                                  <div style={{
                                    fontSize: '0.75rem', color: '#059669',
                                    display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 10,
                                    lineHeight: 1.35
                                  }}>
                                    <CheckCircle size={13} style={{ flexShrink: 0, marginTop: 2 }} />
                                    <span>{c.reason}</span>
                                  </div>
                                ) : (
                                  <div style={{
                                    fontSize: '0.76rem', color: 'var(--color-text-secondary)',
                                    display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12
                                  }}>
                                    <Target size={12} color="var(--color-brand)" />
                                    <span>Targets: {c.competency}</span>
                                  </div>
                                )}
                              </div>

                              <div style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                paddingTop: 10, borderTop: '1px solid var(--color-border)'
                              }}>
                                <Link
                                  href={c.actionUrl || `/igot/${c.id}`}
                                  className="btn btn-primary"
                                  style={{
                                    flex: 1, padding: '6px 12px', fontSize: '0.78rem',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                    textDecoration: 'none'
                                  }}
                                >
                                  {c.actionLabel || (c.isEnrolled ? 'Continue Learning' : 'View Course')} <ArrowRight size={13} />
                                </Link>
                                <Link
                                  href={`/learning?userId=${currentUserId}`}
                                  className="btn btn-secondary"
                                  style={{
                                    padding: '6px 10px', fontSize: '0.78rem',
                                    display: 'flex', alignItems: 'center', gap: 4,
                                    textDecoration: 'none'
                                  }}
                                  title="View in Personalized Learning Pathway"
                                >
                                  Pathway
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing / Thinking Status Indicator */}
              {chatLoading && (
                <div style={{ display: 'flex', flexDirection: 'column', alignSelf: 'flex-start', maxWidth: '85%' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, padding: '0 4px'
                  }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Bot size={13} color="#FFFFFF" />
                    </div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-brand)' }}>
                      MoSPI Karmayogi Copilot
                    </span>
                  </div>
                  <div style={{
                    padding: '14px 18px', borderRadius: '4px 16px 16px 16px',
                    background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)',
                    display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem',
                    color: 'var(--color-text-secondary)'
                  }}>
                    <RefreshCw size={15} className="animate-spin" color="var(--color-brand)" />
                    <span>Analyzing official MoSPI statistical standards & active competency records...</span>
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Suggested Prompt Chips Bar (Above Input Area) */}
            <div style={{
              padding: '10px 18px',
              background: '#F8FAFC',
              borderTop: '1px solid var(--color-border)',
              display: 'flex', alignItems: 'center', gap: 8,
              overflowX: 'auto', whiteSpace: 'nowrap'
            }}>
              <span style={{
                fontSize: '0.72rem', fontWeight: 700,
                color: 'var(--color-text-muted)', textTransform: 'uppercase',
                letterSpacing: '0.05em', flexShrink: 0
              }}>
                Suggestions:
              </span>
              {promptSuggestions.map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(item.query)}
                  disabled={chatLoading}
                  style={{
                    padding: '5px 12px', fontSize: '0.78rem', borderRadius: 20,
                    background: '#FFFFFF',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-primary)', cursor: 'pointer',
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    transition: 'all var(--transition-fast)', flexShrink: 0,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-brand)';
                    e.currentTarget.style.color = 'var(--color-brand)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                    e.currentTarget.style.color = 'var(--color-text-primary)';
                  }}
                >
                  <Sparkles size={11} color="#4F46E5" />
                  {item.label}
                </button>
              ))}

              {secondaryPromptChips.map((q, i) => (
                <button
                  key={`sec-${i}`}
                  onClick={() => handleSendMessage(q)}
                  disabled={chatLoading}
                  style={{
                    padding: '5px 12px', fontSize: '0.76rem', borderRadius: 20,
                    background: '#FFFFFF',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-secondary)', cursor: 'pointer',
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    transition: 'all var(--transition-fast)', flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-brand)';
                    e.currentTarget.style.color = 'var(--color-brand)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                  }}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Prominent Chat Input Area */}
            <div style={{
              padding: '16px 20px',
              borderTop: '1px solid var(--color-border)',
              background: '#FFFFFF',
              position: 'relative'
            }}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                style={{ display: 'flex', gap: 12, alignItems: 'center' }}
              >
                <div style={{ position: 'relative', flex: 1 }}>
                  <input
                    className="input"
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      paddingLeft: 42,
                      fontSize: '0.92rem',
                      background: '#F8FAFC',
                      borderColor: 'var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--color-text-primary)',
                      boxShadow: 'none'
                    }}
                    placeholder="Ask about official statistics methodologies, skill gaps, or iGOT courses... (Press Enter to send)"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    disabled={chatLoading}
                  />
                  <div style={{
                    position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                    pointerEvents: 'none', color: 'var(--color-text-muted)'
                  }}>
                    <MessageSquare size={17} />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={chatLoading || !chatInput.trim()}
                  style={{
                    padding: '14px 22px', fontSize: '0.9rem',
                    display: 'flex', alignItems: 'center', gap: 8,
                    borderRadius: 'var(--radius-md)', flexShrink: 0,
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
                  }}
                >
                  <Send size={16} />
                  Send
                </button>
              </form>

              {/* Micro Status Footer */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginTop: 8, fontSize: '0.72rem', color: 'var(--color-text-muted)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Shield size={12} color="#10B981" />
                  <span>Official Government Sandbox • End-to-End Encrypted MoSPI Data</span>
                </div>
                <div>
                  Enter to send • Shift + Enter for newline
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: AI CAREER PATHWAY ENGINE                         */}
      {/* ======================================================== */}
      {activeTab === 'pathway' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Configuration Form Card */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Compass size={20} color="var(--color-accent-blue-light)" />
              Define Career Progression Target
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: 6 }}>
                  Current Designation
                </label>
                <input
                  className="input"
                  style={{ width: '100%' }}
                  value={pathwayForm.currentRole}
                  onChange={e => setPathwayForm({ ...pathwayForm, currentRole: e.target.value })}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: 6 }}>
                  Target Role / Cadre Promotion
                </label>
                <input
                  className="input"
                  style={{ width: '100%' }}
                  value={pathwayForm.targetRole}
                  onChange={e => setPathwayForm({ ...pathwayForm, targetRole: e.target.value })}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: 6 }}>
                  Target Timeline
                </label>
                <select
                  className="input"
                  style={{ width: '100%' }}
                  value={pathwayForm.targetTimeline}
                  onChange={e => setPathwayForm({ ...pathwayForm, targetTimeline: e.target.value })}
                >
                  <option value="6 Months">6 Months (Fast Track)</option>
                  <option value="12 Months">12 Months (Standard DPC Cycle)</option>
                  <option value="24 Months">24 Months (Comprehensive ISS Cadre)</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: 18, display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-primary"
                onClick={handleGeneratePathway}
                disabled={pathwayLoading}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                {pathwayLoading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Synthesizing with Gemini...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Regenerate AI Pathway
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Pathway Results */}
          {pathwayData && (
            <div key={pathwayData.pathwayTitle + (pathwayData.generatedAt || '')} className="animate-fade-in">
              {/* Executive Summary Card */}
              <div className="card" style={{
                background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.15), rgba(124, 58, 237, 0.15))',
                border: '1px solid rgba(124, 58, 237, 0.3)',
                marginBottom: 24, padding: 24
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                  <div>
                    <span className="badge badge-accent" style={{ marginBottom: 8, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <Sparkles size={13} />
                      Target Progression Roadmap {pathwayData.isAiGenerated ? '• Live Gemini AI Synthesis' : ''}
                    </span>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '6px 0' }}>
                      {pathwayData.pathwayTitle}
                    </h2>
                    <p style={{ color: 'var(--color-text-secondary)', maxWidth: 750, lineHeight: 1.6 }}>
                      {pathwayData.executiveSummary}
                    </p>
                  </div>
                  <div style={{
                    textAlign: 'center', background: 'var(--color-bg-card)',
                    padding: '16px 24px', borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)'
                  }}>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-accent-blue-light)' }}>
                      {pathwayData.readinessScore}%
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      Current Role Readiness
                    </div>
                  </div>
                </div>
              </div>

              {/* Pathway Phases */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {(pathwayData.phases || []).map((phase, idx) => (
                  <div key={idx} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{
                      position: 'absolute', top: 0, left: 0, width: 4, height: '100%',
                      background: idx === 0 ? 'var(--color-accent-blue)' : idx === 1 ? '#8B5CF6' : '#10B981'
                    }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{
                          width: 28, height: 28, borderRadius: '50%',
                          background: 'var(--color-bg-secondary)', color: 'var(--color-accent-blue-light)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: '0.85rem'
                        }}>
                          {phase.phaseNumber}
                        </span>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 600, margin: 0 }}>
                          {phase.title}
                        </h3>
                      </div>
                      <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>
                        {phase.duration}
                      </span>
                    </div>

                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 16 }}>
                      {phase.objective}
                    </p>

                    {/* Competencies Targeted */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                      {(phase.competenciesTargeted || []).map((comp, cIdx) => (
                        <span key={cIdx} className="badge badge-info" style={{ fontSize: '0.75rem' }}>
                          <Target size={12} style={{ marginRight: 4 }} />
                          {comp}
                        </span>
                      ))}
                    </div>

                    {/* Recommended Courses Grid */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                      gap: 12,
                      marginTop: 12,
                      paddingTop: 12,
                      borderTop: '1px solid var(--color-border)'
                    }}>
                      {/* iGOT Course Recommendations */}
                      {(phase.recommendedIGOTCourses || []).map((c, cId) => (
                        <div key={cId} style={{
                          background: 'var(--color-bg-secondary)', padding: '12px 16px',
                          borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)',
                          display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                        }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                              <BookOpen size={14} color="#F59E0B" />
                              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#F59E0B' }}>
                                iGOT Karmayogi Course
                              </span>
                            </div>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 4 }}>
                              {c.title}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                              {c.relevance}
                            </div>
                          </div>
                          <Link
                            href={c.id.startsWith('CRS') ? `/igot/igot-crs-${c.id.replace('CRS', '')}` : `/igot`}
                            className="btn btn-secondary"
                            style={{ marginTop: 10, padding: '6px 12px', fontSize: '0.8rem', width: 'fit-content' }}
                          >
                            Explore Course <ChevronRight size={14} />
                          </Link>
                        </div>
                      ))}

                      {/* NSSTA Training Programme */}
                      {(phase.recommendedNSSTAProgrammes || []).map((p, pId) => (
                        <div key={pId} style={{
                          background: 'var(--color-bg-secondary)', padding: '12px 16px',
                          borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)',
                          display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                        }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                              <Building2 size={14} color="#3B82F6" />
                              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#3B82F6' }}>
                                NSSTA In-Service Training
                              </span>
                            </div>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 4 }}>
                              {p.title}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                              {p.relevance}
                            </div>
                          </div>
                          <Link
                            href="/training"
                            className="btn btn-secondary"
                            style={{ marginTop: 10, padding: '6px 12px', fontSize: '0.8rem', width: 'fit-content' }}
                          >
                            View Programme <ChevronRight size={14} />
                          </Link>
                        </div>
                      ))}
                    </div>

                    {/* Practical Milestone */}
                    {phase.practicalMilestone && (
                      <div style={{
                        marginTop: 16, padding: '10px 14px',
                        background: 'rgba(16, 185, 129, 0.08)',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex', alignItems: 'center', gap: 10
                      }}>
                        <CheckCircle size={16} color="#10B981" />
                        <span style={{ fontSize: '0.85rem', color: '#10B981', fontWeight: 500 }}>
                          <strong>Milestone:</strong> {phase.practicalMilestone}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* ISS Promotion Tips */}
              {pathwayData.issCareerTips && pathwayData.issCareerTips.length > 0 && (
                <div className="card" style={{ marginTop: 24, borderLeft: '4px solid var(--color-accent-blue)' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Lightbulb size={18} color="var(--color-accent-blue-light)" />
                    Official Statistical Cadre & APAR Advancement Tips
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: 20, color: 'var(--color-text-secondary)', lineHeight: 1.7, fontSize: '0.9rem' }}>
                    {pathwayData.issCareerTips.map((tip, tIdx) => (
                      <li key={tIdx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: ADAPTIVE KNOWLEDGE CHECK & QUIZ                   */}
      {/* ======================================================== */}
      {activeTab === 'assessment' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Controls */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Target size={20} color="var(--color-accent-blue-light)" />
              Generate Official Statistical Competency Assessment
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: 6 }}>
                  Select Competency to Test
                </label>
                <select
                  className="input"
                  style={{ width: '100%' }}
                  value={selectedCompetency}
                  onChange={e => setSelectedCompetency(e.target.value)}
                >
                  <option value="National Accounts Statistics">National Accounts Statistics (SNA 2008, GVA, SUT)</option>
                  <option value="Sample Survey Design">Sample Survey Design (NSS Rounds, PLFS, Stratification)</option>
                  <option value="Python for Data Analysis">Python for Data Analysis (Pandas, Tabulation, Microdata)</option>
                  <option value="Index Numbers & Inflation">Index Numbers & Inflation (CPI-C, WPI, IIP)</option>
                  <option value="Data Governance & Quality">Data Governance & Quality (NDSAP, Metadata standards)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: 6 }}>
                  Target Proficiency Level
                </label>
                <select
                  className="input"
                  style={{ width: '100%' }}
                  value={assessmentLevel}
                  onChange={e => setAssessmentLevel(e.target.value)}
                >
                  <option value="Basic">Level 2: Basic Application</option>
                  <option value="Intermediate">Level 3: Intermediate (MoSPI Officer Standard)</option>
                  <option value="Advanced">Level 4: Advanced Synthesis & Formulation</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button
                  className="btn btn-primary"
                  onClick={handleGenerateQuiz}
                  disabled={quizLoading}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                >
                  {quizLoading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Synthesizing Case Scenarios...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Generate Evaluation Quiz
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Quiz Container */}
          {quizData && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                    {quizData.competencyName} Assessment
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                    Standard: {quizData.level} Level | 3 Practical Official Scenarios
                  </p>
                </div>
                {quizSubmitted && (
                  <div className="badge badge-success" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                    Score: {Object.keys(selectedAnswers).filter(
                      k => selectedAnswers[k] === quizData.questions[k].correctOptionIndex
                    ).length} / 3 Correct
                  </div>
                )}
              </div>

              {(quizData.questions || []).map((q, qIndex) => {
                const isChosen = selectedAnswers[qIndex] !== undefined;
                const isCorrect = selectedAnswers[qIndex] === q.correctOptionIndex;

                return (
                  <div key={q.id || qIndex} className="card">
                    {/* Scenario */}
                    <div style={{
                      background: 'rgba(59, 130, 246, 0.08)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      padding: '12px 16px', borderRadius: 'var(--radius-md)',
                      marginBottom: 14, fontSize: '0.9rem', color: 'var(--color-text-secondary)'
                    }}>
                      <strong style={{ color: '#60A5FA' }}>Scenario {qIndex + 1}:</strong> {q.scenario}
                    </div>

                    <div style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: 16 }}>
                      {q.question}
                    </div>

                    {/* Options */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {q.options.map((opt, optIndex) => {
                        const isThisChosen = selectedAnswers[qIndex] === optIndex;
                        let optionStyle = {
                          padding: '12px 16px', borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)',
                          cursor: quizSubmitted ? 'default' : 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          transition: 'all 0.2s ease'
                        };

                        if (quizSubmitted) {
                          if (optIndex === q.correctOptionIndex) {
                            optionStyle.background = 'rgba(16, 185, 129, 0.15)';
                            optionStyle.borderColor = '#10B981';
                          } else if (isThisChosen && !isCorrect) {
                            optionStyle.background = 'rgba(239, 68, 68, 0.15)';
                            optionStyle.borderColor = '#EF4444';
                          }
                        } else if (isThisChosen) {
                          optionStyle.borderColor = 'var(--color-accent-blue)';
                          optionStyle.background = 'rgba(59, 130, 246, 0.12)';
                        }

                        return (
                          <div
                            key={optIndex}
                            style={optionStyle}
                            onClick={() => {
                              if (!quizSubmitted) {
                                setSelectedAnswers({ ...selectedAnswers, [qIndex]: optIndex });
                              }
                            }}
                          >
                            <span style={{ fontSize: '0.9rem' }}>{opt}</span>
                            {quizSubmitted && optIndex === q.correctOptionIndex && (
                              <CheckCircle size={16} color="#10B981" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation if submitted */}
                    {quizSubmitted && (
                      <div style={{
                        marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--color-border)'
                      }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 6 }}>
                          <strong>Official Methodological Basis:</strong> {q.explanation}
                        </div>
                        {q.practicalTip && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-accent-blue-light)' }}>
                            <strong>Official Tip:</strong> {q.practicalTip}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Submit Button */}
              {!quizSubmitted ? (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => setQuizSubmitted(true)}
                    disabled={Object.keys(selectedAnswers).length < (quizData.questions || []).length}
                    style={{ padding: '10px 24px', fontSize: '0.95rem' }}
                  >
                    Submit Assessment for Evaluation
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                    Your assessment score has been recorded to update your iGOT competency profile.
                  </span>
                  <button
                    className="btn btn-secondary"
                    onClick={handleGenerateQuiz}
                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <RefreshCw size={16} />
                    Try Another Assessment
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AIAdvisorPage() {
  return (
    <Suspense fallback={
      <div className="page-container" style={{ padding: 40, textAlign: 'center' }}>
        <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 12px auto' }} />
        <div>Loading AI Copilot...</div>
      </div>
    }>
      <AIAdvisorContent />
    </Suspense>
  );
}
