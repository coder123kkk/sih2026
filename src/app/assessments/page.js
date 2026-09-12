'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Award, CheckCircle, HelpCircle, AlertCircle, Clock,
  BarChart2, FileText, ChevronRight, RefreshCw, Send, ShieldCheck,
  TrendingUp, BookOpen, ExternalLink, ArrowRight, Check, X, Shield,
  ChevronDown, Layers, Code
} from 'lucide-react';

export default function AssessmentsPage() {
  const [questions, setQuestions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [history, setHistory] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('take-exam'); // 'take-exam' | 'bank' | 'history'
  const [selectedCourse, setSelectedCourse] = useState('COURSE_ALL');
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);

  const fetchAssessment = (courseId) => {
    setLoading(true);
    fetch(`/api/assessments?courseId=${courseId}`)
      .then(r => r.json())
      .then(d => {
        setQuestions(d.questions || []);
        setCourses(d.courses || []);
        setHistory(d.history || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAssessment(selectedCourse);
  }, []);

  const handleCourseChange = (courseId) => {
    setSelectedCourse(courseId);
    setCourseDropdownOpen(false);
    setAnswers({});
    setSubmitted(false);
    setScoreResult(null);
    fetchAssessment(courseId);
  };

  const activeCourse = courses.find(c => c.id === selectedCourse) || courses[0] || {};


  const handleSingleSelect = (qid, index) => {
    if (submitted) return;
    setAnswers({ ...answers, [qid]: index });
  };

  const handleMultiSelect = (qid, index) => {
    if (submitted) return;
    const current = answers[qid] || [];
    if (current.includes(index)) {
      setAnswers({ ...answers, [qid]: current.filter(i => i !== index) });
    } else {
      setAnswers({ ...answers, [qid]: [...current, index] });
    }
  };

  const handleTextOrNumChange = (qid, val) => {
    if (submitted) return;
    setAnswers({ ...answers, [qid]: val });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'USR001', answers, courseId: selectedCourse })
      });
      const data = await res.json();
      setScoreResult(data);
      setSubmitted(true);
      if (data.historyItem) {
        setHistory(prev => [data.historyItem, ...prev]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setScoreResult(null);
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercent = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  return (
    <div className="page-container animate-fade-in" style={{ paddingBottom: 48 }}>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'linear-gradient(135deg, #0D9488, #10B981)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(13, 148, 136, 0.3)', color: '#FFFFFF'
            }}>
              <Award size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h1 className="page-title" style={{ margin: 0 }}>
                  Competency Assessment Center
                </h1>
                <span className="badge badge-success" style={{ fontSize: '0.72rem', padding: '3px 8px' }}>
                  Cadre Evaluation & APAR Integrated
                </span>
              </div>
              <p className="page-subtitle" style={{ margin: '4px 0 0 0' }}>
                Official standardized evaluations mapped to National Statistical System competencies and live skill-gap tracking.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex', gap: 8, marginTop: 20,
          background: '#FFFFFF', padding: '4px',
          borderRadius: 'var(--radius-lg)', width: 'fit-content',
          border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)'
        }}>
          <button
            className={`btn ${activeTab === 'take-exam' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.84rem', padding: '8px 16px' }}
            onClick={() => setActiveTab('take-exam')}
          >
            Active Assessment
          </button>
          <button
            className={`btn ${activeTab === 'bank' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.84rem', padding: '8px 16px' }}
            onClick={() => setActiveTab('bank')}
          >
            Official Question Bank ({questions.length})
          </button>
          <button
            className={`btn ${activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.84rem', padding: '8px 16px' }}
            onClick={() => setActiveTab('history')}
          >
            Assessment Records ({history.length})
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: ACTIVE ASSESSMENT EXAM                            */}
      {/* ======================================================== */}
      {activeTab === 'take-exam' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Course Selector */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setCourseDropdownOpen(!courseDropdownOpen)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 20px', borderRadius: 'var(--radius-lg)',
                border: '2px solid var(--color-brand)', background: '#FFFFFF',
                cursor: 'pointer', fontSize: '0.92rem', fontWeight: 700,
                color: 'var(--color-text-primary)', boxShadow: 'var(--shadow-sm)',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'linear-gradient(135deg, var(--color-brand), #7C3AED)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF'
                }}>
                  {activeCourse.icon === 'shield' && <Shield size={18} />}
                  {activeCourse.icon === 'bar-chart' && <BarChart2 size={18} />}
                  {activeCourse.icon === 'layers' && <Layers size={18} />}
                  {activeCourse.icon === 'code' && <Code size={18} />}
                  {activeCourse.icon === 'trending-up' && <TrendingUp size={18} />}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div>{activeCourse.title || 'Select Assessment Course'}</div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 500, color: 'var(--color-text-muted)', marginTop: 2 }}>
                    {activeCourse.description || 'Choose a course to begin'}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {activeCourse.difficulty && (
                  <span className="badge badge-accent" style={{ fontSize: '0.7rem' }}>{activeCourse.difficulty}</span>
                )}
                {activeCourse.duration && (
                  <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                    <Clock size={11} style={{ marginRight: 3 }} />{activeCourse.duration}
                  </span>
                )}
                <ChevronDown size={18} style={{
                  transition: 'transform 0.2s ease',
                  transform: courseDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  color: 'var(--color-brand)'
                }} />
              </div>
            </button>

            {/* Dropdown Options */}
            {courseDropdownOpen && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
                marginTop: 6, background: '#FFFFFF', borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-lg)',
                overflow: 'hidden', animation: 'fadeIn 0.15s ease'
              }}>
                {courses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => handleCourseChange(course.id)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 20px', cursor: 'pointer',
                      background: selectedCourse === course.id ? 'var(--color-brand-tint)' : '#FFFFFF',
                      borderLeft: selectedCourse === course.id ? '3px solid var(--color-brand)' : '3px solid transparent',
                      borderBottom: '1px solid var(--color-border)',
                      transition: 'all var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => { if (selectedCourse !== course.id) e.currentTarget.style.background = '#F8FAFC'; }}
                    onMouseLeave={(e) => { if (selectedCourse !== course.id) e.currentTarget.style.background = '#FFFFFF'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 8,
                        background: selectedCourse === course.id
                          ? 'linear-gradient(135deg, var(--color-brand), #7C3AED)'
                          : '#F1F5F9',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: selectedCourse === course.id ? '#FFF' : 'var(--color-text-secondary)'
                      }}>
                        {course.icon === 'shield' && <Shield size={16} />}
                        {course.icon === 'bar-chart' && <BarChart2 size={16} />}
                        {course.icon === 'layers' && <Layers size={16} />}
                        {course.icon === 'code' && <Code size={16} />}
                        {course.icon === 'trending-up' && <TrendingUp size={16} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-text-primary)' }}>
                          {course.title}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                          {course.competencies} · {course.questionsCount} Questions · {course.duration}
                        </div>
                      </div>
                    </div>
                    {selectedCourse === course.id && (
                      <CheckCircle size={18} color="var(--color-brand)" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Exam Summary & Live Progress Bar Banner */}
          <div className="card" style={{
            background: 'linear-gradient(135deg, #F0FDF4 0%, #EEF2FF 100%)',
            border: '1px solid #BBF7D0',
            padding: '24px 28px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '3px 10px', borderRadius: 'var(--radius-full)',
                  background: '#FFFFFF', border: '1px solid #BBF7D0',
                  color: '#15803D', fontSize: '0.74rem', fontWeight: 700, marginBottom: 8
                }}>
                  <ShieldCheck size={14} color="#10B981" />
                  Official Cadre Evaluation
                </div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--color-text-primary)' }}>
                  {activeCourse.title || 'Select an Assessment Course'}
                </h2>
                <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--color-text-secondary)' }}>
                  Questions: <strong>{questions.length}</strong> (MCQ, Multi-select, Numerical, Scenario) | Passing Grade: <strong>{activeCourse.passingGrade || 70}%</strong> | Competencies Evaluated: <strong>{activeCourse.competencies || '—'}</strong>
                </p>
              </div>

              {submitted && scoreResult ? (
                <div style={{
                  background: '#FFFFFF', padding: '16px 24px',
                  borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)',
                  textAlign: 'center', boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{
                    fontSize: '2rem', fontWeight: 800,
                    color: scoreResult.passed ? '#0D9488' : '#DC2626'
                  }}>
                    {scoreResult.percentage}%
                  </div>
                  <span className={`badge ${scoreResult.passed ? 'badge-success' : 'badge-danger'}`}>
                    {scoreResult.passed ? 'PASSED — APAR Verified' : 'NEEDS IMPROVEMENT'}
                  </span>
                </div>
              ) : (
                <div style={{ minWidth: 220, textAlign: 'right' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: 6 }}>
                    Answered: <strong>{answeredCount} of {questions.length}</strong> ({progressPercent}%)
                  </div>
                  <div className="progress-bar-container" style={{ height: 8 }}>
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${progressPercent}%`, background: 'var(--gradient-teal)' }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RESULTS SUMMARY AFTER SUBMISSION */}
          {submitted && scoreResult && (
            <div className="card animate-fade-in" style={{ padding: 24, border: '1px solid #BBF7D0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ShieldCheck size={22} color={scoreResult.passed ? '#0D9488' : '#D97706'} />
                    Assessment Evaluation & Competency Impact Summary
                  </h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.84rem', color: 'var(--color-text-secondary)' }}>
                    Your assessment answers have been officially evaluated, scores mapped, and competency gaps recalculated.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <Link href="/profile" className="btn btn-primary btn-sm">
                    <BarChart2 size={14} /> View Updated Competencies
                  </Link>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setActiveTab('history')}
                  >
                    <FileText size={14} /> View History ({history.length})
                  </button>
                </div>
              </div>

              {/* Stat Pills */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 12, marginBottom: 20
              }}>
                <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Score</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: scoreResult.passed ? '#0D9488' : '#DC2626', marginTop: 2 }}>
                    {scoreResult.earnedPoints} / {scoreResult.totalPoints} <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>({scoreResult.percentage}%)</span>
                  </div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Evaluation Status</span>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: scoreResult.passed ? '#0D9488' : '#D97706', marginTop: 4 }}>
                    {scoreResult.passed ? 'PASSED (APAR Level)' : 'REQUIRES TRAINING'}
                  </div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Demonstrated Strengths</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0D9488', marginTop: 2 }}>
                    {scoreResult.strengths?.length || 0} <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Competencies Boosted</span>
                  </div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Identified Skill Gaps</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: (scoreResult.weakAreas?.length > 0) ? '#DC2626' : '#0D9488', marginTop: 2 }}>
                    {scoreResult.weakAreas?.length || 0} <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Requiring Training</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Question List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {questions.map((q, idx) => {
              const detail = scoreResult?.details?.find(d => d.questionId === q.id);

              return (
                <div key={q.id} className="card" style={{ padding: '24px 28px', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        background: '#EEF2FF', padding: '3px 10px',
                        borderRadius: 'var(--radius-sm)', fontWeight: 800, fontSize: '0.82rem', color: 'var(--color-brand)'
                      }}>
                        Question {idx + 1}
                      </span>
                      <span className="badge badge-neutral" style={{ fontSize: '0.72rem', textTransform: 'uppercase' }}>
                        {q.type.replace('-', ' ')}
                      </span>
                      {detail?.competencyName && (
                        <span className="badge badge-accent" style={{ fontSize: '0.72rem' }}>
                          Mapped: {detail.competencyName}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                      {q.points} Points
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 16, lineHeight: 1.4 }}>
                    {q.question}
                  </h3>

                  {/* Single MCQ / True-False / Scenario Options */}
                  {(q.type === 'single-mcq' || q.type === 'scenario' || q.type === 'true-false') && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {q.options.map((opt, oIdx) => {
                        const isSelected = answers[q.id] === oIdx;
                        let optStyle = {
                          padding: '12px 16px', borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--color-border)', background: '#FFFFFF',
                          cursor: submitted ? 'default' : 'pointer', fontSize: '0.9rem',
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          transition: 'all var(--transition-fast)'
                        };

                        if (submitted) {
                          if (oIdx === q.correctAnswer) {
                            optStyle.borderColor = '#10B981';
                            optStyle.background = '#F0FDF4';
                          } else if (isSelected && !detail?.isCorrect) {
                            optStyle.borderColor = '#EF4444';
                            optStyle.background = '#FEE2E2';
                          }
                        } else if (isSelected) {
                          optStyle.borderColor = 'var(--color-brand)';
                          optStyle.background = 'var(--color-brand-tint)';
                          optStyle.boxShadow = '0 0 0 2px rgba(79, 70, 229, 0.15)';
                        }

                        return (
                          <div
                            key={oIdx}
                            style={optStyle}
                            onClick={() => handleSingleSelect(q.id, oIdx)}
                          >
                            <span style={{ fontWeight: isSelected ? 600 : 400 }}>{opt}</span>
                            {submitted && oIdx === q.correctAnswer && (
                              <CheckCircle size={17} color="#10B981" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Multi-Answer MCQ */}
                  {q.type === 'multi-mcq' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {q.options.map((opt, oIdx) => {
                        const selectedList = answers[q.id] || [];
                        const isChecked = selectedList.includes(oIdx);
                        const isKeyCorrect = q.correctAnswers?.includes(oIdx);

                        let optStyle = {
                          padding: '12px 16px', borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--color-border)', background: '#FFFFFF',
                          cursor: submitted ? 'default' : 'pointer', fontSize: '0.9rem',
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                        };

                        if (submitted) {
                          if (isKeyCorrect) {
                            optStyle.borderColor = '#10B981';
                            optStyle.background = '#F0FDF4';
                          } else if (isChecked && !isKeyCorrect) {
                            optStyle.borderColor = '#EF4444';
                            optStyle.background = '#FEE2E2';
                          }
                        } else if (isChecked) {
                          optStyle.borderColor = 'var(--color-brand)';
                          optStyle.background = 'var(--color-brand-tint)';
                        }

                        return (
                          <div
                            key={oIdx}
                            style={optStyle}
                            onClick={() => handleMultiSelect(q.id, oIdx)}
                          >
                            <span style={{ fontWeight: isChecked ? 600 : 400 }}>{opt}</span>
                            {submitted && isKeyCorrect && (
                              <CheckCircle size={17} color="#10B981" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Numerical Question */}
                  {q.type === 'numerical' && (
                    <div style={{ marginTop: 10 }}>
                      <input
                        type="number"
                        step="any"
                        className="input"
                        placeholder="Enter numerical answer..."
                        value={answers[q.id] !== undefined ? answers[q.id] : ''}
                        onChange={e => handleTextOrNumChange(q.id, e.target.value)}
                        disabled={submitted}
                        style={{ maxWidth: 280, padding: '10px 14px' }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Footer */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginTop: 10, padding: '16px 20px', background: '#FFFFFF',
            borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)'
          }}>
            <button
              className="btn btn-secondary"
              onClick={handleReset}
            >
              Reset Answers
            </button>

            {!submitted ? (
              <button
                className="btn btn-primary btn-lg"
                onClick={handleSubmit}
                disabled={answeredCount === 0}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <Send size={16} /> Submit Assessment for Evaluation
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={handleReset}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <RefreshCw size={16} /> Retake Assessment
              </button>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: OFFICIAL QUESTION BANK                            */}
      {/* ======================================================== */}
      {activeTab === 'bank' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {questions.map((q, idx) => (
            <div key={q.id} className="card" style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className="badge badge-accent">Question #{idx + 1}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Type: {q.type}</span>
              </div>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', fontWeight: 700 }}>
                {q.question}
              </h4>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                Competency Target: <strong>{q.competencyId || 'National Accounts / Sampling'}</strong>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: ASSESSMENT HISTORY & RECORDS                      */}
      {/* ======================================================== */}
      {activeTab === 'history' && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Assessment Examination</th>
                <th>Score</th>
                <th>Result</th>
                <th>Competencies Upgraded</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, idx) => (
                <tr key={idx}>
                  <td style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
                    {new Date(h.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{h.examTitle || 'Cadre Diagnostic Assessment'}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>Official Cadre Evaluation</div>
                  </td>
                  <td>
                    <strong style={{ color: h.percentage >= 70 ? '#0D9488' : '#DC2626' }}>
                      {h.score} / {h.maxScore} ({h.percentage}%)
                    </strong>
                  </td>
                  <td>
                    <span className={`badge ${h.percentage >= 70 ? 'badge-success' : 'badge-danger'}`}>
                      {h.percentage >= 70 ? 'PASSED' : 'RETRY REQUIRED'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    {h.upgradedCompetencies?.join(', ') || 'National Accounts (+10%), Python (+8%)'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
