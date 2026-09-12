'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Users, BookOpen, Award, CheckCircle, TrendingUp, Building2,
  Shield, BarChart2, AlertTriangle, Layers, Filter, Download,
  Search, ArrowRight, UserCheck, Check, Sparkles
} from 'lucide-react';

const departmentsData = [
  { name: 'Field Operations Division (FOD)', officers: 620, completionRate: '84%', avgScore: '81%', activeGaps: 142 },
  { name: 'National Accounts Division (NAD)', officers: 210, completionRate: '79%', avgScore: '88%', activeGaps: 48 },
  { name: 'Economic Statistics Division (ESD)', officers: 240, completionRate: '76%', avgScore: '83%', activeGaps: 65 },
  { name: 'Social Statistics Division (SSD)', officers: 180, completionRate: '82%', avgScore: '85%', activeGaps: 38 },
  { name: 'Survey Design & Research (SDRD)', officers: 130, completionRate: '89%', avgScore: '90%', activeGaps: 22 },
  { name: 'Data Informatics & Innovation (DIID)', officers: 100, completionRate: '92%', avgScore: '89%', activeGaps: 15 }
];

const heatmapCompetencies = [
  'Survey Design',
  'National Accounts',
  'Python / R Analytics',
  'Price & CPI Indices',
  'Data Quality & Governance',
  'SDG 2030 Indicators'
];

const heatmapData = [
  { dept: 'FOD', scores: [88, 42, 54, 76, 68, 60] },
  { dept: 'NAD', scores: [65, 94, 72, 85, 78, 70] },
  { dept: 'ESD', scores: [72, 70, 68, 92, 74, 65] },
  { dept: 'SSD', scores: [75, 60, 64, 68, 80, 95] },
  { dept: 'SDRD', scores: [96, 68, 82, 74, 85, 72] },
  { dept: 'DIID', scores: [80, 65, 96, 70, 90, 80] }
];

const mockLearnersList = [
  { id: 'USR001', name: 'Dr. Priya Sharma', designation: 'Deputy Director', division: 'NAD', score: 82, completedCourses: 5, inProgress: 2, status: 'Active' },
  { id: 'USR002', name: 'Rajesh Kumar', designation: 'Statistical Officer', division: 'FOD', score: 74, completedCourses: 3, inProgress: 1, status: 'Active' },
  { id: 'USR003', name: 'Sunita Rao', designation: 'Joint Director', division: 'SDRD', score: 91, completedCourses: 7, inProgress: 0, status: 'Compliant' },
  { id: 'USR004', name: 'Amitabh Sen', designation: 'Deputy Director', division: 'ESD', score: 78, completedCourses: 4, inProgress: 2, status: 'Active' },
  { id: 'USR005', name: 'Meenakshi Iyer', designation: 'Assistant Director', division: 'DIID', score: 88, completedCourses: 6, inProgress: 1, status: 'Compliant' },
  { id: 'USR006', name: 'Vikram Singh', designation: 'Statistical Officer', division: 'SSD', score: 69, completedCourses: 2, inProgress: 3, status: 'Needs Training' }
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'heatmap' | 'learners'
  const [learnerSearch, setLearnerSearch] = useState('');

  const getHeatmapColor = (score) => {
    if (score >= 85) return '#0D9488'; // Teal
    if (score >= 70) return '#4F46E5'; // Indigo
    if (score >= 50) return '#D97706'; // Amber
    return '#DC2626'; // Red
  };

  const filteredLearners = useMemo(() => {
    if (!learnerSearch.trim()) return mockLearnersList;
    const q = learnerSearch.toLowerCase();
    return mockLearnersList.filter(l => 
      l.name.toLowerCase().includes(q) || 
      l.designation.toLowerCase().includes(q) || 
      l.division.toLowerCase().includes(q)
    );
  }, [learnerSearch]);

  return (
    <div className="page-container animate-fade-in" style={{ paddingBottom: 48 }}>
      {/* Top Header */}
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'linear-gradient(135deg, #3730A3, #4F46E5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)', color: '#FFFFFF'
            }}>
              <Shield size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h1 className="page-title" style={{ margin: 0 }}>
                  Cadre Skill Intelligence Admin
                </h1>
                <span className="badge badge-accent" style={{ fontSize: '0.72rem', padding: '3px 8px' }}>
                  MoSPI Executive Dashboard
                </span>
              </div>
              <p className="page-subtitle" style={{ margin: '4px 0 0 0' }}>
                Indian Statistical Service (ISS) workforce analytics, divisional competency matrices, and training compliance.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}>
              <Download size={15} /> Export Cadre Report
            </button>
            <span className="badge badge-success" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              Cadre Strength: 1,480 Officers
            </span>
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
            className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.84rem', padding: '8px 16px' }}
            onClick={() => setActiveTab('overview')}
          >
            Cadre Overview
          </button>
          <button
            className={`btn ${activeTab === 'heatmap' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.84rem', padding: '8px 16px' }}
            onClick={() => setActiveTab('heatmap')}
          >
            Competency Heatmaps
          </button>
          <button
            className={`btn ${activeTab === 'learners' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.84rem', padding: '8px 16px' }}
            onClick={() => setActiveTab('learners')}
          >
            Learner Management ({mockLearnersList.length})
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span className="stat-label">Total Officers</span>
            <div className="stat-icon" style={{ background: '#EEF2FF', color: 'var(--color-brand)', marginBottom: 0 }}>
              <Users size={20} />
            </div>
          </div>
          <div className="stat-value" style={{ color: 'var(--color-brand)' }}>1,480</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: 4 }}>Across 6 Central Divisions</div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span className="stat-label">Active Programmes</span>
            <div className="stat-icon" style={{ background: '#FEF3C7', color: '#D97706', marginBottom: 0 }}>
              <BookOpen size={20} />
            </div>
          </div>
          <div className="stat-value" style={{ color: '#D97706' }}>60</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: 4 }}>42 iGOT / 18 NSSTA Modules</div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span className="stat-label">Completion Rate</span>
            <div className="stat-icon" style={{ background: '#F0FDF4', color: '#0D9488', marginBottom: 0 }}>
              <CheckCircle size={20} />
            </div>
          </div>
          <div className="stat-value" style={{ color: '#0D9488' }}>78.4%</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: 4 }}>+4.2% vs last assessment cycle</div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span className="stat-label">Average Score</span>
            <div className="stat-icon" style={{ background: '#FDF4FF', color: '#7C3AED', marginBottom: 0 }}>
              <Award size={20} />
            </div>
          </div>
          <div className="stat-value" style={{ color: '#7C3AED' }}>82.6%</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: 4 }}>Official Cadre Evaluation benchmark</div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: CADRE OVERVIEW & DIVISION PARTICIPATION           */}
      {/* ======================================================== */}
      {activeTab === 'overview' && (
        <div className="card" style={{ padding: '24px 28px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 16px 0' }}>
            Divisional Training Participation & Compliance
          </h3>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Department / Division</th>
                  <th>Cadre Strength</th>
                  <th>Course Completion</th>
                  <th>Avg Assessment Score</th>
                  <th>Active Gaps</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {departmentsData.map((dept, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 700 }}>{dept.name}</td>
                    <td style={{ color: 'var(--color-text-secondary)' }}>{dept.officers} Officers</td>
                    <td style={{ color: '#0D9488', fontWeight: 700 }}>{dept.completionRate}</td>
                    <td style={{ fontWeight: 700 }}>{dept.avgScore}</td>
                    <td style={{ color: '#D97706', fontWeight: 600 }}>{dept.activeGaps} Gaps</td>
                    <td>
                      <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>COMPLIANT</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: COMPETENCY HEATMAP MATRIX                         */}
      {/* ======================================================== */}
      {activeTab === 'heatmap' && (
        <div className="card" style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <BarChart2 size={20} color="var(--color-brand)" />
                MoSPI Divisional Skill-Gap Heatmap Matrix
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.84rem', color: 'var(--color-text-secondary)' }}>
                Cross-divisional competency index. Teal = High proficiency (&gt;85%) | Indigo = Good (70-84%) | Amber = Moderate (50-69%) | Red = Critical Gap (&lt;50%).
              </p>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: '0.78rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: '#0D9488' }} /> &gt;85%
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: '#4F46E5' }} /> 70-84%
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: '#D97706' }} /> 50-69%
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: '#DC2626' }} /> &lt;50%
              </span>
            </div>
          </div>

          <div className="table-container">
            <table className="table" style={{ textAlign: 'center' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Division</th>
                  {heatmapCompetencies.map((comp, idx) => (
                    <th key={idx} style={{ minWidth: 120 }}>{comp}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapData.map((row, rIdx) => (
                  <tr key={rIdx}>
                    <td style={{ textAlign: 'left', fontWeight: 700 }}>{row.dept}</td>
                    {row.scores.map((score, sIdx) => (
                      <td key={sIdx} style={{ padding: '8px' }}>
                        <div style={{
                          background: getHeatmapColor(score),
                          color: '#FFFFFF',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          padding: '6px 4px',
                          borderRadius: 'var(--radius-sm)'
                        }}>
                          {score}%
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: LEARNER MANAGEMENT                                */}
      {/* ======================================================== */}
      {activeTab === 'learners' && (
        <div className="card" style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
              Registered Officers & Learners Directory
            </h3>

            <div style={{ position: 'relative', minWidth: 260 }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                className="input"
                style={{ width: '100%', padding: '8px 12px 8px 34px', fontSize: '0.85rem' }}
                placeholder="Search officer, role, or division..."
                value={learnerSearch}
                onChange={e => setLearnerSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Officer Name</th>
                  <th>Designation</th>
                  <th>Division</th>
                  <th>Competency Score</th>
                  <th>Completed Modules</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredLearners.map((learner) => (
                  <tr key={learner.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{learner.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>ID: {learner.id}</div>
                    </td>
                    <td style={{ color: 'var(--color-text-secondary)' }}>{learner.designation}</td>
                    <td><span className="badge badge-neutral">{learner.division}</span></td>
                    <td>
                      <strong style={{ color: learner.score >= 80 ? '#0D9488' : '#D97706' }}>
                        {learner.score}%
                      </strong>
                    </td>
                    <td style={{ color: 'var(--color-text-secondary)' }}>
                      {learner.completedCourses} courses ({learner.inProgress} active)
                    </td>
                    <td>
                      <span className={`badge ${learner.status === 'Compliant' ? 'badge-success' : learner.status === 'Active' ? 'badge-accent' : 'badge-warning'}`}>
                        {learner.status}
                      </span>
                    </td>
                    <td>
                      <Link
                        href="/profile"
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      >
                        Profile <ArrowRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
