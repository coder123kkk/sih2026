'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Clock, BarChart2, ExternalLink, BookOpen,
  CheckCircle, Play, Award, Target, Layers
} from 'lucide-react';
import { getDifficultyColor, formatDate } from '@/lib/utils';

export default function CourseDetailPage({ params }) {
  const { courseId } = use(params);
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourse() {
      try {
        const res = await fetch(`/api/igot/courses/${courseId}?userId=USR001`);
        const data = await res.json();
        setCourse(data.course);
        setEnrollment(data.enrollment);
      } catch (err) {
        console.error('Failed to load course:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [courseId]);

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-skeleton" style={{height: 240, borderRadius: 20, marginBottom: 24}} />
        <div className="loading-skeleton" style={{height: 400, borderRadius: 16}} />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="page-container">
        <Link href="/igot" className="back-link"><ArrowLeft size={16} /> Back to Catalogue</Link>
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <div className="empty-state-text">Course not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in">
      <Link href="/igot" className="back-link">
        <ArrowLeft size={16} /> Back to iGOT Catalogue
      </Link>

      {/* Hero */}
      <div className="course-detail-hero">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-sm)', flexWrap: 'wrap' }}>
          <div className="course-detail-source" style={{ margin: 0 }}>
            <BookOpen size={12} /> iGOT Karmayogi Course
          </div>
          <span style={{
            fontSize: '0.68rem', padding: '2px 8px', borderRadius: 10,
            background: 'rgba(245, 158, 11, 0.15)', color: 'var(--color-accent-gold)',
            border: '1px solid rgba(245, 158, 11, 0.3)', fontWeight: 700
          }}>
            DEMO / MOCK MODE
          </span>
        </div>
        <h1 className="course-detail-title">{course.title}</h1>
        <div className="course-detail-provider">{course.provider}</div>

        <div className="course-detail-meta">
          <div className="course-detail-meta-item">
            <span className="course-detail-meta-label">Duration</span>
            <span className="course-detail-meta-value">
              <Clock size={14} style={{verticalAlign: 'middle', marginRight: 4}} />
              {course.duration}
            </span>
          </div>
          <div className="course-detail-meta-item">
            <span className="course-detail-meta-label">Difficulty</span>
            <span className="course-detail-meta-value" style={{color: getDifficultyColor(course.difficulty)}}>
              <BarChart2 size={14} style={{verticalAlign: 'middle', marginRight: 4}} />
              {course.difficulty}
            </span>
          </div>
          <div className="course-detail-meta-item">
            <span className="course-detail-meta-label">Category</span>
            <span className="course-detail-meta-value">{course.category}</span>
          </div>
          <div className="course-detail-meta-item">
            <span className="course-detail-meta-label">Language</span>
            <span className="course-detail-meta-value">{course.language}</span>
          </div>
        </div>
      </div>

      <div className="course-detail-grid">
        {/* Left Content */}
        <div>
          {/* Description */}
          <div className="course-detail-section">
            <h3 className="course-detail-section-title">About this Course</h3>
            <p style={{fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.7}}>
              {course.description}
            </p>
          </div>

          {/* Learning Objectives */}
          {course.learningObjectives && course.learningObjectives.length > 0 && (
            <div className="course-detail-section">
              <h3 className="course-detail-section-title">
                <Target size={16} style={{verticalAlign: 'middle', marginRight: 6}} />
                Learning Objectives
              </h3>
              <ul style={{paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8}}>
                {course.learningObjectives.map((obj, i) => (
                  <li key={i} style={{fontSize: '0.85rem', color: 'var(--color-text-secondary)'}}>
                    {obj}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Modules */}
          {course.modules && course.modules.length > 0 && (
            <div className="course-detail-section">
              <h3 className="course-detail-section-title">
                <Layers size={16} style={{verticalAlign: 'middle', marginRight: 6}} />
                Course Modules
              </h3>
              <div className="module-list">
                {course.modules.map((mod, i) => (
                  <div key={i} className="module-item">
                    <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                      <span style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: 'rgba(59, 130, 246, 0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-accent-blue-light)'
                      }}>
                        {i + 1}
                      </span>
                      <span className="module-item-title">{mod.title}</span>
                    </div>
                    <span className="module-item-duration">
                      <Clock size={12} style={{marginRight: 4}} /> {mod.duration}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div>
          {/* CTA Card */}
          <div className="card" style={{marginBottom: 'var(--space-lg)', textAlign: 'center'}}>
            {enrollment ? (
              <>
                <div style={{
                  fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
                  color: enrollment.status === 'completed' ? 'var(--color-accent-green)' : 'var(--color-accent-blue-light)',
                  marginBottom: 'var(--space-md)'
                }}>
                  {enrollment.status === 'completed' ? (
                    <><CheckCircle size={14} style={{verticalAlign: 'middle'}} /> Completed</>
                  ) : (
                    <><Play size={14} style={{verticalAlign: 'middle'}} /> In Progress — {enrollment.progress}%</>
                  )}
                </div>
                {enrollment.status !== 'completed' && (
                  <div className="progress-bar-container" style={{marginBottom: 'var(--space-md)'}}>
                    <div className="progress-bar-fill" style={{width: `${enrollment.progress}%`}} />
                  </div>
                )}
                {enrollment.assessmentScore && (
                  <div style={{fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-md)'}}>
                    Assessment Score: <strong style={{color: 'var(--color-accent-green)'}}>{enrollment.assessmentScore}%</strong>
                  </div>
                )}
                <a
                  href={course.externalUrl || 'https://igotkarmayogi.gov.in'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-gold btn-lg"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                >
                  Continue on iGOT <ExternalLink size={16} />
                </a>
              </>
            ) : (
              <>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>📚</div>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-md)' }}>
                  This course is available on iGOT Karmayogi
                </p>
                <a
                  href={course.externalUrl || 'https://igotkarmayogi.gov.in'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-gold btn-lg"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                >
                  Open on iGOT <ExternalLink size={16} />
                </a>
              </>
            )}

            <p style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-md)', textAlign: 'center', lineHeight: 1.4 }}>
              Opens official iGOT Karmayogi platform (<span style={{ color: 'var(--color-accent-gold)', fontWeight: 600 }}>igotkarmayogi.gov.in</span>) in a new tab • DEMO / MOCK MODE
            </p>
          </div>

          {/* Competency Mapping */}
          <div className="card" style={{marginBottom: 'var(--space-lg)'}}>
            <h4 style={{fontSize: '0.9rem', fontWeight: 700, marginBottom: 'var(--space-md)'}}>
              <Target size={16} style={{verticalAlign: 'middle', marginRight: 6}} />
              Competency Mapping
            </h4>
            <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)'}}>
              {(course.competencies || []).map(comp => (
                <div key={comp.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 12px', borderRadius: 'var(--radius-md)',
                  background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)'
                }}>
                  <span style={{fontSize: '0.82rem', fontWeight: 500}}>{comp.name}</span>
                  <span className={`competency-badge ${comp.weight}`}>{comp.weight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Course Info */}
          <div className="card">
            <h4 style={{fontSize: '0.9rem', fontWeight: 700, marginBottom: 'var(--space-md)'}}>
              Course Info
            </h4>
            <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem'}}>
                <span style={{color: 'var(--color-text-tertiary)'}}>Type</span>
                <span style={{fontWeight: 500, textTransform: 'capitalize'}}>{course.courseType}</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem'}}>
                <span style={{color: 'var(--color-text-tertiary)'}}>Source</span>
                <span className="igot-branding" style={{padding: '2px 8px', fontSize: '0.65rem'}}>iGOT</span>
              </div>
              {course.lastUpdated && (
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem'}}>
                  <span style={{color: 'var(--color-text-tertiary)'}}>Updated</span>
                  <span style={{fontWeight: 500}}>{formatDate(course.lastUpdated)}</span>
                </div>
              )}
              {course.tags && (
                <div style={{marginTop: 'var(--space-sm)'}}>
                  <span style={{fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: 4}}>Tags</span>
                  <div style={{display: 'flex', flexWrap: 'wrap', gap: 4}}>
                    {course.tags.map(tag => (
                      <span key={tag} style={{
                        fontSize: '0.65rem', padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(255,255,255,0.05)',
                        color: 'var(--color-text-tertiary)'
                      }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
