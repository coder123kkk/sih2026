'use client';
import { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  GraduationCap, BookOpen, Clock, Award, CheckCircle,
  Play, ExternalLink, ChevronRight, BarChart2, Filter,
  Target, Sparkles, Building2, Flame, AlertCircle, ArrowRight,
  TrendingUp, Check, Layers, RefreshCw, X, HelpCircle
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

function LearningPageContent() {
  const searchParams = useSearchParams();
  const initialCompetencyFilter = searchParams.get('competency') || '';

  const [enrollments, setEnrollments] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [competencyProfile, setCompetencyProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'in-progress' | 'recommended' | 'completed'
  const [domainFilter, setDomainFilter] = useState('all'); // 'all' | 'statistical' | 'technical' | 'digital-governance' | 'behavioural'
  const [competencyQuery, setCompetencyQuery] = useState(initialCompetencyFilter);

  useEffect(() => {
    if (initialCompetencyFilter) {
      setCompetencyQuery(initialCompetencyFilter);
    }
  }, [initialCompetencyFilter]);

  const targetUserId = searchParams.get('userId') || 'USR001';

  // Fetch all learning, recommendation, and competency data in parallel
  useEffect(() => {
    Promise.all([
      fetch(`/api/igot/learner?userId=${targetUserId}`).then(r => r.json()).catch(() => ({ enrollments: [] })),
      fetch(`/api/recommendations?userId=${targetUserId}`).then(r => r.json()).catch(() => ({ igot: [], nssta: [] })),
      fetch(`/api/competencies?userId=${targetUserId}`).then(r => r.json()).catch(() => null)
    ])
      .then(([learnerData, recData, compData]) => {
        setEnrollments(learnerData.enrollments || []);
        setRecommendations(recData || { igot: [], nssta: [] });
        setCompetencyProfile(compData || null);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load learning data:', err);
        setLoading(false);
      });
  }, []);

  // Transform enrollments & recommendations into unified pathway items
  const pathwayItems = useMemo(() => {
    const items = [];
    const seenIds = new Set();

    // 1. Add enrolled courses (In Progress and Completed)
    (enrollments || []).forEach(e => {
      seenIds.add(e.id || e.courseId);
      const isCompleted = e.completionStatus === 'completed';
      const compName = e.competencies?.[0]?.name || 'Statistical Methodology';
      const category = (e.category || compName || '').toLowerCase().includes('python') || (compName || '').toLowerCase().includes('tech') || (compName || '').toLowerCase().includes('cloud')
        ? 'technical'
        : (compName || '').toLowerCase().includes('governance') || (compName || '').toLowerCase().includes('security')
        ? 'digital-governance'
        : (compName || '').toLowerCase().includes('management') || (compName || '').toLowerCase().includes('leadership')
        ? 'behavioural'
        : 'statistical';

      items.push({
        id: e.id || e.courseId,
        title: e.title,
        source: 'iGOT Karmayogi',
        sourceType: 'igot',
        provider: e.provider || 'Capacity Building Commission',
        competency: compName,
        category: category,
        currentLevel: isCompleted ? 'Level 4' : 'Level 2',
        targetLevel: 'Level 4',
        duration: e.duration || '3h 30m',
        progress: e.completionPercentage || (isCompleted ? 100 : 0),
        status: isCompleted ? 'completed' : 'in-progress',
        assessmentScore: e.assessmentScore || null,
        reason: isCompleted
          ? 'Completed as core prerequisite for Deputy Director Cadre advancement'
          : `Active capacity building step addressing key gap in ${compName}`,
        actionUrl: `/igot/${e.id || e.courseId}`
      });
    });

    // 2. Add recommended iGOT courses
    (recommendations?.igot || []).forEach((rec, idx) => {
      const course = rec.course;
      if (course && !seenIds.has(course.id)) {
        seenIds.add(course.id);
        const comp = course.competencies?.[0]?.name || course.skills?.[0] || 'Statistical Analysis';
        const category = (course.category || comp || '').toLowerCase().includes('python') || (comp || '').toLowerCase().includes('tech') || (comp || '').toLowerCase().includes('cloud') || (comp || '').toLowerCase().includes('gis')
          ? 'technical'
          : (course.category || comp || '').toLowerCase().includes('governance') || (comp || '').toLowerCase().includes('security')
          ? 'digital-governance'
          : (course.category || comp || '').toLowerCase().includes('management') || (comp || '').toLowerCase().includes('leadership')
          ? 'behavioural'
          : 'statistical';

        items.push({
          id: course.id,
          title: course.title,
          source: 'iGOT Karmayogi',
          sourceType: 'igot',
          provider: course.provider || 'iGOT Karmayogi Platform',
          competency: comp,
          category: category,
          currentLevel: 'Level 1',
          targetLevel: 'Level 3',
          duration: course.duration || '4h 00m',
          progress: 0,
          status: 'recommended',
          reason: rec.reason || `Recommended to resolve high-priority skill gap in ${comp}`,
          actionUrl: `/igot/${course.id}`
        });
      }
    });

    // 3. Add recommended NSSTA programmes
    (recommendations?.nssta || []).forEach((rec, idx) => {
      const prog = rec.programme;
      if (prog && !seenIds.has(prog.id)) {
        seenIds.add(prog.id);
        const comp = prog.competencies?.[0]?.name || 'Official Statistics';
        items.push({
          id: prog.id,
          title: prog.title,
          source: 'NSSTA Training',
          sourceType: 'nssta',
          provider: prog.institution || 'NSSTA Greater Noida',
          competency: comp,
          category: 'statistical',
          currentLevel: 'Level 2',
          targetLevel: 'Level 4',
          duration: prog.duration || '2 Weeks',
          progress: 0,
          status: 'recommended',
          reason: rec.reason || `Mandatory in-service training for ISS Cadre promotion to Joint Director`,
          actionUrl: '/training'
        });
      }
    });

    return items;
  }, [enrollments, recommendations]);

  // Compute pathway stats
  const stats = useMemo(() => {
    const total = pathwayItems.length;
    const completed = pathwayItems.filter(i => i.status === 'completed').length;
    const inProgress = pathwayItems.filter(i => i.status === 'in-progress').length;
    const recommended = pathwayItems.filter(i => i.status === 'recommended').length;

    // Calculate total weighted progress
    const totalProgressPoints = pathwayItems.reduce((acc, curr) => acc + (curr.progress || 0), 0);
    const overallProgressPercent = total > 0 ? Math.round(totalProgressPoints / total) : 64;

    return {
      total,
      completed,
      inProgress,
      recommended,
      overallProgressPercent,
      currentLevelLabel: 'Level 2.8 (Intermediate)',
      targetLevelLabel: 'Level 4.0 (Advanced Cadre)',
      completedHours: 48,
      estimatedRemainingHours: 36
    };
  }, [pathwayItems]);

  // Top skill gaps from competency profile
  const priorityGaps = useMemo(() => {
    if (competencyProfile?.topGaps && competencyProfile.topGaps.length > 0) {
      return competencyProfile.topGaps.slice(0, 4);
    }
    return [
      { id: 'COMP_METADATA', name: 'Metadata Standards', gapSeverity: 'high', gapScore: 25, currentLevel: 2, requiredLevel: 4 },
      { id: 'COMP_GIS', name: 'GIS', gapSeverity: 'high', gapScore: 37, currentLevel: 1, requiredLevel: 3 },
      { id: 'COMP_AI_ML', name: 'AI/ML', gapSeverity: 'high', gapScore: 45, currentLevel: 1, requiredLevel: 3 },
      { id: 'COMP_NATIONAL_ACCOUNTS', name: 'National Accounts', gapSeverity: 'medium', gapScore: 15, currentLevel: 3, requiredLevel: 4 }
    ];
  }, [competencyProfile]);

  // Filtered items based on active tabs & search
  const filteredItems = useMemo(() => {
    return pathwayItems.filter(item => {
      // Status filter
      if (statusFilter === 'in-progress' && item.status !== 'in-progress') return false;
      if (statusFilter === 'completed' && item.status !== 'completed') return false;
      if (statusFilter === 'recommended' && item.status !== 'recommended') return false;

      // Domain filter
      if (domainFilter !== 'all' && item.category !== domainFilter) return false;

      // Competency text query filter
      if (competencyQuery.trim()) {
        const query = competencyQuery.toLowerCase().trim();
        const matchesComp = (item.competency || '').toLowerCase().includes(query);
        const matchesTitle = (item.title || '').toLowerCase().includes(query);
        if (!matchesComp && !matchesTitle) return false;
      }

      return true;
    });
  }, [pathwayItems, statusFilter, domainFilter, competencyQuery]);

  if (loading) {
    return (
      <div className="page-container" style={{ padding: 40, textAlign: 'center' }}>
        <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 16px auto', color: 'var(--color-accent-blue)' }} />
        <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Loading Personalized Learning Pathway...</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: 4 }}>
          Synthesizing competency framework, iGOT enrollments, and NSSTA calendar
        </div>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in" style={{ paddingBottom: 48 }}>
      {/* Top Header */}
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #10B981 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(59, 130, 246, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              <GraduationCap size={26} color="#FFFFFF" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <h1 className="page-title" style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800 }}>
                  My Learning Pathway
                </h1>
                <span className="badge badge-accent" style={{ fontSize: '0.72rem', padding: '3px 9px' }}>
                  Personalized Roadmap
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                  Cadre: <strong>Deputy Director (Labour Statistics)</strong>
                </span>
              </div>
              <p className="page-subtitle" style={{ margin: '6px 0 0 0', fontSize: '0.88rem', maxWidth: 780 }}>
                Visual official capacity-building progression. Tracks your active courses, identified skill gaps, and strategic milestones for ISS Group A cadre advancement.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link
              href="/ai-advisor"
              className="btn btn-secondary"
              style={{ fontSize: '0.82rem', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Sparkles size={15} color="#60A5FA" />
              Ask AI Copilot
            </Link>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. TOP PATHWAY METRICS DASHBOARD                         */}
      {/* ======================================================== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 16,
        marginBottom: 24
      }}>
        {/* Card 1: Overall Pathway Progress */}
        <div className="card" style={{ padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Pathway Progress
            </span>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: 'rgba(59, 130, 246, 0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60A5FA'
            }}>
              <TrendingUp size={17} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-accent-blue-light)' }}>
              {stats.overallProgressPercent}%
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              ({stats.completed} of {stats.total} items completed)
            </span>
          </div>
          <div className="progress-bar-container" style={{ height: 6, background: 'rgba(255, 255, 255, 0.08)' }}>
            <div
              className="progress-bar-fill"
              style={{
                width: `${stats.overallProgressPercent}%`,
                background: 'linear-gradient(90deg, #3B82F6 0%, #10B981 100%)'
              }}
            />
          </div>
        </div>

        {/* Card 2: Current Competency Level */}
        <div className="card" style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Current Competency
            </span>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: 'rgba(245, 158, 11, 0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B'
            }}>
              <Award size={17} />
            </div>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-accent-gold-light)', marginBottom: 4 }}>
            {stats.currentLevelLabel}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
            Score: <strong style={{ color: 'var(--color-text-primary)' }}>{competencyProfile?.overallScore || 82}%</strong> (MoSPI Baseline)
          </div>
        </div>

        {/* Card 3: Target Competency Level */}
        <div className="card" style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Target Competency
            </span>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981'
            }}>
              <Target size={17} />
            </div>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10B981', marginBottom: 4 }}>
            {stats.targetLevelLabel}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
            Target Benchmark: <strong style={{ color: 'var(--color-text-primary)' }}>90%</strong> (Cadre Benchmark)
          </div>
        </div>

        {/* Card 4: Estimated Learning Time */}
        <div className="card" style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Estimated Learning Time
            </span>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: 'rgba(139, 92, 246, 0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A78BFA'
            }}>
              <Clock size={17} />
            </div>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#A78BFA', marginBottom: 4 }}>
            ~{stats.estimatedRemainingHours}h Remaining
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
            {stats.completedHours}h completed across iGOT modules
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. VISUAL 5-STAGE PROGRESSION TIMELINE                   */}
      {/* ======================================================== */}
      <div className="card" style={{
        marginBottom: 24, padding: '20px 24px',
        background: 'linear-gradient(135deg, #EEF2FF 0%, #F0FDF4 100%)',
        border: '1px solid #C7D2FE',
        boxShadow: '0 2px 10px rgba(79, 70, 229, 0.04)'
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 16, flexWrap: 'wrap', gap: 8
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Layers size={18} color="var(--color-brand)" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-primary)' }}>
              Official Capacity Building Timeline
            </h3>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Stage-by-Stage Progression from Diagnostic to Competency Mastery
          </span>
        </div>

        {/* Timeline Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 12,
          position: 'relative'
        }}>
          {[
            { step: '1', title: 'Skill Gap', subtitle: 'Diagnostics & Evaluation', status: 'completed' },
            { step: '2', title: 'Recommended Course', subtitle: 'Curated iGOT / NSSTA', status: 'completed' },
            { step: '3', title: 'Active Learning', subtitle: 'Interactive Modules', status: 'active' },
            { step: '4', title: 'Assessment', subtitle: 'Cadre Evaluation Check', status: 'upcoming' },
            { step: '5', title: 'Competency Improvement', subtitle: 'Score & APAR Endorsement', status: 'upcoming' }
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                background: item.status === 'active'
                  ? '#EEF2FF'
                  : item.status === 'completed'
                  ? '#F0FDF4'
                  : '#FFFFFF',
                border: item.status === 'active'
                  ? '1px solid #A5B4FC'
                  : item.status === 'completed'
                  ? '1px solid #BBF7D0'
                  : '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                display: 'flex', flexDirection: 'column', gap: 6,
                position: 'relative',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: item.status === 'completed' ? '#10B981' : item.status === 'active' ? 'var(--color-brand)' : '#E2E8F0',
                  color: item.status === 'upcoming' ? 'var(--color-text-secondary)' : '#FFFFFF', fontSize: '0.72rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {item.status === 'completed' ? <Check size={13} /> : item.step}
                </span>

                <span style={{
                  fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase',
                  color: item.status === 'completed' ? '#0D9488' : item.status === 'active' ? 'var(--color-brand)' : 'var(--color-text-muted)'
                }}>
                  {item.status === 'completed' ? 'Completed' : item.status === 'active' ? 'In Progress' : 'Upcoming'}
                </span>
              </div>

              <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--color-text-primary)' }}>
                {item.title}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', lineHeight: 1.3 }}>
                {item.subtitle}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. "WHY THIS PATHWAY?" & PRIORITY SKILL GAPS             */}
      {/* ======================================================== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 16,
        marginBottom: 24
      }}>
        {/* Why this pathway card */}
        <div className="card" style={{ padding: '20px 22px', borderLeft: '4px solid var(--color-accent-blue)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <HelpCircle size={18} color="var(--color-accent-blue-light)" />
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0 }}>
              Why this pathway?
            </h3>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: '0 0 14px 0' }}>
            Recommendations are autonomously calibrated based on your active role as <strong>Deputy Director (Labour Statistics)</strong>, your 24 official competency scores, recent assessment evaluations, and highest-priority skill gaps.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle size={14} color="#10B981" />
              <span>Aligned with <strong>DPC Promotion Criteria</strong> for ISS Group A Cadre</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle size={14} color="#10B981" />
              <span>Directly addresses verified gaps from Cadre Evaluation assessments</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle size={14} color="#10B981" />
              <span>Synchronized with official iGOT Karmayogi courses and NSSTA calendar</span>
            </div>
          </div>
        </div>

        {/* Highlight Highest-Priority Skill Gaps */}
        <div className="card" style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Flame size={18} color="#EF4444" />
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0 }}>
                High-Priority Skill Gaps Targeted
              </h3>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
              Click to focus
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {priorityGaps.map(gap => {
              const isSelected = competencyQuery.toLowerCase() === gap.name.toLowerCase();
              return (
                <div
                  key={gap.id}
                  onClick={() => setCompetencyQuery(isSelected ? '' : gap.name)}
                  style={{
                    background: isSelected ? '#EEF2FF' : '#F8FAFC',
                    border: isSelected ? '1px solid var(--color-brand)' : '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)', padding: '10px 12px',
                    cursor: 'pointer', transition: 'all var(--transition-fast)'
                  }}
                  title={`Click to filter pathway courses for ${gap.name}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{
                      fontWeight: 700, fontSize: '0.82rem',
                      color: isSelected ? 'var(--color-brand)' : 'var(--color-text-primary)'
                    }}>
                      {gap.name}
                    </span>
                    <span style={{
                      fontSize: '0.66rem', padding: '1px 6px', borderRadius: 'var(--radius-full)',
                      fontWeight: 700, textTransform: 'uppercase',
                      background: gap.gapSeverity === 'critical' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(217, 119, 6, 0.12)',
                      color: gap.gapSeverity === 'critical' ? '#DC2626' : '#D97706'
                    }}>
                      {gap.gapSeverity || 'High'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>L{gap.currentLevel || 1} → L{gap.requiredLevel || 3}</span>
                    <span>•</span>
                    <span style={{ color: 'var(--color-brand)', fontWeight: 600 }}>Gap: {gap.gapScore || 25}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. FILTERS AND CONTROLS                                  */}
      {/* ======================================================== */}
      <div className="card" style={{
        marginBottom: 20, padding: '14px 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 14
      }}>
        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Items', count: pathwayItems.length },
            { id: 'in-progress', label: 'In Progress', count: stats.inProgress },
            { id: 'recommended', label: 'Recommended', count: stats.recommended },
            { id: 'completed', label: 'Completed', count: stats.completed }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`btn ${statusFilter === tab.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: 20 }}
            >
              {tab.label}
              <span style={{
                marginLeft: 6, padding: '1px 6px', borderRadius: 10,
                fontSize: '0.7rem', background: statusFilter === tab.id ? 'rgba(255, 255, 255, 0.25)' : '#E2E8F0',
                color: statusFilter === tab.id ? '#FFFFFF' : 'var(--color-text-secondary)'
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Domain Filter Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
            <Filter size={14} />
            <span>Domain:</span>
          </div>
          <select
            className="input"
            value={domainFilter}
            onChange={e => setDomainFilter(e.target.value)}
            style={{ padding: '6px 12px', fontSize: '0.8rem', width: 'auto', minWidth: 160 }}
          >
            <option value="all">All Domains</option>
            <option value="statistical">Statistical Competencies</option>
            <option value="technical">Technical Competencies</option>
            <option value="digital-governance">Digital Governance</option>
            <option value="behavioural">Behavioural & Managerial</option>
          </select>

          {competencyQuery && (
            <button
              onClick={() => setCompetencyQuery('')}
              className="btn btn-secondary"
              style={{
                padding: '5px 10px', fontSize: '0.75rem', borderRadius: 20,
                display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(239, 68, 68, 0.1)',
                borderColor: 'rgba(239, 68, 68, 0.3)', color: '#EF4444'
              }}
              title="Clear competency search filter"
            >
              Skill: {competencyQuery} <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. PATHWAY COURSE CARDS GRID                             */}
      {/* ======================================================== */}
      {filteredItems.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <BookOpen size={36} color="var(--color-text-muted)" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 6 }}>
            No pathway items match the selected filter
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', maxWidth: 460, margin: '0 auto 16px auto' }}>
            Try resetting your domain filter or clearing your active competency search.
          </p>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setStatusFilter('all');
              setDomainFilter('all');
              setCompetencyQuery('');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 18
        }}>
          {filteredItems.map(item => {
            const isCompleted = item.status === 'completed';
            const isInProgress = item.status === 'in-progress';
            const isRecommended = item.status === 'recommended';

            return (
              <div
                key={item.id}
                className="card"
                style={{
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  padding: 20,
                  border: isCompleted
                    ? '1px solid rgba(13, 148, 136, 0.3)'
                    : isInProgress
                    ? '1px solid rgba(79, 70, 229, 0.3)'
                    : '1px solid var(--color-border)',
                  background: '#FFFFFF',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                  transition: 'transform 0.15s ease, border-color 0.15s ease'
                }}
              >
                <div>
                  {/* Card Header Badges */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 6 }}>
                    {/* Source Badge */}
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 700, padding: '2px 9px', borderRadius: 'var(--radius-full)',
                      background: item.sourceType === 'igot' ? 'rgba(217, 119, 6, 0.1)' : 'rgba(79, 70, 229, 0.1)',
                      color: item.sourceType === 'igot' ? '#D97706' : '#4F46E5',
                      border: `1px solid ${item.sourceType === 'igot' ? 'rgba(217, 119, 6, 0.25)' : 'rgba(79, 70, 229, 0.25)'}`
                    }}>
                      {item.source}
                    </span>

                    {/* Status Badge */}
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 700, padding: '2px 9px', borderRadius: 'var(--radius-full)',
                      display: 'flex', alignItems: 'center', gap: 5,
                      background: isCompleted ? 'rgba(13, 148, 136, 0.1)' : isInProgress ? 'rgba(79, 70, 229, 0.1)' : '#F1F5F9',
                      color: isCompleted ? '#0D9488' : isInProgress ? '#4F46E5' : 'var(--color-text-secondary)',
                      border: isCompleted ? '1px solid rgba(13, 148, 136, 0.25)' : isInProgress ? '1px solid rgba(79, 70, 229, 0.25)' : '1px solid var(--color-border)'
                    }}>
                      {isCompleted && <CheckCircle size={12} color="#0D9488" />}
                      {isInProgress && <Play size={12} color="#4F46E5" />}
                      {isRecommended && <Target size={12} color="var(--color-text-muted)" />}
                      {isCompleted ? 'Completed' : isInProgress ? 'In Progress' : 'Recommended'}
                    </span>
                  </div>

                  {/* Title & Provider */}
                  <h4 style={{
                    fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-primary)',
                    margin: '0 0 6px 0', lineHeight: 1.4
                  }}>
                    {item.title}
                  </h4>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: 12 }}>
                    Provider: {item.provider}
                  </div>

                  {/* Competency & Level Mapping */}
                  <div style={{
                    background: '#F8FAFC', padding: '10px 12px',
                    borderRadius: 'var(--radius-md)', marginBottom: 14,
                    display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.78rem',
                    border: '1px solid var(--color-border)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Skill Competency:</span>
                      <strong style={{ color: 'var(--color-brand)' }}>{item.competency}</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Proficiency Target:</span>
                      <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {item.currentLevel} → {item.targetLevel}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Estimated Duration:</span>
                      <span style={{ color: 'var(--color-text-muted)' }}>{item.duration}</span>
                    </div>
                  </div>

                  {/* Why this was recommended */}
                  <div style={{
                    fontSize: '0.76rem', color: 'var(--color-text-secondary)',
                    marginBottom: 16, lineHeight: 1.4,
                    padding: '8px 12px', background: '#F8FAFC',
                    borderRadius: 6, borderLeft: '3px solid var(--color-brand)'
                  }}>
                    <strong>Pathway Rationale:</strong> {item.reason}
                  </div>

                  {/* Progress Bar & Percentage */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                        Course Progress
                      </span>
                      <span style={{
                        fontSize: '0.82rem', fontWeight: 700,
                        color: isCompleted ? '#0D9488' : isInProgress ? 'var(--color-brand)' : 'var(--color-text-muted)'
                      }}>
                        {item.progress}%
                      </span>
                    </div>
                    <div className="progress-bar-container" style={{ height: 6 }}>
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${item.progress}%`,
                          background: isCompleted ? '#0D9488' : isInProgress ? 'linear-gradient(90deg, #4F46E5, #6366F1)' : 'transparent'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Primary Action Button */}
                <div style={{ paddingTop: 12, borderTop: '1px solid var(--color-border)' }}>
                  <Link
                    href={item.actionUrl}
                    className={`btn ${isCompleted ? 'btn-secondary' : isInProgress ? 'btn-primary' : 'btn-primary'}`}
                    style={{
                      width: '100%', padding: '9px 14px', fontSize: '0.85rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      textDecoration: 'none'
                    }}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle size={15} color="#10B981" />
                        View Certificate & Details
                      </>
                    ) : isInProgress ? (
                      <>
                        <Play size={15} />
                        Continue Learning
                      </>
                    ) : (
                      <>
                        <ArrowRight size={15} />
                        Start Course / Enroll
                      </>
                    )}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function LearningPage() {
  return (
    <Suspense fallback={
      <div className="page-container" style={{ padding: 40, textAlign: 'center' }}>
        <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 12px auto' }} />
        <div>Loading Learning Pathway...</div>
      </div>
    }>
      <LearningPageContent />
    </Suspense>
  );
}
