'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Target, BarChart2, TrendingUp, ChevronRight, AlertTriangle, CheckCircle,
  Award, Filter, Search, ArrowRight, BookOpen, Layers, ShieldCheck,
  Flame, Check, Sparkles, HelpCircle
} from 'lucide-react';
import { getGapColor, getGapEmoji } from '@/lib/utils';

export default function CompetenciesPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'statistical' | 'technical' | 'digital' | 'behavioural'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'strong' | 'developing' | 'gap' | 'critical'
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/competencies?userId=USR001')
      .then(r => r.json())
      .then(data => { setProfile(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const categoryMeta = {
    statistical: { name: 'Statistical Competencies', icon: '📊', color: '#3B82F6', badge: 'Core Domain' },
    technical: { name: 'Technical Competencies', icon: '💻', color: '#8B5CF6', badge: 'Analytics & Tools' },
    digital: { name: 'Digital Governance', icon: '🏛️', color: '#0D9488', badge: 'Public Infrastructure' },
    behavioural: { name: 'Behavioural & Managerial', icon: '🤝', color: '#D97706', badge: 'Leadership' }
  };

  // Flatten all competencies across categories
  const allCompetencies = useMemo(() => {
    if (!profile?.byCategory) return [];
    const list = [];
    Object.entries(profile.byCategory).forEach(([catKey, catObj]) => {
      (catObj.competencies || []).forEach(comp => {
        const gap = Math.max(0, (comp.requiredScore || 80) - (comp.currentScore || 50));
        let status = 'developing';
        if (gap === 0 || (comp.currentScore >= comp.requiredScore)) status = 'strong';
        else if (gap > 25) status = 'critical';
        else if (gap > 10) status = 'gap';

        list.push({
          ...comp,
          categoryKey: catKey,
          categoryName: catObj.name || categoryMeta[catKey]?.name || catKey,
          calculatedGap: gap,
          competencyStatus: status
        });
      });
    });
    return list;
  }, [profile]);

  // Filter competencies based on active filters
  const filteredList = useMemo(() => {
    return allCompetencies.filter(c => {
      if (activeCategory !== 'all' && c.categoryKey !== activeCategory) return false;
      if (statusFilter === 'strong' && c.competencyStatus !== 'strong') return false;
      if (statusFilter === 'developing' && c.competencyStatus !== 'developing') return false;
      if (statusFilter === 'gap' && c.competencyStatus !== 'gap') return false;
      if (statusFilter === 'critical' && c.competencyStatus !== 'critical') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        if (!c.name.toLowerCase().includes(q) && !(c.description || '').toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [allCompetencies, activeCategory, statusFilter, searchQuery]);

  // Derived Strengths and Gaps
  const strengths = useMemo(() => {
    return allCompetencies.filter(c => c.competencyStatus === 'strong').slice(0, 4);
  }, [allCompetencies]);

  const priorityGaps = useMemo(() => {
    return allCompetencies.filter(c => c.competencyStatus === 'critical' || c.competencyStatus === 'gap')
      .sort((a, b) => b.calculatedGap - a.calculatedGap)
      .slice(0, 4);
  }, [allCompetencies]);

  if (loading) {
    return (
      <div className="page-container" style={{ padding: 40, textAlign: 'center' }}>
        <div className="loading-skeleton" style={{ height: 120, borderRadius: 16, marginBottom: 24 }} />
        <div className="stats-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="stat-card">
              <div className="loading-skeleton" style={{ height: 90 }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in" style={{ paddingBottom: 48 }}>
      {/* ======================================================== */}
      {/* 1. TOP HEADER & COMPETENCY OVERVIEW                      */}
      {/* ======================================================== */}
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 12px', borderRadius: 20, background: '#EEF2FF',
              border: '1px solid #C7D2FE', color: 'var(--color-brand)',
              fontSize: '0.78rem', fontWeight: 700, marginBottom: 8
            }}>
              <Target size={14} color="#6366F1" />
              MoSPI Competency Framework v2.4
            </div>
            <h1 className="page-title" style={{ margin: 0 }}>
              Your Competency Profile
            </h1>
            <p className="page-subtitle" style={{ margin: '6px 0 0 0' }}>
              Comprehensive evaluation of your capabilities mapped across 24 official statistical, technical, and digital governance competencies.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link
              href="/learning"
              className="btn btn-secondary"
              style={{ fontSize: '0.84rem' }}
            >
              <BookOpen size={15} color="var(--color-brand)" /> View Learning Pathways
            </Link>
            <Link
              href="/profile"
              className="btn btn-primary"
              style={{ fontSize: '0.84rem' }}
            >
              Officer Full Analysis
            </Link>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="stats-grid" style={{ marginBottom: 28 }}>
        {/* Overall Score */}
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span className="stat-label">Overall Competency</span>
            <div className="stat-icon" style={{ background: '#EEF2FF', color: 'var(--color-brand)', marginBottom: 0 }}>
              <Award size={20} />
            </div>
          </div>
          <div className="stat-value" style={{ color: 'var(--color-brand)' }}>
            {profile?.overallScore || 82}%
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: 4 }}>
            Benchmark: <strong>80% Required</strong> for Cadre Promotion
          </div>
        </div>

        {/* Current Level */}
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span className="stat-label">Current Proficiency</span>
            <div className="stat-icon" style={{ background: '#F0FDF4', color: '#0D9488', marginBottom: 0 }}>
              <CheckCircle size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0D9488', marginTop: 6, lineHeight: 1.2 }}>
            Level 2.8
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: 8 }}>
            Intermediate (Statistical Officer Standard)
          </div>
        </div>

        {/* Target Level */}
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span className="stat-label">Target Promotion Level</span>
            <div className="stat-icon" style={{ background: '#FEF3C7', color: '#D97706', marginBottom: 0 }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#B45309', marginTop: 6, lineHeight: 1.2 }}>
            Level 4.0
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: 8 }}>
            Advanced (Deputy Director / ISS Group A)
          </div>
        </div>

        {/* Overall Gap */}
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span className="stat-label">Overall Gap</span>
            <div className="stat-icon" style={{ background: '#FEE2E2', color: '#DC2626', marginBottom: 0 }}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="stat-value" style={{ color: '#DC2626' }}>
            {profile?.competenciesWithGaps || 5} Gaps
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: 4 }}>
            Across {profile?.totalCompetencies || 24} total competencies
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. STRENGTHS & PRIORITY SKILL GAPS CALLOUTS              */}
      {/* ======================================================== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 20,
        marginBottom: 32
      }}>
        {/* Your Strengths */}
        <div className="card" style={{ padding: '20px 24px', borderLeft: '4px solid #0D9488' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <CheckCircle size={18} color="#0D9488" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--color-text-primary)' }}>
              Your Strengths
            </h3>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: '0 0 14px 0' }}>
            Demonstrated mastery above required standards in official surveys and national accounts.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {strengths.map(s => (
              <div
                key={s.id}
                style={{
                  padding: '6px 12px', borderRadius: 'var(--radius-sm)',
                  background: '#F0FDF4', border: '1px solid #BBF7D0',
                  display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem'
                }}
              >
                <Check size={14} color="#0D9488" />
                <span style={{ fontWeight: 700, color: '#15803D' }}>{s.name}</span>
                <span style={{ fontSize: '0.75rem', color: '#166534' }}>({s.currentScore}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Skill Gaps */}
        <div className="card" style={{ padding: '20px 24px', borderLeft: '4px solid #DC2626' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Flame size={18} color="#DC2626" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--color-text-primary)' }}>
              Priority Skill Gaps Requiring Action
            </h3>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: '0 0 14px 0' }}>
            Focus capacity building on these key areas to eliminate promotion eligibility gaps.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {priorityGaps.map(g => (
              <Link
                key={g.id}
                href={`/learning?competency=${encodeURIComponent(g.name)}`}
                style={{
                  padding: '6px 12px', borderRadius: 'var(--radius-sm)',
                  background: g.competencyStatus === 'critical' ? '#FEE2E2' : '#FEF3C7',
                  border: `1px solid ${g.competencyStatus === 'critical' ? '#FECACA' : '#FDE68A'}`,
                  display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem',
                  textDecoration: 'none'
                }}
                title="Click to view recommended learning on iGOT"
              >
                <span style={{
                  fontWeight: 700,
                  color: g.competencyStatus === 'critical' ? '#B91C1C' : '#92400E'
                }}>
                  {g.name}
                </span>
                <span style={{
                  fontSize: '0.72rem', fontWeight: 800,
                  color: g.competencyStatus === 'critical' ? '#DC2626' : '#B45309'
                }}>
                  (-{g.calculatedGap}%)
                </span>
                <ArrowRight size={12} color="var(--color-text-muted)" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. SEARCH & CATEGORY FILTER TABS                         */}
      {/* ======================================================== */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: 24 }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 14
        }}>
          {/* Domain Category Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <button
              className={`filter-chip ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All Domains ({allCompetencies.length})
            </button>
            <button
              className={`filter-chip ${activeCategory === 'statistical' ? 'active' : ''}`}
              onClick={() => setActiveCategory('statistical')}
            >
              📊 Statistical (10)
            </button>
            <button
              className={`filter-chip ${activeCategory === 'technical' ? 'active' : ''}`}
              onClick={() => setActiveCategory('technical')}
            >
              💻 Technical (12)
            </button>
            <button
              className={`filter-chip ${activeCategory === 'digital' ? 'active' : ''}`}
              onClick={() => setActiveCategory('digital')}
            >
              🏛️ Digital Governance (5)
            </button>
            <button
              className={`filter-chip ${activeCategory === 'behavioural' ? 'active' : ''}`}
              onClick={() => setActiveCategory('behavioural')}
            >
              🤝 Behavioural (4)
            </button>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: 260 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              className="input"
              style={{ width: '100%', padding: '8px 12px 8px 36px', fontSize: '0.85rem' }}
              placeholder="Search competency or skill..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. VISUAL COMPETENCY CARDS GRID                          */}
      {/* ======================================================== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
        gap: 18
      }}>
        {filteredList.map(comp => {
          const isStrong = comp.competencyStatus === 'strong';
          const isCritical = comp.competencyStatus === 'critical';
          const isGap = comp.competencyStatus === 'gap';

          return (
            <div
              key={comp.id}
              className="card"
              style={{
                padding: '20px 22px',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                border: isCritical ? '1px solid #FECACA' : '1px solid var(--color-border)',
                background: '#FFFFFF'
              }}
            >
              <div>
                {/* Header: Name and Status Badge */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8, gap: 10 }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
                      {comp.name}
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginTop: 2 }}>
                      {comp.categoryName}
                    </div>
                  </div>

                  <span style={{
                    fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: 'var(--radius-full)',
                    background: isStrong ? '#F0FDF4' : isCritical ? '#FEE2E2' : '#FEF3C7',
                    color: isStrong ? '#15803D' : isCritical ? '#B91C1C' : '#B45309',
                    border: `1px solid ${isStrong ? '#BBF7D0' : isCritical ? '#FECACA' : '#FDE68A'}`
                  }}>
                    {isStrong ? 'Strong Skill' : isCritical ? 'Critical Gap' : 'Needs Development'}
                  </span>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.45, marginBottom: 14 }}>
                  {comp.description || 'Core methodology and application within official statistical operations.'}
                </p>

                {/* Score and Gap Metrics */}
                <div style={{
                  background: '#F8FAFC', padding: '12px 14px', borderRadius: 'var(--radius-md)',
                  marginBottom: 14, border: '1px solid var(--color-border)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                      Current: <strong>{comp.currentScore || 50}%</strong> (Level {comp.currentLevel || 2})
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                      Required: <strong>{comp.requiredScore || 80}%</strong> (Level {comp.requiredLevel || 4})
                    </span>
                  </div>

                  <div className="progress-bar-container" style={{ height: 8 }}>
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${comp.currentScore || 50}%`,
                        background: isStrong ? 'var(--gradient-teal)' : isCritical ? '#DC2626' : 'var(--gradient-primary)'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>
                      {comp.calculatedGap === 0 ? 'Target achieved' : `${comp.calculatedGap} point gap`}
                    </span>
                    <span style={{ fontWeight: 700, color: isStrong ? '#15803D' : isCritical ? '#B91C1C' : '#B45309' }}>
                      {isStrong ? '✓ Optimal' : `Gap: -${comp.calculatedGap}%`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 12 }}>
                <Link
                  href={`/learning?competency=${encodeURIComponent(comp.name)}`}
                  className={`btn ${isStrong ? 'btn-secondary' : 'btn-primary'}`}
                  style={{
                    width: '100%', padding: '8px 12px', fontSize: '0.82rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    textDecoration: 'none'
                  }}
                >
                  <BookOpen size={14} />
                  {isStrong ? 'Explore Advanced Learning' : 'View Recommended Learning'}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
