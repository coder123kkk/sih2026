'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen, Target, Award, Clock, TrendingUp, GraduationCap,
  ChevronRight, ExternalLink, BarChart2, Zap, Building2, ArrowRight,
  Sparkles, Bot, CheckCircle, Play, Flame, Compass, ArrowUpRight
} from 'lucide-react';
import { getGapColor, getGapEmoji, truncate } from '@/lib/utils';

export default function DashboardPage() {
  const [competencyProfile, setCompetencyProfile] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [learnerData, setLearnerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [compRes, recRes, learnerRes] = await Promise.all([
          fetch('/api/competencies?userId=USR001'),
          fetch('/api/recommendations?userId=USR001'),
          fetch('/api/igot/learner?userId=USR001')
        ]);
        const [compData, recData, learnerDataRes] = await Promise.all([
          compRes.json(), recRes.json(), learnerRes.json()
        ]);
        setCompetencyProfile(compData);
        setRecommendations(recData);
        setLearnerData(learnerDataRes);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="page-container" style={{ padding: 40, textAlign: 'center', background: 'var(--color-bg-primary)' }}>
        <div className="loading-skeleton" style={{ height: 120, borderRadius: 'var(--radius-xl)', marginBottom: 24, background: 'var(--color-bg-secondary)' }} />
        <div className="stats-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="stat-card" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
              <div className="loading-skeleton" style={{ height: 80, background: 'var(--color-bg-tertiary)' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const overallScore = competencyProfile?.overallScore || 82;
  const topGaps = competencyProfile?.topGaps || [];
  const igotRecs = recommendations?.igot || [];
  const nsstaRecs = recommendations?.nssta || [];
  const enrollments = learnerData?.enrollments || [];
  const inProgress = enrollments.filter(e => e.completionStatus === 'in-progress');
  const completed = enrollments.filter(e => e.completionStatus === 'completed');

  return (
    <div className="page-container animate-fade-in" style={{ paddingBottom: 48, background: 'var(--color-bg-primary)' }}>
      {/* ======================================================== */}
      {/* 1. TOP HERO SECTION: WARM EDTECH GREETING & SUMMARY      */}
      {/* ======================================================== */}
      <div style={{
        background: 'var(--color-bg-secondary)', // Obsidian Surface
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px 32px',
        marginBottom: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 20,
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 12px', borderRadius: 'var(--radius-pill)', background: 'var(--color-surface-chip)',
            border: '1px solid var(--color-border)', color: 'var(--color-text-primary)',
            fontSize: '14px', fontWeight: 400, marginBottom: 12, letterSpacing: '-0.224px'
          }}>
            <Sparkles size={14} color="var(--color-brand)" />
            Official Cadre Capacity Building
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '40px', fontWeight: 600, color: 'var(--color-text-primary)',
            margin: '0 0 6px 0', letterSpacing: '0px', lineHeight: 1.1
          }}>
            Good morning, Dr. Priya Sharma
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '17px', color: 'var(--color-text-secondary)',
            margin: 0, maxWidth: 640, lineHeight: 1.47, letterSpacing: '-0.374px'
          }}>
            Continue building your official statistical competencies. You have <strong style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{inProgress.length} courses in progress</strong> and <strong style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{topGaps.length} priority skill gaps</strong> identified for promotion readiness.
          </p>
        </div>

        {/* Quick Hero Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link
            href="/learning"
            className="btn btn-primary btn-lg"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 'var(--radius-pill)', background: 'var(--color-bg-secondary)', fontSize: '18px', fontWeight: 300, border: 'none' }}
          >
            <Play size={16} /> Resume Learning
          </Link>
          <Link
            href="/ai-advisor"
            className="btn btn-secondary btn-lg"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 'var(--radius-pill)', background: 'transparent', borderColor: 'var(--color-brand)', color: 'var(--color-brand)', fontSize: '18px', fontWeight: 300 }}
          >
            <Bot size={18} color="var(--color-brand)" /> AI Copilot
          </Link>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. YOUR LEARNING SNAPSHOT: 4 VISUAL CARDS                */}
      {/* ======================================================== */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 400, margin: 0, color: 'var(--color-text-primary)', letterSpacing: '0.196px' }}>
            Your Learning Snapshot
          </h2>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-text-muted)', letterSpacing: '-0.224px' }}>
            Calibrated against ISS Cadre Framework
          </span>
        </div>

        <div className="stats-grid">
          {/* Overall Competency */}
          <div className="stat-card" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="stat-label" style={{ color: 'var(--color-text-secondary)' }}>Overall Competency</span>
              <div className="stat-icon" style={{ background: 'var(--color-surface-chip)', color: 'var(--color-text-primary)', borderRadius: 'var(--radius-full)', marginBottom: 0 }}>
                <Award size={20} />
              </div>
            </div>
            <div className="stat-value" style={{ color: 'var(--color-text-primary)', marginTop: 8, fontFamily: 'var(--font-heading)', fontSize: '34px', fontWeight: 600, letterSpacing: '-0.374px' }}>
              {overallScore}%
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-text-muted)', marginTop: 4 }}>
              Level 2.8 (Intermediate Standard)
            </div>
          </div>

          {/* Learning Progress */}
          <div className="stat-card" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="stat-label" style={{ color: 'var(--color-text-secondary)' }}>Pathway Completion</span>
              <div className="stat-icon" style={{ background: 'var(--color-surface-chip)', color: 'var(--color-text-primary)', borderRadius: 'var(--radius-full)', marginBottom: 0 }}>
                <TrendingUp size={20} />
              </div>
            </div>
            <div className="stat-value" style={{ color: 'var(--color-text-primary)', marginTop: 8, fontFamily: 'var(--font-heading)', fontSize: '34px', fontWeight: 600, letterSpacing: '-0.374px' }}>
              64%
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-text-muted)', marginTop: 4 }}>
              5 of 8 milestones completed
            </div>
          </div>

          {/* Strongest Domain */}
          <div className="stat-card" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="stat-label" style={{ color: 'var(--color-text-secondary)' }}>Strongest Competency</span>
              <div className="stat-icon" style={{ background: 'var(--color-surface-chip)', color: 'var(--color-text-primary)', borderRadius: 'var(--radius-full)', marginBottom: 0 }}>
                <CheckCircle size={20} />
              </div>
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '21px', fontWeight: 600, color: 'var(--color-brand)', marginTop: 10, lineHeight: 1.19, letterSpacing: '0.231px' }}>
              Statistical Survey
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-text-muted)', marginTop: 6 }}>
              Score: 92% • Level 4 Advanced
            </div>
          </div>

          {/* Learning Hours & Streak */}
          <div className="stat-card" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="stat-label" style={{ color: 'var(--color-text-secondary)' }}>Learning Dedicated</span>
              <div className="stat-icon" style={{ background: 'var(--color-surface-chip)', color: 'var(--color-text-primary)', borderRadius: 'var(--radius-full)', marginBottom: 0 }}>
                <Clock size={20} />
              </div>
            </div>
            <div className="stat-value" style={{ color: 'var(--color-text-primary)', marginTop: 8, fontFamily: 'var(--font-heading)', fontSize: '34px', fontWeight: 600, letterSpacing: '-0.374px' }}>
              48h
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-text-muted)', marginTop: 4 }}>
              Across iGOT & NSSTA modules
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. CONTINUE LEARNING: LARGE HORIZONTAL COURSE CARDS      */}
      {/* ======================================================== */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 6,
              background: 'var(--color-surface-chip)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-text-primary)'
            }}>
              <Play size={15} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 400, margin: 0, color: 'var(--color-text-primary)', letterSpacing: '0.196px' }}>
              Continue Learning
            </h2>
          </div>
          <Link href="/learning" style={{ fontFamily: 'var(--font-body)', fontSize: '17px', fontWeight: 400, color: 'var(--color-brand)' }}>
            View all courses →
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {inProgress.slice(0, 2).map((course) => (
            <div
              key={course.id || course.courseId}
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 20,
                padding: '20px 24px',
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg-card)',
                borderRadius: 'var(--radius-lg)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 18, flex: 1, minWidth: 280 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-bg-tertiary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--color-text-primary)', flexShrink: 0
                }}>
                  <BookOpen size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span className="badge badge-warning" style={{ fontSize: '12px', padding: '2px 8px', background: 'var(--color-surface-chip)', color: 'var(--color-text-secondary)', border: 'none' }}>
                      {course.provider || 'iGOT Karmayogi'}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      Duration: 2h 30m
                    </span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '21px', fontWeight: 600, margin: '0 0 8px 0', color: 'var(--color-text-primary)', letterSpacing: '0.231px' }}>
                    {course.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, maxWidth: 360 }}>
                    <div className="progress-bar-container" style={{ flex: 1, height: 6, background: 'var(--color-border)' }}>
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${course.completionPercentage || 65}%`, background: 'var(--color-brand)' }}
                      />
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-brand)' }}>
                      {course.completionPercentage || 65}%
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Link
                  href={`/igot/${course.id || course.courseId}`}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '11px 22px', borderRadius: 'var(--radius-pill)', background: 'var(--color-bg-secondary)', fontSize: '17px', border: 'none' }}
                >
                  <Play size={15} /> Continue Course
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. TWO-COLUMN: RECOMMENDED FOR YOU & PRIORITY SKILLS     */}
      {/* ======================================================== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: 24,
        marginBottom: 36
      }}>
        {/* Left Column: Recommended For You */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 6,
                background: 'var(--color-surface-chip)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-text-primary)'
              }}>
                <Sparkles size={15} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 400, margin: 0, color: 'var(--color-text-primary)' }}>
                Recommended for You
              </h2>
            </div>
            <Link href="/igot" style={{ fontFamily: 'var(--font-body)', fontSize: '17px', fontWeight: 400, color: 'var(--color-brand)' }}>
              Explore Catalogue →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {igotRecs.slice(0, 3).map((rec, idx) => (
              <div
                key={idx}
                className="card"
                style={{ padding: '18px 20px', border: '1px solid var(--color-border)', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '2px 8px', borderRadius: '4px', background: 'var(--color-surface-chip)',
                      color: 'var(--color-brand)', fontSize: '12px', fontWeight: 400,
                      marginBottom: 6
                    }}>
                      iGOT Karmayogi Course
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '17px', fontWeight: 600, margin: '0 0 6px 0', lineHeight: 1.35, color: 'var(--color-text-primary)' }}>
                      {rec.course?.title || 'Cloud Computing for Government'}
                    </h3>
                    <div style={{
                      fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-text-secondary)',
                      padding: '8px 12px', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-sm)',
                      borderLeft: '3px solid var(--color-brand)', marginBottom: 12
                    }}>
                      <strong style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>Recommended because:</strong> {rec.reason || 'Addresses verified skill gap in Digital Infrastructure'}
                    </div>
                  </div>

                  <Link
                    href={`/igot/${rec.course?.id || 'igot-crs-014'}`}
                    className="btn btn-secondary btn-sm"
                    style={{ flexShrink: 0, padding: '7px 14px', background: 'var(--color-surface-chip)', borderColor: 'transparent', color: 'var(--color-text-primary)' }}
                  >
                    View <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Your Priority Skills */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 6,
                background: 'var(--color-surface-chip)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-text-primary)'
              }}>
                <Flame size={15} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 400, margin: 0, color: 'var(--color-text-primary)' }}>
                Your Priority Skills
              </h2>
            </div>
            <Link href="/competencies" style={{ fontFamily: 'var(--font-body)', fontSize: '17px', fontWeight: 400, color: 'var(--color-brand)' }}>
              View Analysis →
            </Link>
          </div>

          <div className="card" style={{ padding: '20px 22px', border: '1px solid var(--color-border)', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {topGaps.slice(0, 4).map((gap) => (
                <div key={gap.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-text-primary)' }}>
                      {gap.name}
                    </span>
                    <span style={{
                      fontSize: '12px', padding: '2px 8px', borderRadius: 10,
                      background: 'var(--color-surface-chip)',
                      color: gap.gapSeverity === 'critical' ? '#ff453a' : '#ffd60a',
                      fontWeight: 600
                    }}>
                      Gap: {gap.gapScore || 25}%
                    </span>
                  </div>

                  {/* Progress Comparison */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="progress-bar-container" style={{ flex: 1, height: 8, background: 'var(--color-border)' }}>
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${gap.currentScore || 50}%`,
                          background: gap.gapSeverity === 'critical' ? '#ff453a' : 'var(--color-brand)'
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                      {gap.currentScore || 50}% / {gap.requiredScore || 80}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid var(--color-border)' }}>
              <Link
                href="/competencies"
                className="btn btn-secondary"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'transparent', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
              >
                Explore All 24 Competencies <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. LEARNING PATHWAY & AI COPILOT BOTTOM ROW              */}
      {/* ======================================================== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 24
      }}>
        {/* Pathway Roadmap Teaser */}
        <div className="card" style={{ padding: '22px 24px', border: '1px solid var(--color-border)', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'var(--color-surface-chip)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-text-primary)'
              }}>
                <Compass size={18} />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '21px', fontWeight: 600, margin: 0, color: 'var(--color-text-primary)' }}>
                  Upcoming Pathway Milestones
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  Targeting Deputy Director DPC Cycle
                </span>
              </div>
            </div>
            <Link href="/learning" className="btn btn-secondary btn-sm" style={{ background: 'var(--color-surface-chip)', borderColor: 'transparent', color: 'var(--color-text-primary)' }}>
              Full Journey →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
              background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)'
            }}>
              <span style={{
                width: 24, height: 24, borderRadius: '50%', background: 'var(--color-surface-chip)',
                color: 'var(--color-bg-secondary)', fontSize: '12px', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                ✓
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-text-primary)' }}>Sample Survey Design</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Completed • Cadre Evaluated</div>
              </div>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
              background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-brand)'
            }}>
              <span style={{
                width: 24, height: 24, borderRadius: '50%', background: 'var(--color-brand)',
                color: 'var(--color-bg-secondary)', fontSize: '12px', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                2
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-brand)' }}>
                  Python for Official Statistics
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Active Course • 65% Complete</div>
              </div>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
              background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)'
            }}>
              <span style={{
                width: 24, height: 24, borderRadius: '50%', background: 'var(--color-surface-chip)',
                color: 'var(--color-text-muted)', fontSize: '12px', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                3
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-text-primary)' }}>NSSTA National Accounts Masterclass</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Upcoming In-Service Training</div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Copilot Teaser Card */}
        <div className="card" style={{
          padding: '24px',
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'var(--color-brand)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-bg-secondary)'
              }}>
                <Sparkles size={18} />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '21px', fontWeight: 600, margin: 0, color: 'var(--color-text-primary)', letterSpacing: '0.231px' }}>
                  Ask Your Karmayogi AI Copilot
                </h3>
                <span style={{ fontSize: '14px', color: 'var(--color-brand)', fontWeight: 600 }}>
                  Active • MoSPI Knowledge Engine
                </span>
              </div>
            </div>

            <p style={{ fontFamily: 'var(--font-body)', fontSize: '17px', color: 'var(--color-text-secondary)', lineHeight: 1.47, marginBottom: 18, letterSpacing: '-0.374px' }}>
              Have questions about your competency gaps, official statistical guidelines (e.g. SNA 2008, PLFS), or upcoming iGOT course selections? Your AI advisor is ready to guide you.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
              {[
                'What are my biggest skill gaps?',
                'Recommend an iGOT course',
                'Explain my competency score'
              ].map((chip, idx) => (
                <Link
                  key={idx}
                  href="/ai-advisor"
                  style={{
                    padding: '8px 15px', borderRadius: 'var(--radius-sm)', background: 'var(--color-surface-chip)',
                    border: 'none', fontSize: '14px', fontWeight: 400,
                    color: 'var(--color-text-primary)', textDecoration: 'none'
                  }}
                >
                  {chip}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/ai-advisor"
            className="btn btn-primary"
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '11px 22px', borderRadius: 'var(--radius-pill)', background: 'var(--color-bg-secondary)', border: 'none'
            }}
          >
            <Bot size={17} /> Open AI Copilot
          </Link>
        </div>
      </div>
    </div>
  );
}
