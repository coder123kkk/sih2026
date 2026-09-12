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
      <div className="page-container" style={{ padding: 40, textAlign: 'center' }}>
        <div className="loading-skeleton" style={{ height: 120, borderRadius: 16, marginBottom: 24 }} />
        <div className="stats-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="stat-card">
              <div className="loading-skeleton" style={{ height: 80 }} />
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
    <div className="page-container animate-fade-in" style={{ paddingBottom: 48 }}>
      {/* ======================================================== */}
      {/* 1. TOP HERO SECTION: WARM EDTECH GREETING & SUMMARY      */}
      {/* ======================================================== */}
      <div style={{
        background: 'linear-gradient(135deg, #EEF2FF 0%, #F0FDFA 60%, #FFFFFF 100%)',
        border: '1px solid #C7D2FE',
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
            padding: '4px 12px', borderRadius: 20, background: '#FFFFFF',
            border: '1px solid #C7D2FE', color: 'var(--color-brand)',
            fontSize: '0.78rem', fontWeight: 700, marginBottom: 12
          }}>
            <Sparkles size={14} color="#6366F1" />
            Official Cadre Capacity Building
          </div>
          <h1 style={{
            fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-primary)',
            margin: '0 0 6px 0', letterSpacing: '-0.02em'
          }}>
            Good morning, Dr. Priya Sharma 👋
          </h1>
          <p style={{
            fontSize: '0.95rem', color: 'var(--color-text-secondary)',
            margin: 0, maxWidth: 640, lineHeight: 1.5
          }}>
            Continue building your official statistical competencies. You have <strong>{inProgress.length} courses in progress</strong> and <strong>{topGaps.length} priority skill gaps</strong> identified for promotion readiness.
          </p>
        </div>

        {/* Quick Hero Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link
            href="/learning"
            className="btn btn-primary btn-lg"
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <Play size={16} /> Resume Learning
          </Link>
          <Link
            href="/ai-advisor"
            className="btn btn-secondary btn-lg"
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
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
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
            Your Learning Snapshot
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
            Calibrated against ISS Cadre Framework
          </span>
        </div>

        <div className="stats-grid">
          {/* Overall Competency */}
          <div className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="stat-label">Overall Competency</span>
              <div className="stat-icon" style={{ background: '#EEF2FF', color: 'var(--color-brand)', marginBottom: 0 }}>
                <Award size={20} />
              </div>
            </div>
            <div className="stat-value" style={{ color: 'var(--color-brand)', marginTop: 8 }}>
              {overallScore}%
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: 4 }}>
              Level 2.8 (Intermediate Standard)
            </div>
          </div>

          {/* Learning Progress */}
          <div className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="stat-label">Pathway Completion</span>
              <div className="stat-icon" style={{ background: '#F0FDF4', color: '#0D9488', marginBottom: 0 }}>
                <TrendingUp size={20} />
              </div>
            </div>
            <div className="stat-value" style={{ color: '#0D9488', marginTop: 8 }}>
              64%
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: 4 }}>
              5 of 8 milestones completed
            </div>
          </div>

          {/* Strongest Domain */}
          <div className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="stat-label">Strongest Competency</span>
              <div className="stat-icon" style={{ background: '#FEF3C7', color: '#D97706', marginBottom: 0 }}>
                <CheckCircle size={20} />
              </div>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#92400E', marginTop: 10, lineHeight: 1.2 }}>
              Statistical Survey
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: 6 }}>
              Score: 92% • Level 4 Advanced
            </div>
          </div>

          {/* Learning Hours & Streak */}
          <div className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="stat-label">Learning Dedicated</span>
              <div className="stat-icon" style={{ background: '#FDF4FF', color: '#7C3AED', marginBottom: 0 }}>
                <Clock size={20} />
              </div>
            </div>
            <div className="stat-value" style={{ color: '#7C3AED', marginTop: 8 }}>
              48h
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: 4 }}>
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
              background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-brand)'
            }}>
              <Play size={15} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
              Continue Learning
            </h2>
          </div>
          <Link href="/learning" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-brand)' }}>
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
                border: '1px solid var(--color-border)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 18, flex: 1, minWidth: 280 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--color-brand)', flexShrink: 0
                }}>
                  <BookOpen size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span className="badge badge-warning" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                      {course.provider || 'iGOT Karmayogi'}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                      Duration: 2h 30m
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 8px 0' }}>
                    {course.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, maxWidth: 360 }}>
                    <div className="progress-bar-container" style={{ flex: 1, height: 6 }}>
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${course.completionPercentage || 65}%` }}
                      />
                    </div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-brand)' }}>
                      {course.completionPercentage || 65}%
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Link
                  href={`/igot/${course.id || course.courseId}`}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px' }}
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
                background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#B45309'
              }}>
                <Sparkles size={15} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                Recommended for You
              </h2>
            </div>
            <Link href="/igot" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-brand)' }}>
              Explore Catalogue →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {igotRecs.slice(0, 3).map((rec, idx) => (
              <div
                key={idx}
                className="card"
                style={{ padding: '18px 20px', border: '1px solid var(--color-border)' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '2px 8px', borderRadius: 4, background: '#EEF2FF',
                      color: 'var(--color-brand)', fontSize: '0.72rem', fontWeight: 700,
                      marginBottom: 6
                    }}>
                      iGOT Karmayogi Course
                    </div>
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: '0 0 6px 0', lineHeight: 1.35 }}>
                      {rec.course?.title || 'Cloud Computing for Government'}
                    </h3>
                    <div style={{
                      fontSize: '0.78rem', color: 'var(--color-text-secondary)',
                      padding: '4px 8px', background: '#F8FAFC', borderRadius: 6,
                      borderLeft: '3px solid var(--color-brand)', marginBottom: 12
                    }}>
                      <strong>Recommended because:</strong> {rec.reason || 'Addresses verified skill gap in Digital Infrastructure'}
                    </div>
                  </div>

                  <Link
                    href={`/igot/${rec.course?.id || 'igot-crs-014'}`}
                    className="btn btn-secondary btn-sm"
                    style={{ flexShrink: 0, padding: '7px 14px' }}
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
                background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#DC2626'
              }}>
                <Flame size={15} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                Your Priority Skills
              </h2>
            </div>
            <Link href="/competencies" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-brand)' }}>
              View Analysis →
            </Link>
          </div>

          <div className="card" style={{ padding: '20px 22px', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {topGaps.slice(0, 4).map((gap) => (
                <div key={gap.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-text-primary)' }}>
                      {gap.name}
                    </span>
                    <span style={{
                      fontSize: '0.7rem', padding: '2px 8px', borderRadius: 10,
                      background: gap.gapSeverity === 'critical' ? '#FEE2E2' : '#FEF3C7',
                      color: gap.gapSeverity === 'critical' ? '#B91C1C' : '#B45309',
                      fontWeight: 700
                    }}>
                      Gap: {gap.gapScore || 25}%
                    </span>
                  </div>

                  {/* Progress Comparison */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="progress-bar-container" style={{ flex: 1, height: 8 }}>
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${gap.currentScore || 50}%`,
                          background: gap.gapSeverity === 'critical' ? '#DC2626' : 'var(--color-brand)'
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
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
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
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
        <div className="card" style={{ padding: '22px 24px', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#0D9488'
              }}>
                <Compass size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>
                  Upcoming Pathway Milestones
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  Targeting Deputy Director DPC Cycle
                </span>
              </div>
            </div>
            <Link href="/learning" className="btn btn-secondary btn-sm">
              Full Journey →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
              background: '#F8FAFC', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)'
            }}>
              <span style={{
                width: 24, height: 24, borderRadius: '50%', background: '#0D9488',
                color: '#FFFFFF', fontSize: '0.72rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                ✓
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.86rem' }}>Sample Survey Design</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary)' }}>Completed • Cadre Evaluated</div>
              </div>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
              background: '#EEF2FF', borderRadius: 'var(--radius-md)', border: '1px solid #C7D2FE'
            }}>
              <span style={{
                width: 24, height: 24, borderRadius: '50%', background: 'var(--color-brand)',
                color: '#FFFFFF', fontSize: '0.72rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                2
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--color-brand)' }}>
                  Python for Official Statistics
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary)' }}>Active Course • 65% Complete</div>
              </div>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
              background: '#F8FAFC', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)'
            }}>
              <span style={{
                width: 24, height: 24, borderRadius: '50%', background: '#E2E8F0',
                color: 'var(--color-text-secondary)', fontSize: '0.72rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                3
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.86rem' }}>NSSTA National Accounts Masterclass</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary)' }}>Upcoming In-Service Training</div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Copilot Teaser Card */}
        <div className="card" style={{
          padding: '22px 24px',
          background: 'linear-gradient(135deg, #F3E8FF 0%, #EEF2FF 100%)',
          border: '1px solid #DDD6FE',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'var(--gradient-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#FFFFFF', boxShadow: '0 4px 10px rgba(79, 70, 229, 0.25)'
              }}>
                <Sparkles size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.08rem', fontWeight: 800, margin: 0, color: 'var(--color-text-primary)' }}>
                  Ask Your Karmayogi AI Copilot
                </h3>
                <span style={{ fontSize: '0.74rem', color: 'var(--color-brand)', fontWeight: 600 }}>
                  Active • MoSPI Knowledge Engine
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 18 }}>
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
                    padding: '4px 10px', borderRadius: 16, background: '#FFFFFF',
                    border: '1px solid #C7D2FE', fontSize: '0.75rem', fontWeight: 600,
                    color: 'var(--color-brand)', textDecoration: 'none'
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
              padding: '11px'
            }}
          >
            <Bot size={17} /> Open AI Copilot
          </Link>
        </div>
      </div>
    </div>
  );
}
