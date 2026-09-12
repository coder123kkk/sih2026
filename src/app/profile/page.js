'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User, Building2, MapPin, Calendar, Award, Shield, Briefcase,
  Target, ChevronRight, Edit3, X, Save, Check, GraduationCap, Wrench,
  Search, Sparkles, Layers, BookOpen, TrendingUp, TrendingDown,
  AlertTriangle, Filter, ArrowUpDown, ArrowRight, CheckCircle2,
  ExternalLink, Clock, FileText, Info, Link2, Unlink, CheckCircle
} from 'lucide-react';
import { getGapColor, getGapEmoji, getGapStatusColor } from '@/lib/utils';

const categoryStructure = [
  { id: 'statistical', name: 'STATISTICAL', color: '#3B82F6', icon: '📊', description: 'Methodology, survey design, sampling and official accounts' },
  { id: 'technical', name: 'TECHNICAL', color: '#8B5CF6', icon: '💻', description: 'Statistical programming, analytics software, and data engineering' },
  { id: 'digital', name: 'DIGITAL GOVERNANCE', color: '#10B981', icon: '🛡️', description: 'Data privacy, cybersecurity, DPI and government infrastructure' },
  { id: 'behavioural', name: 'BEHAVIOURAL & MANAGERIAL', color: '#F59E0B', icon: '🤝', description: 'Leadership, ethics, communication and institutional change' }
];

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [competencies, setCompetencies] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Full Analysis Modal State
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [analysisFilter, setAnalysisFilter] = useState('all'); // 'all' | 'strong' | 'gaps' | 'high-priority'
  const [analysisCategory, setAnalysisCategory] = useState('all'); // 'all' | 'statistical' | 'technical' | 'digital' | 'behavioural'
  const [analysisSort, setAnalysisSort] = useState('gap-desc'); // 'gap-desc' | 'score-asc' | 'score-desc' | 'name-asc'
  const [analysisSearch, setAnalysisSearch] = useState('');

  // Recommendation View Modal State (iGOT, NSSTA, Internal Resources)
  const [recommendationModal, setRecommendationModal] = useState({
    open: false,
    loading: false,
    error: null,
    competency: null,
    data: null
  });
  const [recActiveTab, setRecActiveTab] = useState('all'); // 'all' | 'igot' | 'nssta' | 'internal'
  const [actionFeedback, setActionFeedback] = useState({});

  // Demo iGOT Linking State
  const [showDemoLinkModal, setShowDemoLinkModal] = useState(false);
  const [demoProfiles, setDemoProfiles] = useState([]);
  const [selectedDemoId, setSelectedDemoId] = useState('IGOT-DEMO-001');
  const [linkingDemo, setLinkingDemo] = useState(false);
  const [linkedLearnerData, setLinkedLearnerData] = useState(null);
  const [showSyncedCourses, setShowSyncedCourses] = useState(false);

  // Open Demo iGOT Linking Modal
  const handleOpenDemoModal = async () => {
    setShowDemoLinkModal(true);
    try {
      const res = await fetch('/api/igot/demo-link?userId=USR001');
      if (res.ok) {
        const data = await res.json();
        setDemoProfiles(data.profiles || []);
        if (data.currentLinkedId) {
          setSelectedDemoId(data.currentLinkedId);
        }
      }
    } catch (e) {
      console.error('Failed fetching demo profiles', e);
    }
  };

  // Link selected Demo iGOT Profile
  const handleLinkDemoAccount = async (overrideId) => {
    const learnerId = overrideId || selectedDemoId;
    if (!learnerId) return;
    setLinkingDemo(true);
    try {
      const res = await fetch('/api/igot/demo-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'USR001', learnerId })
      });
      if (res.ok) {
        const data = await res.json();
        try {
          localStorage.setItem('mospi_demo_igot_learner', learnerId);
        } catch (e) {}

        setLinkedLearnerData(data.learnerData);
        setProfile(prev => ({
          ...prev,
          igotLearnerId: learnerId,
          integrations: {
            ...prev?.integrations,
            igot: {
              ...prev?.integrations?.igot,
              status: 'Demo Connected',
              connected: true,
              id: learnerId,
              badge: 'DEMO / MOCK MODE',
              activeProvider: 'MockiGOTProvider',
              message: `Demo profile linked: ${data.profile?.name || learnerId}`
            }
          }
        }));
        setShowDemoLinkModal(false);
      }
    } catch (err) {
      console.error('Failed to link demo iGOT', err);
    } finally {
      setLinkingDemo(false);
    }
  };

  // Unlink Demo iGOT Profile
  const handleUnlinkDemoAccount = async () => {
    try {
      await fetch('/api/igot/demo-link?userId=USR001', { method: 'DELETE' });
      try {
        localStorage.removeItem('mospi_demo_igot_learner');
      } catch (e) {}

      setLinkedLearnerData(null);
      setProfile(prev => ({
        ...prev,
        igotLearnerId: null,
        integrations: {
          ...prev?.integrations,
          igot: {
            ...prev?.integrations?.igot,
            status: 'Not Connected',
            connected: false,
            id: null,
            badge: 'DEMO / MOCK MODE',
            activeProvider: 'MockiGOTProvider',
            message: 'Official iGOT API credentials & configuration required (IGOT_CLIENT_ID, IGOT_CLIENT_SECRET, IGOT_API_BASE_URL)'
          }
        }
      }));
    } catch (err) {
      console.error('Failed to unlink demo iGOT', err);
    }
  };

  // Open Recommendation View Modal for a specific competency
  const handleOpenRecommendations = async (comp) => {
    setRecommendationModal({
      open: true,
      loading: true,
      error: null,
      competency: comp,
      data: null
    });
    setRecActiveTab('all');

    try {
      const params = new URLSearchParams({
        competencyId: comp.id || '',
        competencyName: comp.name || '',
        userId: 'USR001',
        currentScore: String(comp.currentScore ?? ''),
        requiredScore: String(comp.requiredScore ?? ''),
        gapScore: String(comp.gapScore ?? ''),
        gapStatus: String(comp.gapStatus ?? '')
      });
      const res = await fetch(`/api/recommendations/competency?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load learning recommendations');
      const data = await res.json();
      setRecommendationModal(prev => ({
        ...prev,
        loading: false,
        data
      }));
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setRecommendationModal(prev => ({
        ...prev,
        loading: false,
        error: 'Unable to load recommendations. Please try again.'
      }));
    }
  };

  const handleResourceAction = (resourceId, actionName) => {
    setActionFeedback(prev => ({ ...prev, [resourceId]: actionName }));
    setTimeout(() => {
      setActionFeedback(prev => {
        const next = { ...prev };
        delete next[resourceId];
        return next;
      });
    }, 3500);
  };

  // Fetch initial profile & competencies
  useEffect(() => {
    let cachedProfile = null;
    try {
      const stored = localStorage.getItem('mospi_user_profile');
      if (stored) {
        cachedProfile = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed reading localStorage', e);
    }

    Promise.all([
      fetch('/api/competencies?userId=USR001').then(r => r.json()),
      fetch('/api/users/profile').then(r => r.json())
    ]).then(([compData, userData]) => {
      setCompetencies(compData);
      
      const baseUser = userData || {
        name: 'Dr. Priya Sharma',
        designation: 'Deputy Director',
        department: 'Labour Statistics Division',
        ministry: 'Ministry of Statistics & Programme Implementation',
        organization: 'National Statistical Office',
        grade: 'Group A',
        cadre: 'Indian Statistical Service',
        location: 'New Delhi',
        yearsOfService: 8,
        email: 'priya.sharma@mospi.gov.in',
        jobRole: 'Survey Data Compilation & Statistical Analysis',
        currentAssignment: 'Periodic Labour Force Survey (PLFS) & CPI Compilation',
        qualification: 'Ph.D. in Agricultural Statistics, M.Stat',
        skills: ['Sample Survey Design', 'Python', 'Pandas', 'Macroeconomic Aggregates', 'Data Quality Framework'],
        parichayId: null,
        igotLearnerId: null
      };

      const finalProfile = {
        ...baseUser,
        ...(cachedProfile || {})
      };

      let storedDemoLearnerId = null;
      try {
        storedDemoLearnerId = localStorage.getItem('mospi_demo_igot_learner');
      } catch (e) {}

      const activeDemoId = finalProfile.igotLearnerId || storedDemoLearnerId;

      // Always preserve the live integration configuration/status from the backend
      finalProfile.integrations = userData?.integrations || {
        environment: 'demo',
        isDemoMode: true,
        isProduction: false,
        parichay: {
          name: 'Parichay SSO',
          status: 'Not Connected',
          connected: false,
          mode: 'demo',
          id: finalProfile.parichayId || null,
          badge: 'DEMO / MOCK AUTH',
          message: 'Available when SSO is configured'
        },
        igot: {
          name: 'iGOT Karmayogi',
          status: activeDemoId ? 'Demo Connected' : 'Not Connected',
          connected: Boolean(activeDemoId),
          environment: 'demo',
          activeProvider: 'MockiGOTProvider',
          hasCredentials: false,
          id: activeDemoId || null,
          badge: 'DEMO / MOCK MODE',
          message: activeDemoId
            ? `Demo profile linked: ${activeDemoId}`
            : 'Official iGOT API credentials & configuration required (IGOT_CLIENT_ID, IGOT_CLIENT_SECRET, IGOT_API_BASE_URL)'
        }
      };

      if (activeDemoId) {
        finalProfile.igotLearnerId = activeDemoId;
        finalProfile.integrations.igot.status = 'Demo Connected';
        finalProfile.integrations.igot.connected = true;
        finalProfile.integrations.igot.id = activeDemoId;
        setSelectedDemoId(activeDemoId);

        // Fetch demo learner data for this ID
        fetch(`/api/igot/learner?userId=${activeDemoId}`)
          .then(r => r.json())
          .then(data => {
            if (data && data.enrollments) {
              setLinkedLearnerData(data);
            }
          })
          .catch(e => console.error('Failed fetching demo learner data', e));
      }

      setProfile(finalProfile);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      if (cachedProfile) {
        setProfile(cachedProfile);
      }
      setLoading(false);
    });
  }, []);

  // Compute initials for avatar
  const getInitials = (name) => {
    if (!name) return 'PS';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Open Edit Modal
  const handleOpenEdit = () => {
    setFormData({
      name: profile?.name || '',
      designation: profile?.designation || '',
      department: profile?.department || '',
      ministry: profile?.ministry || 'Ministry of Statistics & Programme Implementation',
      organization: profile?.organization || 'National Statistical Office',
      jobRole: profile?.jobRole || '',
      currentAssignment: profile?.currentAssignment || '',
      qualification: profile?.qualification || '',
      yearsOfService: profile?.yearsOfService !== undefined ? profile?.yearsOfService : 8,
      location: profile?.location || '',
      skills: Array.isArray(profile?.skills) ? profile.skills.join(', ') : (profile?.skills || '')
    });
    setFormErrors({});
    setIsEditing(true);
  };

  // Validate form fields
  const validateForm = () => {
    const errors = {};
    if (!formData.name?.trim()) errors.name = 'Name is required';
    if (!formData.designation?.trim()) errors.designation = 'Designation is required';
    if (!formData.department?.trim()) errors.department = 'Department is required';
    if (!formData.ministry?.trim()) errors.ministry = 'Organization / Ministry is required';
    if (formData.yearsOfService === '' || isNaN(formData.yearsOfService) || Number(formData.yearsOfService) < 0) {
      errors.yearsOfService = 'Years of service must be a valid positive number';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save changes
  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      const skillsArray = typeof formData.skills === 'string'
        ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
        : (formData.skills || []);

      const payload = {
        name: formData.name.trim(),
        designation: formData.designation.trim(),
        department: formData.department.trim(),
        ministry: formData.ministry.trim(),
        organization: formData.organization?.trim() || 'National Statistical Office',
        jobRole: formData.jobRole.trim(),
        currentAssignment: formData.currentAssignment.trim(),
        qualification: formData.qualification.trim(),
        yearsOfService: Number(formData.yearsOfService),
        location: formData.location.trim(),
        skills: skillsArray
      };

      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const updatedData = res.ok ? await res.json() : null;

      const mergedProfile = {
        ...(profile || {}),
        ...payload,
        ...(updatedData || {})
      };

      try {
        localStorage.setItem('mospi_user_profile', JSON.stringify(mergedProfile));
      } catch (err) {
        console.error('Failed saving to localStorage', err);
      }

      setProfile(mergedProfile);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setIsEditing(false);
      }, 400);
    } catch (err) {
      console.error('Failed saving profile:', err);
      setFormErrors({ submit: 'Failed to save changes. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header"><h1 className="page-title">My Profile</h1></div>
        <div className="loading-skeleton" style={{ height: 200, borderRadius: 20 }} />
      </div>
    );
  }

  const skillsList = Array.isArray(profile?.skills)
    ? profile.skills
    : typeof profile?.skills === 'string'
      ? profile.skills.split(',').map(s => s.trim()).filter(Boolean)
      : [];

  // Summary Metrics calculations
  const allCompsList = competencies?.competencies || [];
  const overallCompetencyScore = competencies?.overallScore || 68;

  const strongestSkills = [...allCompsList]
    .sort((a, b) => b.currentScore - a.currentScore)
    .slice(0, 3);

  const weakestSkills = [...allCompsList]
    .sort((a, b) => a.currentScore - b.currentScore)
    .slice(0, 3);

  const highPriorityGaps = allCompsList.filter(
    c => c.gapStatus === 'Critical' || c.gapStatus === 'High'
  );

  const requiringTrainingCount = allCompsList.filter(c => c.gapScore > 0).length;

  // Filter and Sort Competencies for the Detailed Analysis View
  const getProcessedCompetencies = () => {
    let result = [...allCompsList];

    // Filter by category
    if (analysisCategory !== 'all') {
      result = result.filter(c => c.category === analysisCategory);
    }

    // Filter by type: 'all' | 'strong' | 'gaps' | 'high-priority'
    if (analysisFilter === 'strong') {
      result = result.filter(c => c.gapScore === 0 || c.currentScore >= 75);
    } else if (analysisFilter === 'gaps') {
      result = result.filter(c => c.gapScore > 0);
    } else if (analysisFilter === 'high-priority') {
      result = result.filter(c => c.gapStatus === 'Critical' || c.gapStatus === 'High');
    }

    // Search filter
    if (analysisSearch.trim()) {
      const q = analysisSearch.toLowerCase();
      result = result.filter(c => c.name.toLowerCase().includes(q) || (c.description && c.description.toLowerCase().includes(q)));
    }

    // Sorting
    result.sort((a, b) => {
      if (analysisSort === 'gap-desc') return b.gapScore - a.gapScore;
      if (analysisSort === 'score-asc') return a.currentScore - b.currentScore;
      if (analysisSort === 'score-desc') return b.currentScore - a.currentScore;
      if (analysisSort === 'name-asc') return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  };

  const processedCompetencies = getProcessedCompetencies();

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Official profile and competency overview</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="profile-card" style={{ position: 'relative' }}>
        <div className="profile-avatar">
          {getInitials(profile?.name)}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 style={{ margin: 0 }}>{profile?.name}</h2>
              <div className="profile-designation">{profile?.designation}</div>
              <div className="profile-org">
                {profile?.department}, {profile?.organization || profile?.ministry}
              </div>
            </div>

            {/* Edit Profile Button */}
            <button
              className="btn btn-sm btn-primary"
              onClick={handleOpenEdit}
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', padding: '6px 14px' }}
            >
              <Edit3 size={14} />
              Edit Profile
            </button>
          </div>

          <div className="profile-details" style={{ marginTop: 16 }}>
            <div className="profile-detail-item">
              <span className="profile-detail-label">Ministry / Org</span>
              <span className="profile-detail-value">{profile?.ministry}</span>
            </div>
            <div className="profile-detail-item">
              <span className="profile-detail-label">Cadre</span>
              <span className="profile-detail-value">{profile?.cadre || 'Indian Statistical Service'}</span>
            </div>
            <div className="profile-detail-item">
              <span className="profile-detail-label">Grade</span>
              <span className="profile-detail-value">{profile?.grade || 'Group A'}</span>
            </div>
            <div className="profile-detail-item">
              <span className="profile-detail-label">Location</span>
              <span className="profile-detail-value">{profile?.location || 'New Delhi'}</span>
            </div>
            <div className="profile-detail-item">
              <span className="profile-detail-label">Years of Service</span>
              <span className="profile-detail-value">{profile?.yearsOfService} years</span>
            </div>
            <div className="profile-detail-item">
              <span className="profile-detail-label">Email</span>
              <span className="profile-detail-value">{profile?.email || 'priya.sharma@mospi.gov.in'}</span>
            </div>

            {profile?.jobRole && (
              <div className="profile-detail-item">
                <span className="profile-detail-label">Job Role</span>
                <span className="profile-detail-value">{profile.jobRole}</span>
              </div>
            )}

            {profile?.currentAssignment && (
              <div className="profile-detail-item">
                <span className="profile-detail-label">Current Assignment</span>
                <span className="profile-detail-value">{profile.currentAssignment}</span>
              </div>
            )}

            {profile?.qualification && (
              <div className="profile-detail-item">
                <span className="profile-detail-label">Qualification</span>
                <span className="profile-detail-value">{profile.qualification}</span>
              </div>
            )}
          </div>

          {/* Existing Skills Badges */}
          {skillsList.length > 0 && (
            <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Existing Skills & Methodologies
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {skillsList.map((skill, idx) => (
                  <span
                    key={idx}
                    className="badge badge-neutral"
                    style={{ fontSize: '0.75rem', padding: '3px 8px', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Competency Summary & Highlights */}
      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Target size={18} style={{ marginRight: 8 }} />
              Competency Summary
            </h3>
            <button
              onClick={() => setShowAnalysisModal(true)}
              className="btn btn-sm btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
            >
              Full Analysis <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
            <div
              className="competency-score-circle"
              style={{
                '--score-percent': `${(competencies?.overallScore || 0) * 3.6}deg`,
                margin: '0 auto'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span className="competency-score-value">{competencies?.overallScore || 0}%</span>
                <span className="competency-score-label">Overall</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {competencies?.byCategory && Object.entries(competencies.byCategory).map(([cat, catObj]) => {
              const comps = Array.isArray(catObj) ? catObj : (catObj.competencies || []);
              const avg = comps.length > 0 ? Math.round(comps.reduce((s, c) => s + c.percentScore, 0) / comps.length) : 0;
              const names = { statistical: 'Statistical', technical: 'Technical', digital: 'Digital Gov.', behavioural: 'Behavioural' };
              const colors = { statistical: '#3B82F6', technical: '#8B5CF6', digital: '#10B981', behavioural: '#F59E0B' };
              return (
                <div key={cat} className="skill-gap-item" style={{ cursor: 'pointer' }} onClick={() => { setAnalysisCategory(cat); setAnalysisFilter('all'); setShowAnalysisModal(true); }}>
                  <span className="skill-gap-name">{names[cat]}</span>
                  <span className="skill-gap-level">{avg}%</span>
                  <div className="skill-gap-bar" style={{ width: 120 }}>
                    <div className="skill-gap-bar-fill" style={{ width: `${avg}%`, background: colors[cat] }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Action: High Priority Skill Gaps Requiring Learning */}
          <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Priority Recommended Learning
              </span>
              <span style={{ fontSize: '0.72rem', color: '#EF4444', fontWeight: 600 }}>
                {highPriorityGaps.length} Target Gaps
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {highPriorityGaps.slice(0, 3).map(comp => (
                <div key={comp.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: 'var(--color-bg-secondary)', padding: '10px 12px', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)', flexWrap: 'wrap', gap: 8
                }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                      {comp.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                      Current: <strong style={{ color: 'var(--color-text-primary)' }}>{comp.currentScore}%</strong> → Required: <strong style={{ color: 'var(--color-text-primary)' }}>{comp.requiredScore}%</strong> (Gap: <strong style={{ color: '#EF4444' }}>{comp.gapStatus || 'High'}</strong>)
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenRecommendations(comp)}
                    className="btn btn-sm btn-primary"
                    style={{ fontSize: '0.75rem', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}
                  >
                    <BookOpen size={12} />
                    View Recommended Learning
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Identity Integration */}
        <div>
          <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)', flexWrap: 'wrap', gap: 6 }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Shield size={16} color="#3B82F6" />
                Identity Integration
              </h4>
              <span style={{
                fontSize: '0.66rem', fontWeight: 700, padding: '2px 8px', borderRadius: 10,
                background: profile?.integrations?.isProduction ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                color: profile?.integrations?.isProduction ? '#10B981' : 'var(--color-accent-gold)',
                border: profile?.integrations?.isProduction ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                letterSpacing: '0.04em'
              }}>
                {profile?.integrations?.isProduction ? 'REAL INTEGRATION MODE' : 'DEMO / MOCK MODE'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {/* 1. Parichay SSO Integration */}
              {(() => {
                const parichay = profile?.integrations?.parichay || {
                  status: 'Not Connected',
                  connected: false,
                  mode: 'demo',
                  id: null
                };
                const isConnected = parichay.connected;

                return (
                  <div style={{
                    padding: 'var(--space-md)', borderRadius: 'var(--radius-md)',
                    background: isConnected ? 'rgba(16, 185, 129, 0.08)' : 'var(--color-bg-secondary)',
                    border: isConnected ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid var(--color-border)',
                    position: 'relative'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                          Parichay SSO
                        </span>
                        <span style={{
                          fontSize: '0.65rem', padding: '1px 6px', borderRadius: 4,
                          background: 'rgba(255, 255, 255, 0.06)', color: 'var(--color-text-tertiary)', border: '1px solid var(--color-border)'
                        }}>
                          Govt. NIC SSO
                        </span>
                      </div>

                      <span style={{
                        fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 12,
                        background: isConnected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.12)',
                        color: isConnected ? '#10B981' : '#EF4444',
                        border: isConnected ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                        display: 'flex', alignItems: 'center', gap: 4
                      }}>
                        <span style={{
                          width: 6, height: 6, borderRadius: '50%',
                          background: isConnected ? '#10B981' : '#EF4444'
                        }} />
                        {isConnected ? 'Connected' : 'Not Connected'}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginBottom: 8, lineHeight: 1.4 }}>
                      {isConnected
                        ? `Authenticated via official Parichay SSO (${parichay.id})`
                        : 'Available when SSO is configured. The platform is currently operating in local demonstration authentication mode.'}
                    </div>

                    {/* Parichay Details Grid */}
                    <div style={{
                      background: 'var(--color-bg-card)', padding: '6px 10px', borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)', fontSize: '0.73rem', display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', flexWrap: 'wrap', gap: 4
                    }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>
                        Parichay ID: <strong style={{ color: 'var(--color-text-primary)' }}>{parichay.id || 'Not Linked (None)'}</strong>
                      </span>
                      <span style={{ color: 'var(--color-text-muted)' }}>
                        Mode: <strong style={{ color: 'var(--color-accent-gold)' }}>{parichay.badge || 'DEMO / MOCK AUTH'}</strong>
                      </span>
                    </div>

                    {/* Connect Notice (No fake auth flow!) */}
                    {!isConnected && (
                      <div style={{
                        marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        flexWrap: 'wrap', gap: 6
                      }}>
                        <button
                          type="button"
                          className="btn btn-sm"
                          disabled
                          style={{
                            fontSize: '0.72rem', padding: '4px 10px',
                            background: 'rgba(255, 255, 255, 0.05)', color: 'var(--color-text-muted)',
                            border: '1px dashed var(--color-border)', cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: 4
                          }}
                          title="Real Parichay SSO requires NIC server configuration (AUTH_MODE=parichay)"
                        >
                          Connect Parichay
                        </button>

                        <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                          Available when SSO is configured
                        </span>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* 2. iGOT Karmayogi Integration */}
              {(() => {
                const igot = profile?.integrations?.igot || {
                  status: 'Not Connected',
                  connected: false,
                  environment: 'demo',
                  activeProvider: 'MockiGOTProvider',
                  id: null
                };
                const isConnected = igot.connected;

                return (
                  <div style={{
                    padding: 'var(--space-md)', borderRadius: 'var(--radius-md)',
                    background: isConnected ? 'rgba(16, 185, 129, 0.08)' : 'var(--color-bg-secondary)',
                    border: isConnected ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid var(--color-border)',
                    position: 'relative'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                          iGOT Karmayogi
                        </span>
                        <span style={{
                          fontSize: '0.65rem', padding: '1px 6px', borderRadius: 4,
                          background: 'rgba(249, 115, 22, 0.12)', color: '#F97316', border: '1px solid rgba(249, 115, 22, 0.3)'
                        }}>
                          DoPT / CBC
                        </span>
                      </div>

                      <span style={{
                        fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 12,
                        background: isConnected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.12)',
                        color: isConnected ? '#10B981' : '#EF4444',
                        border: isConnected ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                        display: 'flex', alignItems: 'center', gap: 4
                      }}>
                        <span style={{
                          width: 6, height: 6, borderRadius: '50%',
                          background: isConnected ? '#10B981' : '#EF4444'
                        }} />
                        {isConnected ? 'Demo Connected' : 'Not Connected'}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginBottom: 8, lineHeight: 1.4 }}>
                      {isConnected
                        ? `Demo learner profile active. Enrolled courses, progress, and certificates synchronized via MockiGOTProvider.`
                        : 'Official iGOT API credentials & configuration are required to link live civil services learner profiles.'}
                    </div>

                    {/* iGOT Details Grid */}
                    <div style={{
                      background: 'var(--color-bg-card)', padding: '6px 10px', borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)', fontSize: '0.73rem', display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', flexWrap: 'wrap', gap: 4
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: 'var(--color-text-muted)' }}>
                          {isConnected ? 'Demo iGOT Learner ID:' : 'iGOT Learner ID:'} <strong style={{ color: 'var(--color-text-primary)' }}>{igot.id || 'Not Linked (None)'}</strong>
                        </span>
                        {isConnected && (
                          <span style={{
                            fontSize: '0.62rem', padding: '1px 5px', borderRadius: 3,
                            background: 'rgba(245, 158, 11, 0.2)', color: 'var(--color-accent-gold)', fontWeight: 700
                          }}>
                            DEMO ID
                          </span>
                        )}
                      </div>
                      <span style={{ color: 'var(--color-text-muted)' }}>
                        Provider: <strong style={{ color: 'var(--color-accent-blue)' }}>{igot.activeProvider || 'MockiGOTProvider'}</strong>
                      </span>
                    </div>

                    {/* POPULATED LEARNING DATA STRIP (Requirement 10) */}
                    {isConnected && (
                      <div style={{
                        marginTop: 10, padding: '10px 12px', borderRadius: 'var(--radius-sm)',
                        background: 'var(--color-bg-card)', border: '1px solid var(--color-border)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-accent-blue)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                            Synced iGOT Learner Metrics
                          </span>
                          <span style={{
                            fontSize: '0.65rem', padding: '2px 6px', borderRadius: 4,
                            background: 'rgba(16, 185, 129, 0.12)', color: '#10B981', fontWeight: 600
                          }}>
                            MockiGOTProvider Synced
                          </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, textAlign: 'center' }}>
                          <div style={{ background: 'var(--color-bg-secondary)', padding: '6px 4px', borderRadius: 4 }}>
                            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                              {linkedLearnerData?.totalEnrolled || 8}
                            </div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--color-text-tertiary)' }}>Enrolled</div>
                          </div>
                          <div style={{ background: 'var(--color-bg-secondary)', padding: '6px 4px', borderRadius: 4 }}>
                            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#10B981' }}>
                              {linkedLearnerData?.totalCompleted || 5}
                            </div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--color-text-tertiary)' }}>Completed</div>
                          </div>
                          <div style={{ background: 'var(--color-bg-secondary)', padding: '6px 4px', borderRadius: 4 }}>
                            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-accent-gold)' }}>
                              {linkedLearnerData?.totalHours || 48}h
                            </div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--color-text-tertiary)' }}>Learning</div>
                          </div>
                          <div style={{ background: 'var(--color-bg-secondary)', padding: '6px 4px', borderRadius: 4 }}>
                            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#8B5CF6' }}>
                              {linkedLearnerData?.certificatesCount || 5}
                            </div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--color-text-tertiary)' }}>Certificates</div>
                          </div>
                        </div>

                        {/* Overall Progress Bar */}
                        <div style={{ marginTop: 8 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--color-text-secondary)', marginBottom: 3 }}>
                            <span>Average Course Progress</span>
                            <strong style={{ color: 'var(--color-text-primary)' }}>
                              {linkedLearnerData?.enrollments?.length ? Math.round(linkedLearnerData.enrollments.reduce((acc, c) => acc + (c.progress || 0), 0) / linkedLearnerData.enrollments.length) : 78}%
                            </strong>
                          </div>
                          <div style={{ height: 6, background: 'rgba(255, 255, 255, 0.08)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{
                              height: '100%',
                              width: `${linkedLearnerData?.enrollments?.length ? Math.round(linkedLearnerData.enrollments.reduce((acc, c) => acc + (c.progress || 0), 0) / linkedLearnerData.enrollments.length) : 78}%`,
                              background: 'linear-gradient(90deg, #10B981, #2563EB)', borderRadius: 3
                            }} />
                          </div>
                        </div>

                        {/* Collapsible Synced Courses List */}
                        {showSyncedCourses && (
                          <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--color-border)' }}>
                            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 6 }}>
                              Enrolled iGOT Modules ({linkedLearnerData?.enrollments?.length || 0})
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 160, overflowY: 'auto' }}>
                              {(linkedLearnerData?.enrollments || []).map((e, idx) => {
                                const courseTitles = {
                                  'igot-crs-001': 'Python for Data Analysis in Government',
                                  'igot-crs-002': 'Data Driven Decision Making for Government',
                                  'igot-crs-003': 'Introduction to Artificial Intelligence',
                                  'igot-crs-005': 'Geographic Information Systems (GIS)',
                                  'igot-crs-006': 'Cybersecurity and Data Protection',
                                  'igot-crs-007': 'Statistical Computing with R',
                                  'igot-crs-008': 'Sample Survey Methodology and Design',
                                  'igot-crs-010': 'Cloud Computing Essentials',
                                  'igot-crs-011': 'National Accounts and Macroeconomics',
                                  'igot-crs-012': 'Leadership and Change Management',
                                  'igot-crs-016': 'Data Analytics in Governance'
                                };
                                const title = courseTitles[e.courseId] || `iGOT Module (${e.courseId})`;
                                const isComp = e.status === 'completed';

                                return (
                                  <div key={idx} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    background: 'var(--color-bg-secondary)', padding: '5px 8px', borderRadius: 4,
                                    fontSize: '0.72rem'
                                  }}>
                                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' }}>
                                      <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{title}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                      <span style={{
                                        fontSize: '0.65rem', padding: '1px 5px', borderRadius: 3,
                                        background: isComp ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                                        color: isComp ? '#10B981' : '#3B82F6', fontWeight: 600
                                      }}>
                                        {isComp ? 'Completed' : `${e.progress}%`}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Mode Notice & Requirements */}
                    <div style={{
                      marginTop: 8, padding: '8px 10px', borderRadius: 'var(--radius-sm)',
                      background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)',
                      fontSize: '0.72rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'flex-start', gap: 6
                    }}>
                      <Info size={13} color="#F59E0B" style={{ flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <strong>Active Mode: DEMO / MOCK MODE</strong>
                        <div style={{ marginTop: 2, color: 'var(--color-text-muted)', lineHeight: 1.3 }}>
                          Operating using built-in simulated data. Real integration requires <code style={{ color: 'var(--color-accent-gold)' }}>IGOT_ENVIRONMENT=production</code> with valid API keys (<code style={{ color: 'var(--color-accent-gold)' }}>IGOT_CLIENT_ID</code>, <code style={{ color: 'var(--color-accent-gold)' }}>IGOT_CLIENT_SECRET</code>).
                        </div>
                      </div>
                    </div>

                    {/* ACTION BUTTONS (Requirement: Link Demo, View iGOT Learning, Unlink) */}
                    {!isConnected ? (
                      <div style={{ marginTop: 10 }}>
                        <button
                          type="button"
                          onClick={handleOpenDemoModal}
                          className="btn btn-sm btn-primary"
                          style={{
                            fontSize: '0.76rem', padding: '6px 14px',
                            display: 'flex', alignItems: 'center', gap: 6,
                            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.35)', cursor: 'pointer'
                          }}
                        >
                          <Link2 size={13} />
                          Link Demo iGOT Account
                        </button>
                      </div>
                    ) : (
                      <div style={{
                        marginTop: 10, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap'
                      }}>
                        <Link
                          href="/igot"
                          className="btn btn-sm btn-primary"
                          style={{
                            fontSize: '0.75rem', padding: '6px 12px',
                            display: 'flex', alignItems: 'center', gap: 6
                          }}
                        >
                          <BookOpen size={13} />
                          View iGOT Learning
                        </Link>

                        <button
                          type="button"
                          onClick={() => setShowSyncedCourses(!showSyncedCourses)}
                          className="btn btn-sm btn-secondary"
                          style={{
                            fontSize: '0.75rem', padding: '6px 12px',
                            display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer'
                          }}
                        >
                          <Layers size={13} />
                          {showSyncedCourses ? 'Hide Courses' : 'View Synced Courses'}
                        </button>

                        <button
                          type="button"
                          onClick={handleUnlinkDemoAccount}
                          className="btn btn-sm"
                          style={{
                            fontSize: '0.75rem', padding: '6px 12px',
                            display: 'flex', alignItems: 'center', gap: 6,
                            background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#EF4444', cursor: 'pointer'
                          }}
                        >
                          <Unlink size={13} />
                          Unlink
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Disclaimer Footer */}
            <div style={{
              marginTop: 12, paddingTop: 8, borderTop: '1px solid var(--color-border)',
              display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.7rem', color: 'var(--color-text-tertiary)'
            }}>
              <Shield size={12} color="var(--color-text-tertiary)" />
              <span>Simulated demo mode active. No live government connection exists.</span>
            </div>
          </div>

          {/* Dynamically Synchronized Achievements Card */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Award size={16} color="#F59E0B" />
                Achievements
              </h4>
              {linkedLearnerData && (
                <span style={{
                  fontSize: '0.66rem', padding: '2px 8px', borderRadius: 10,
                  background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', fontWeight: 700
                }}>
                  Synced from iGOT Demo
                </span>
              )}
            </div>
            <div className="stats-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-accent-blue)' }}>
                  {linkedLearnerData ? linkedLearnerData.totalEnrolled : 0}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-tertiary)' }}>Enrolled Courses</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-accent-gold)' }}>
                  {linkedLearnerData ? linkedLearnerData.certificatesCount : 0}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-tertiary)' }}>Certificates</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-accent-green)' }}>
                  {linkedLearnerData ? `${linkedLearnerData.totalHours}h` : '0h'}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-tertiary)' }}>Learning Hours</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-accent-purple)' }}>
                  {linkedLearnerData ? linkedLearnerData.totalCompleted : 0}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-tertiary)' }}>Completed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* DETAILED COMPETENCY ANALYSIS MODAL DIALOG                */}
      {/* ======================================================== */}
      {showAnalysisModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(5, 11, 20, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: 16
        }}>
          <div className="card" style={{
            width: '100%', maxWidth: 980, maxHeight: '94vh', overflowY: 'auto',
            background: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)', boxShadow: '0 24px 48px rgba(0, 0, 0, 0.6)',
            padding: 24, position: 'relative'
          }}>
            {/* Modal Top Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, borderBottom: '1px solid var(--color-border)', paddingBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 10,
                  background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
                }}>
                  <Target size={22} color="#FFFFFF" />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700 }}>
                    Detailed Competency Analysis & Skill Gap Audit
                  </h2>
                  <p style={{ margin: '3px 0 0 0', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    Visualizing <strong>Current Level → Required Level → Gap</strong> for official MoSPI role benchmark
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAnalysisModal(false)}
                style={{
                  background: 'transparent', border: 'none', color: 'var(--color-text-secondary)',
                  cursor: 'pointer', padding: 6, borderRadius: 6
                }}
              >
                <X size={22} />
              </button>
            </div>

            {/* 1. TOP SUMMARY METRICS STRIP */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: 10, marginBottom: 20
            }}>
              {/* Overall Competency */}
              <div style={{
                background: 'var(--color-bg-secondary)', padding: '12px 14px', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)', textAlign: 'center'
              }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase' }}>
                  Overall Competency
                </span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-accent-blue)', margin: '2px 0' }}>
                  {overallCompetencyScore}%
                </div>
                <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 600 }}>
                  Cadre Benchmark Met
                </span>
              </div>

              {/* Strongest Skills */}
              <div style={{
                background: 'var(--color-bg-secondary)', padding: '12px 14px', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)'
              }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4, textTransform: 'uppercase' }}>
                  <TrendingUp size={12} color="#10B981" /> Strongest Skills
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 4 }}>
                  {strongestSkills.map(s => (
                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <span style={{ color: 'var(--color-text-primary)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 110 }}>{s.name}</span>
                      <span style={{ color: '#10B981', fontWeight: 700 }}>{s.currentScore}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weakest Skills */}
              <div style={{
                background: 'var(--color-bg-secondary)', padding: '12px 14px', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)'
              }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4, textTransform: 'uppercase' }}>
                  <TrendingDown size={12} color="#EF4444" /> Weakest Skills
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 4 }}>
                  {weakestSkills.map(s => (
                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <span style={{ color: 'var(--color-text-primary)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 110 }}>{s.name}</span>
                      <span style={{ color: '#EF4444', fontWeight: 700 }}>{s.currentScore}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* High-Priority Skill Gaps */}
              <div style={{
                background: 'rgba(239, 68, 68, 0.08)', padding: '12px 14px', borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(239, 68, 68, 0.25)', textAlign: 'center'
              }}>
                <span style={{ fontSize: '0.72rem', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, textTransform: 'uppercase', fontWeight: 600 }}>
                  <AlertTriangle size={12} color="#EF4444" /> High-Priority Gaps
                </span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#EF4444', margin: '2px 0' }}>
                  {highPriorityGaps.length}
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                  Critical & High severity
                </span>
              </div>

              {/* Requiring Training */}
              <div style={{
                background: 'rgba(245, 158, 11, 0.08)', padding: '12px 14px', borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(245, 158, 11, 0.25)', textAlign: 'center'
              }}>
                <span style={{ fontSize: '0.72rem', color: '#F59E0B', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                  Requiring Training
                </span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#F59E0B', margin: '2px 0' }}>
                  {requiringTrainingCount}
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                  of {allCompsList.length} competencies
                </span>
              </div>
            </div>

            {/* 2. FILTERING & SORTING CONTROLS */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap',
              gap: 12, marginBottom: 18, background: 'var(--color-bg-secondary)', padding: '10px 14px',
              borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)'
            }}>
              {/* Filter Tabs */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', marginRight: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Filter size={12} /> Filter:
                </span>
                <button
                  className={`btn btn-sm ${analysisFilter === 'all' && analysisCategory === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                  onClick={() => { setAnalysisFilter('all'); setAnalysisCategory('all'); }}
                >
                  All ({allCompsList.length})
                </button>
                <button
                  className={`btn btn-sm ${analysisFilter === 'strong' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                  onClick={() => setAnalysisFilter('strong')}
                >
                  Strong Skills
                </button>
                <button
                  className={`btn btn-sm ${analysisFilter === 'gaps' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                  onClick={() => setAnalysisFilter('gaps')}
                >
                  Skill Gaps ({requiringTrainingCount})
                </button>
                <button
                  className={`btn btn-sm ${analysisFilter === 'high-priority' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                  onClick={() => setAnalysisFilter('high-priority')}
                >
                  High Priority ({highPriorityGaps.length})
                </button>

                {/* By Category Dropdown */}
                <select
                  className="input"
                  style={{ fontSize: '0.75rem', padding: '4px 8px', height: 30 }}
                  value={analysisCategory}
                  onChange={e => setAnalysisCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="statistical">Statistical (10)</option>
                  <option value="technical">Technical (12)</option>
                  <option value="digital">Digital Governance (5)</option>
                  <option value="behavioural">Behavioural (6)</option>
                </select>
              </div>

              {/* Sort & Search */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <ArrowUpDown size={12} color="var(--color-text-muted)" />
                  <select
                    className="input"
                    style={{ fontSize: '0.75rem', padding: '4px 8px', height: 30 }}
                    value={analysisSort}
                    onChange={e => setAnalysisSort(e.target.value)}
                  >
                    <option value="gap-desc">Largest Gap First</option>
                    <option value="score-asc">Lowest Score First</option>
                    <option value="score-desc">Highest Score First</option>
                    <option value="name-asc">Alphabetical (A-Z)</option>
                  </select>
                </div>

                <div style={{ position: 'relative', width: 200 }}>
                  <Search size={12} style={{ position: 'absolute', left: 8, top: 9, color: 'var(--color-text-muted)' }} />
                  <input
                    type="text"
                    className="input"
                    style={{ width: '100%', paddingLeft: 26, fontSize: '0.75rem', height: 30 }}
                    placeholder="Search competency..."
                    value={analysisSearch}
                    onChange={e => setAnalysisSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* 3. COMPETENCY LISTING WITH PROGRESS BAR / RATING VISUALIZATION */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {processedCompetencies.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--color-text-muted)' }}>
                  No competencies match the selected filter.
                </div>
              ) : (
                processedCompetencies.map(comp => {
                  const statusColor = getGapStatusColor(comp.gapStatus);
                  const currentLvl = comp.currentLevel || 2;
                  const reqLvl = comp.requiredLevel || 4;

                  return (
                    <div
                      key={comp.id}
                      style={{
                        background: 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        padding: '14px 18px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10
                      }}
                    >
                      {/* Top Header: Title, Category, and Gap Status */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontWeight: 700, fontSize: '1.02rem', color: 'var(--color-text-primary)' }}>
                            {comp.name}
                          </span>
                          <span className="badge badge-neutral" style={{ fontSize: '0.7rem', textTransform: 'capitalize' }}>
                            {comp.categoryName || comp.category}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span
                            style={{
                              fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: 14,
                              background: `${statusColor}20`, color: statusColor, border: `1px solid ${statusColor}60`
                            }}
                          >
                            {comp.gapStatus === 'Critical' ? '🔴 Critical' : comp.gapStatus === 'High' ? '🟠 High' : comp.gapStatus === 'Medium' ? '🟡 Medium' : '🟢 Low / Met'}
                          </span>

                          {/* "Recommended Learning" Action Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenRecommendations(comp)}
                            className="btn btn-sm btn-primary"
                            style={{
                              fontSize: '0.78rem', padding: '5px 12px',
                              display: 'flex', alignItems: 'center', gap: 6,
                              boxShadow: comp.gapScore > 20 ? '0 2px 8px rgba(37, 99, 235, 0.35)' : 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <BookOpen size={13} />
                            View Recommended Learning
                          </button>
                        </div>
                      </div>

                      {/* Visual Flow Indicator: Current Level → Required Level → Gap */}
                      <div style={{
                        display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8,
                        background: 'var(--color-bg-card)', padding: '6px 12px', borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem', border: '1px solid var(--color-border)'
                      }}>
                        <span style={{ color: 'var(--color-text-secondary)' }}>
                          Current: <strong style={{ color: 'var(--color-text-primary)' }}>{comp.currentScore}%</strong> ({comp.currentLevelLabel})
                        </span>
                        <span style={{ color: 'var(--color-accent-blue)', fontWeight: 700 }}>→</span>
                        <span style={{ color: 'var(--color-text-secondary)' }}>
                          Required: <strong style={{ color: 'var(--color-text-primary)' }}>{comp.requiredScore}%</strong> ({comp.requiredLevelLabel})
                        </span>
                        <span style={{ color: 'var(--color-accent-blue)', fontWeight: 700 }}>→</span>
                        <span style={{ color: comp.gapScore > 0 ? statusColor : '#10B981', fontWeight: 700 }}>
                          Gap: {comp.gapScore}% {comp.gapScore > 0 ? `(${comp.gapStatus} Priority)` : '(Target Met)'}
                        </span>
                      </div>

                      {/* Visual Rating Stepper + Progress Bar */}
                      <div>
                        {/* 5-Level Rating Visualization Blocks */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginBottom: 6 }}>
                          {[1, 2, 3, 4, 5].map(lvl => {
                            const isAchieved = lvl <= currentLvl;
                            const isGap = lvl > currentLvl && lvl <= reqLvl;
                            const isAbove = lvl > reqLvl;

                            return (
                              <div
                                key={lvl}
                                style={{
                                  height: 6, borderRadius: 3,
                                  background: isAchieved
                                    ? statusColor
                                    : isGap
                                      ? `${statusColor}40`
                                      : 'rgba(255, 255, 255, 0.08)',
                                  border: isGap ? `1px dashed ${statusColor}` : 'none',
                                  position: 'relative'
                                }}
                                title={`Level ${lvl}: ${lvl === 1 ? 'Awareness' : lvl === 2 ? 'Basic' : lvl === 3 ? 'Intermediate' : lvl === 4 ? 'Advanced' : 'Expert'}`}
                              />
                            );
                          })}
                        </div>

                        {/* Continuous Progress Bar with Target Benchmark Indicator */}
                        <div style={{
                          height: 8, background: 'var(--color-bg-card)', borderRadius: 4,
                          position: 'relative', overflow: 'hidden', border: '1px solid var(--color-border)'
                        }}>
                          {/* Required Target Benchmark Line */}
                          <div
                            style={{
                              position: 'absolute', top: 0, left: `${comp.requiredScore}%`,
                              width: 3, height: '100%', background: '#FFFFFF', zIndex: 3,
                              boxShadow: '0 0 6px rgba(255, 255, 255, 0.9)'
                            }}
                            title={`Target Required Benchmark: ${comp.requiredScore}%`}
                          />

                          {/* Current Score Progress Fill */}
                          <div
                            style={{
                              height: '100%',
                              width: `${comp.currentScore}%`,
                              background: statusColor,
                              borderRadius: 4,
                              transition: 'width 0.4s ease'
                            }}
                          />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                          <span>Level 1: Beginner</span>
                          <span>Level 3: Intermediate</span>
                          <span>Level 5: Expert</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer Actions */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
              marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--color-border)'
            }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Viewing {processedCompetencies.length} of {allCompsList.length} competencies
              </span>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowAnalysisModal(false)}
                >
                  Close Analysis
                </button>
                <Link
                  href="/ai-advisor"
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Sparkles size={15} />
                  Open AI Career Pathway
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TARGETED COMPETENCY RECOMMENDATION VIEW MODAL DIALOG    */}
      {/* ======================================================== */}
      {recommendationModal.open && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(5, 11, 20, 0.88)',
          backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 10005, padding: 16
        }}>
          <div className="card" style={{
            width: '100%', maxWidth: 960, maxHeight: '92vh', overflowY: 'auto',
            background: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)', boxShadow: '0 25px 60px rgba(0, 0, 0, 0.75)',
            padding: 24, position: 'relative'
          }}>
            {/* Modal Top Bar */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              borderBottom: '1px solid var(--color-border)', paddingBottom: 16, marginBottom: 20
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'linear-gradient(135deg, #10B981, #2563EB)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)'
                }}>
                  <GraduationCap size={24} color="#FFFFFF" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700 }}>
                      Recommended Learning for {recommendationModal.competency?.name}
                    </h2>
                    <span style={{
                      fontSize: '0.7rem', padding: '2px 8px', borderRadius: 10,
                      background: 'rgba(37, 99, 235, 0.15)', color: 'var(--color-accent-blue)',
                      border: '1px solid rgba(37, 99, 235, 0.3)', fontWeight: 600
                    }}>
                      Rule-Based Engine
                    </span>
                  </div>
                  <p style={{ margin: '3px 0 0 0', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    Curated learning path across iGOT Karmayogi, NSSTA Academy & MoSPI Internal Manuals
                  </p>
                </div>
              </div>

              <button
                onClick={() => setRecommendationModal({ open: false, loading: false, error: null, competency: null, data: null })}
                style={{
                  background: 'transparent', border: 'none', color: 'var(--color-text-secondary)',
                  cursor: 'pointer', padding: 6, borderRadius: 6
                }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Target Competency & Official Benchmark Details Banner (Per Specification) */}
            {(() => {
              const comp = recommendationModal.competency || {};
              const recData = recommendationModal.data;
              const currentScore = comp.currentScore ?? recData?.competency?.currentScore ?? 52;
              const requiredScore = comp.requiredScore ?? recData?.competency?.requiredScore ?? 80;
              const gapScore = comp.gapScore ?? recData?.competency?.gapScore ?? 28;
              const gapStatus = comp.gapStatus ?? recData?.competency?.gapStatus ?? 'High';
              const jobRole = profile?.jobRole || recData?.userContext?.jobRole || 'Survey Data Compilation & Statistical Analysis';
              const designation = profile?.designation || recData?.userContext?.designation || 'Deputy Director';

              const isCrit = gapStatus === 'Critical';
              const isHigh = gapStatus === 'High';
              const gapBadgeColor = isCrit ? '#EF4444' : isHigh ? '#F59E0B' : '#10B981';

              return (
                <div style={{
                  background: 'var(--color-bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  padding: 16,
                  marginBottom: 20
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                        {comp.name}
                      </span>
                      <span style={{
                        fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: 14,
                        background: `${gapBadgeColor}20`, color: gapBadgeColor, border: `1px solid ${gapBadgeColor}50`
                      }}>
                        Gap: {gapStatus} ({gapScore}%)
                      </span>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                      Official Role: <strong style={{ color: 'var(--color-text-primary)' }}>{jobRole}</strong> ({designation})
                    </div>
                  </div>

                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: 10
                  }}>
                    <div style={{
                      background: 'var(--color-bg-card)', padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)'
                    }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase' }}>
                        Current Level
                      </span>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-text-primary)', marginTop: 2 }}>
                        {currentScore}%
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>
                        {comp.currentLevelLabel || (currentScore < 50 ? 'Level 1 (Awareness)' : currentScore < 70 ? 'Level 2 (Basic)' : 'Level 3 (Intermediate)')}
                      </span>
                    </div>

                    <div style={{
                      background: 'var(--color-bg-card)', padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)'
                    }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase' }}>
                        Required Level
                      </span>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-accent-blue)', marginTop: 2 }}>
                        {requiredScore}%
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>
                        {comp.requiredLevelLabel || (requiredScore >= 80 ? 'Level 4 (Advanced)' : 'Level 3 (Intermediate)')}
                      </span>
                    </div>

                    <div style={{
                      background: `${gapBadgeColor}10`, padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                      border: `1px solid ${gapBadgeColor}35`
                    }}>
                      <span style={{ fontSize: '0.7rem', color: gapBadgeColor, display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                        Identified Gap
                      </span>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: gapBadgeColor, marginTop: 2 }}>
                        {gapScore}%
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>
                        Priority: <strong>{gapStatus}</strong>
                      </span>
                    </div>

                    <div style={{
                      background: 'rgba(37, 99, 235, 0.08)', padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                      border: '1px solid rgba(37, 99, 235, 0.25)'
                    }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-accent-blue)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                        Target Cadre
                      </span>
                      <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-primary)', marginTop: 4 }}>
                        {profile?.cadre || 'Indian Statistical Service'}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                        Grade: {profile?.grade || 'Group A'}
                      </span>
                    </div>
                  </div>

                  {/* Recommendation Rationale Indicator */}
                  <div style={{
                    marginTop: 12, padding: '8px 12px', borderRadius: 'var(--radius-sm)',
                    background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.2)',
                    display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.76rem', color: 'var(--color-text-secondary)'
                  }}>
                    <Info size={14} color="#3B82F6" style={{ flexShrink: 0 }} />
                    <span>
                      <strong>Recommendation Match Rationale:</strong> Resources filtered for <em>{comp.name}</em> matching current proficiency ({currentScore}%) to role benchmark ({requiredScore}%) for <em>{designation}</em>.
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Error or Loading States */}
            {recommendationModal.loading && (
              <div style={{ textAlign: 'center', padding: '50px 20px' }}>
                <div className="loading-spinner" style={{ margin: '0 auto 16px auto', width: 36, height: 36 }} />
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  Matching Learning Interventions for {recommendationModal.competency?.name}...
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: 4 }}>
                  Querying iGOT Karmayogi catalogue, NSSTA calendar, and MoSPI SOP repository
                </div>
              </div>
            )}

            {recommendationModal.error && (
              <div style={{
                padding: '20px', borderRadius: 'var(--radius-md)', textAlign: 'center',
                background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #EF4444', color: '#EF4444', margin: '20px 0'
              }}>
                <AlertTriangle size={24} style={{ margin: '0 auto 8px auto' }} />
                <div style={{ fontWeight: 600 }}>{recommendationModal.error}</div>
                <button
                  onClick={() => handleOpenRecommendations(recommendationModal.competency)}
                  className="btn btn-sm btn-primary"
                  style={{ marginTop: 12 }}
                >
                  Retry Loading
                </button>
              </div>
            )}

            {/* Loaded Data & Channel Views */}
            {!recommendationModal.loading && !recommendationModal.error && recommendationModal.data && (
              <div>
                {/* Channels Navigation Tabs */}
                {(() => {
                  const igotCount = recommendationModal.data.igotCourses?.length || 0;
                  const nsstaCount = recommendationModal.data.nsstaProgrammes?.length || 0;
                  const internalCount = recommendationModal.data.internalResources?.length || 0;
                  const totalCount = igotCount + nsstaCount + internalCount;

                  return (
                    <div style={{
                      display: 'flex', gap: 8, borderBottom: '1px solid var(--color-border)',
                      paddingBottom: 10, marginBottom: 18, overflowX: 'auto'
                    }}>
                      <button
                        type="button"
                        onClick={() => setRecActiveTab('all')}
                        className={`btn btn-sm ${recActiveTab === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                      >
                        <Layers size={13} />
                        All Learning ({totalCount})
                      </button>

                      <button
                        type="button"
                        onClick={() => setRecActiveTab('igot')}
                        className={`btn btn-sm ${recActiveTab === 'igot' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                      >
                        <span style={{ fontSize: '0.9rem' }}>🇮🇳</span>
                        iGOT Karmayogi ({igotCount})
                      </button>

                      <button
                        type="button"
                        onClick={() => setRecActiveTab('nssta')}
                        className={`btn btn-sm ${recActiveTab === 'nssta' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                      >
                        <Building2 size={13} />
                        NSSTA / TPAC Programmes ({nsstaCount})
                      </button>

                      <button
                        type="button"
                        onClick={() => setRecActiveTab('internal')}
                        className={`btn btn-sm ${recActiveTab === 'internal' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                      >
                        <FileText size={13} />
                        Internal MoSPI Manuals ({internalCount})
                      </button>
                    </div>
                  );
                })()}

                {/* ======================================================== */}
                {/* 1. iGOT KARMAYOGI COURSES CHANNEL                        */}
                {/* ======================================================== */}
                {(recActiveTab === 'all' || recActiveTab === 'igot') && (
                  <div style={{ marginBottom: 24 }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      marginBottom: 12, paddingBottom: 6, borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          background: 'linear-gradient(135deg, #F97316, #10B981)',
                          width: 8, height: 18, borderRadius: 3, display: 'inline-block'
                        }} />
                        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                          1. iGOT Karmayogi Courses
                        </h4>
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                          (Via iGOT Integration Service Layer)
                        </span>
                      </div>
                      <Link
                        href="/igot"
                        style={{ fontSize: '0.75rem', color: 'var(--color-accent-blue)', display: 'flex', alignItems: 'center', gap: 4 }}
                      >
                        Explore iGOT Catalogue <ExternalLink size={12} />
                      </Link>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {recommendationModal.data.igotCourses?.map(course => {
                        const feedback = actionFeedback[course.id];
                        return (
                          <div
                            key={course.id}
                            style={{
                              background: 'var(--color-bg-secondary)',
                              border: '1px solid var(--color-border)',
                              borderRadius: 'var(--radius-md)',
                              padding: 14,
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              flexWrap: 'wrap',
                              gap: 12,
                              transition: 'border-color 0.2s ease'
                            }}
                          >
                            <div style={{ flex: '1 1 360px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                                <span style={{
                                  fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                                  background: 'rgba(249, 115, 22, 0.15)', color: '#F97316', border: '1px solid rgba(249, 115, 22, 0.3)'
                                }}>
                                  {course.provider || 'iGOT Karmayogi'}
                                </span>
                                <span style={{
                                  fontSize: '0.7rem', padding: '2px 8px', borderRadius: 4,
                                  background: 'var(--color-bg-card)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)'
                                }}>
                                  {course.difficulty || 'Intermediate'}
                                </span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <Clock size={11} /> {course.duration || '2h 30m'}
                                </span>
                              </div>

                              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 4 }}>
                                {course.title}
                              </div>

                              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                                {course.description}
                              </p>

                              {/* Skills & Modules Tags */}
                              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                                {(course.tags || []).slice(0, 4).map(tag => (
                                  <span key={tag} style={{
                                    fontSize: '0.68rem', padding: '2px 6px', borderRadius: 3,
                                    background: 'var(--color-bg-card)', color: 'var(--color-text-tertiary)', border: '1px solid var(--color-border)'
                                  }}>
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 160 }}>
                              <button
                                type="button"
                                onClick={() => handleResourceAction(course.id, 'enrolled')}
                                className="btn btn-sm btn-primary"
                                style={{
                                  fontSize: '0.75rem', padding: '6px 12px', display: 'flex',
                                  alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer'
                                }}
                              >
                                {feedback === 'enrolled' ? (
                                  <>
                                    <CheckCircle2 size={13} color="#FFFFFF" /> Enrolled on iGOT!
                                  </>
                                ) : (
                                  <>
                                    <BookOpen size={13} /> Enrol via iGOT
                                  </>
                                )}
                              </button>

                              <a
                                href={course.externalUrl || 'https://igotkarmayogi.gov.in'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-secondary"
                                style={{
                                  fontSize: '0.75rem', padding: '6px 12px', display: 'flex',
                                  alignItems: 'center', justifyContent: 'center', gap: 6, textDecoration: 'none'
                                }}
                              >
                                Open on iGOT <ExternalLink size={12} />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* 2. NSSTA / TPAC IN-SERVICE TRAINING PROGRAMMES           */}
                {/* ======================================================== */}
                {(recActiveTab === 'all' || recActiveTab === 'nssta') && (
                  <div style={{ marginBottom: 24 }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      marginBottom: 12, paddingBottom: 6, borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          background: '#3B82F6',
                          width: 8, height: 18, borderRadius: 3, display: 'inline-block'
                        }} />
                        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                          2. NSSTA / TPAC Training Programmes
                        </h4>
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                          (Classroom & Hybrid at Greater Noida Academy)
                        </span>
                      </div>
                      <Link
                        href="/training"
                        style={{ fontSize: '0.75rem', color: 'var(--color-accent-blue)', display: 'flex', alignItems: 'center', gap: 4 }}
                      >
                        Full NSSTA Calendar <ChevronRight size={12} />
                      </Link>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {recommendationModal.data.nsstaProgrammes?.map(prog => {
                        const feedback = actionFeedback[prog.id];
                        return (
                          <div
                            key={prog.id}
                            style={{
                              background: 'var(--color-bg-secondary)',
                              border: '1px solid var(--color-border)',
                              borderRadius: 'var(--radius-md)',
                              padding: 14,
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              flexWrap: 'wrap',
                              gap: 12
                            }}
                          >
                            <div style={{ flex: '1 1 360px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                                <span style={{
                                  fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                                  background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6', border: '1px solid rgba(59, 130, 246, 0.3)'
                                }}>
                                  {prog.id} • {prog.institution || 'NSSTA, Greater Noida'}
                                </span>
                                <span style={{
                                  fontSize: '0.7rem', padding: '2px 8px', borderRadius: 4,
                                  background: prog.mode === 'hybrid' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(139, 92, 246, 0.15)',
                                  color: prog.mode === 'hybrid' ? '#10B981' : '#8B5CF6'
                                }}>
                                  {prog.mode ? prog.mode.toUpperCase() : 'CLASSROOM'} • {prog.duration || '5 days'}
                                </span>
                                <span style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 600 }}>
                                  {prog.seatsAvailable} of {prog.seats} Seats Available
                                </span>
                              </div>

                              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 4 }}>
                                {prog.title}
                              </div>

                              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                                {prog.description}
                              </p>

                              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8, fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                                <span>📅 Dates: <strong style={{ color: 'var(--color-text-primary)' }}>{prog.startDate} to {prog.endDate}</strong></span>
                                <span>📍 Venue: <strong style={{ color: 'var(--color-text-primary)' }}>{prog.venue || 'NSSTA Campus, Greater Noida'}</strong></span>
                                <span>🎯 Target Cadre: <strong style={{ color: 'var(--color-text-primary)' }}>{prog.targetGroup}</strong></span>
                              </div>
                            </div>

                            {/* Action Button */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 160 }}>
                              <button
                                type="button"
                                onClick={() => handleResourceAction(prog.id, 'nominated')}
                                className="btn btn-sm btn-primary"
                                style={{
                                  fontSize: '0.75rem', padding: '8px 14px', display: 'flex',
                                  alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer'
                                }}
                              >
                                {feedback === 'nominated' ? (
                                  <>
                                    <CheckCircle2 size={13} color="#FFFFFF" /> Nominated for Batch!
                                  </>
                                ) : (
                                  <>
                                    <Building2 size={13} /> Nominate for Batch
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* 3. OTHER INTERNAL LEARNING RESOURCES                     */}
                {/* ======================================================== */}
                {(recActiveTab === 'all' || recActiveTab === 'internal') && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      marginBottom: 12, paddingBottom: 6, borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          background: '#10B981',
                          width: 8, height: 18, borderRadius: 3, display: 'inline-block'
                        }} />
                        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                          3. MoSPI Internal Learning Resources & SOPs
                        </h4>
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                          (Technical Handbooks, Division Manuals & Guidelines)
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {recommendationModal.data.internalResources?.map(res => {
                        const feedback = actionFeedback[res.id];
                        return (
                          <div
                            key={res.id}
                            style={{
                              background: 'var(--color-bg-secondary)',
                              border: '1px solid var(--color-border)',
                              borderRadius: 'var(--radius-md)',
                              padding: 14,
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              flexWrap: 'wrap',
                              gap: 12
                            }}
                          >
                            <div style={{ flex: '1 1 360px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                                <span style={{
                                  fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                                  background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)'
                                }}>
                                  {res.department}
                                </span>
                                <span style={{
                                  fontSize: '0.7rem', padding: '2px 8px', borderRadius: 4,
                                  background: 'var(--color-bg-card)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)'
                                }}>
                                  {res.type?.toUpperCase()} • {res.format}
                                </span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                                  Authored by {res.author}
                                </span>
                              </div>

                              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 4 }}>
                                {res.title}
                              </div>

                              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                                {res.description}
                              </p>

                              <div style={{ marginTop: 8, fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                                👥 Target Roles: <strong style={{ color: 'var(--color-text-primary)' }}>{res.targetRoles?.join(', ')}</strong>
                              </div>
                            </div>

                            {/* Action Button */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 160 }}>
                              <button
                                type="button"
                                onClick={() => handleResourceAction(res.id, 'downloaded')}
                                className="btn btn-sm btn-secondary"
                                style={{
                                  fontSize: '0.75rem', padding: '8px 14px', display: 'flex',
                                  alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer'
                                }}
                              >
                                {feedback === 'downloaded' ? (
                                  <>
                                    <CheckCircle2 size={13} color="#10B981" /> Manual Opened (PDF)
                                  </>
                                ) : (
                                  <>
                                    <FileText size={13} /> View Manual / SOP
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Modal Footer */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
              marginTop: 20, paddingTop: 14, borderTop: '1px solid var(--color-border)'
            }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                Rule-based recommendations for official MoSPI statistical workforce development
              </span>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setRecommendationModal({ open: false, loading: false, error: null, competency: null, data: null })}
                >
                  Close Recommendations
                </button>
                <Link
                  href={`/learning?competency=${encodeURIComponent(recommendationModal.competency?.name || '')}`}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}
                >
                  <Sparkles size={14} />
                  Open Full Learning Portal
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* EDIT PROFILE MODAL DIALOG                                */}
      {/* ======================================================== */}
      {isEditing && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(5, 11, 20, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: 16
        }}>
          <div className="card" style={{
            width: '100%', maxWidth: 680, maxHeight: '90vh', overflowY: 'auto',
            background: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
            padding: 24, position: 'relative'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '1px solid var(--color-border)', paddingBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Edit3 size={18} color="#FFFFFF" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>Edit Official Profile</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                    Update your official statistical cadre and role records
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(false)}
                style={{
                  background: 'transparent', border: 'none', color: 'var(--color-text-secondary)',
                  cursor: 'pointer', padding: 4, borderRadius: 6
                }}
              >
                <X size={20} />
              </button>
            </div>

            {formErrors.submit && (
              <div style={{
                marginBottom: 16, padding: '10px 14px', borderRadius: 'var(--radius-md)',
                background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#EF4444',
                fontSize: '0.85rem'
              }}>
                {formErrors.submit}
              </div>
            )}

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>
                    Full Name <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="input"
                    style={{ width: '100%', borderColor: formErrors.name ? '#EF4444' : undefined }}
                    value={formData.name || ''}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. Priya Sharma"
                  />
                  {formErrors.name && <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>{formErrors.name}</span>}
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>
                    Designation <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="input"
                    style={{ width: '100%', borderColor: formErrors.designation ? '#EF4444' : undefined }}
                    value={formData.designation || ''}
                    onChange={e => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g. Deputy Director / Statistical Officer"
                  />
                  {formErrors.designation && <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>{formErrors.designation}</span>}
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>
                    Department / Division <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="input"
                    style={{ width: '100%', borderColor: formErrors.department ? '#EF4444' : undefined }}
                    value={formData.department || ''}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g. Labour Statistics Division"
                  />
                  {formErrors.department && <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>{formErrors.department}</span>}
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>
                    Organization / Ministry <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="input"
                    style={{ width: '100%', borderColor: formErrors.ministry ? '#EF4444' : undefined }}
                    value={formData.ministry || ''}
                    onChange={e => setFormData({ ...formData, ministry: e.target.value })}
                    placeholder="e.g. Ministry of Statistics & Programme Implementation"
                  />
                  {formErrors.ministry && <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>{formErrors.ministry}</span>}
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>
                    Job Role
                  </label>
                  <input
                    type="text"
                    className="input"
                    style={{ width: '100%' }}
                    value={formData.jobRole || ''}
                    onChange={e => setFormData({ ...formData, jobRole: e.target.value })}
                    placeholder="e.g. Survey Data Compilation & Analytics"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>
                    Current Assignment
                  </label>
                  <input
                    type="text"
                    className="input"
                    style={{ width: '100%' }}
                    value={formData.currentAssignment || ''}
                    onChange={e => setFormData({ ...formData, currentAssignment: e.target.value })}
                    placeholder="e.g. Periodic Labour Force Survey (PLFS)"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>
                    Educational Qualification
                  </label>
                  <input
                    type="text"
                    className="input"
                    style={{ width: '100%' }}
                    value={formData.qualification || ''}
                    onChange={e => setFormData({ ...formData, qualification: e.target.value })}
                    placeholder="e.g. Ph.D. in Agricultural Statistics, M.Stat"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>
                    Years of Service / Experience
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    className="input"
                    style={{ width: '100%', borderColor: formErrors.yearsOfService ? '#EF4444' : undefined }}
                    value={formData.yearsOfService}
                    onChange={e => setFormData({ ...formData, yearsOfService: e.target.value })}
                    placeholder="e.g. 8"
                  />
                  {formErrors.yearsOfService && <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>{formErrors.yearsOfService}</span>}
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>
                    Location / Duty Station
                  </label>
                  <input
                    type="text"
                    className="input"
                    style={{ width: '100%' }}
                    value={formData.location || ''}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. New Delhi"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>
                  Existing Skills (comma-separated)
                </label>
                <input
                  type="text"
                  className="input"
                  style={{ width: '100%' }}
                  value={formData.skills || ''}
                  onChange={e => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="e.g. Sample Survey Design, Python, Pandas, Macroeconomic Aggregates, Data Quality"
                />
              </div>

              <div style={{
                display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 14,
                paddingTop: 16, borderTop: '1px solid var(--color-border)'
              }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsEditing(false)}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 120, justifyContent: 'center' }}
                >
                  {saveSuccess ? (
                    <>
                      <Check size={16} /> Saved!
                    </>
                  ) : saving ? (
                    'Saving...'
                  ) : (
                    <>
                      <Save size={16} /> Save Profile
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* LINK DEMO iGOT ACCOUNT MODAL DIALOG                     */}
      {/* ======================================================== */}
      {showDemoLinkModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(5, 11, 20, 0.88)',
          backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 10010, padding: 16
        }}>
          <div className="card" style={{
            width: '100%', maxWidth: 660, maxHeight: '92vh', overflowY: 'auto',
            background: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)', boxShadow: '0 24px 48px rgba(0, 0, 0, 0.7)',
            padding: 24, position: 'relative'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              borderBottom: '1px solid var(--color-border)', paddingBottom: 14, marginBottom: 16
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'linear-gradient(135deg, #F97316, #10B981)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(249, 115, 22, 0.3)'
                }}>
                  <GraduationCap size={22} color="#FFFFFF" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>
                      Link Demo iGOT Account
                    </h3>
                    <span style={{
                      fontSize: '0.68rem', padding: '2px 8px', borderRadius: 10,
                      background: 'rgba(245, 158, 11, 0.15)', color: 'var(--color-accent-gold)',
                      border: '1px solid rgba(245, 158, 11, 0.3)', fontWeight: 700
                    }}>
                      DEMO / MOCK MODE
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                    Simulate civil services learning synchronization via MockiGOTProvider
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowDemoLinkModal(false)}
                style={{
                  background: 'transparent', border: 'none', color: 'var(--color-text-secondary)',
                  cursor: 'pointer', padding: 4, borderRadius: 6
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Crucial Notice Explaining Demo/Mock Mode (Per Requirement 2) */}
            <div style={{
              padding: '12px 14px', borderRadius: 'var(--radius-md)',
              background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.25)',
              marginBottom: 18, display: 'flex', alignItems: 'flex-start', gap: 10
            }}>
              <Info size={16} color="#3B82F6" style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
                <strong style={{ color: 'var(--color-text-primary)' }}>Demonstration Environment Notice:</strong>
                <br />
                This is a mock integration using simulated iGOT learner data. <strong>No official passwords, tokens, or live credentials are asked or required.</strong> Select a demo learner profile below to test real-time synchronization of courses, completions, certificates, and learning hours.
              </div>
            </div>

            {/* Profile Selection List (Requirement 3 & 4) */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Select Demo Learner Profile ({demoProfiles.length || 3} Available)
              </label>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(demoProfiles.length > 0 ? demoProfiles : [
                  {
                    learnerId: "IGOT-DEMO-001",
                    name: "Dr. Priya Sharma (MoSPI Official Profile)",
                    designation: "Deputy Director / Senior Statistician",
                    department: "Labour Statistics Division (ISS Cadre)",
                    enrolledCount: 8,
                    completedCount: 5,
                    learningHours: 48,
                    certificatesCount: 5,
                    description: "Advanced profile with 8 courses in survey design, R, national accounts, and leadership."
                  },
                  {
                    learnerId: "IGOT-DEMO-002",
                    name: "Rajesh Kumar Verma (Field Cadre)",
                    designation: "Statistical Officer / Field Survey Lead",
                    department: "Survey Design & Research Division (SSS Cadre)",
                    enrolledCount: 3,
                    completedCount: 1,
                    learningHours: 18,
                    certificatesCount: 1,
                    description: "Field operations profile focusing on NSS survey methods and Data-Driven Decision Making."
                  },
                  {
                    learnerId: "IGOT-DEMO-003",
                    name: "Ananya Sen (Data Informatics)",
                    designation: "Assistant Director / Analytics Lead",
                    department: "Data Informatics & Innovation Division (DIID)",
                    enrolledCount: 5,
                    completedCount: 3,
                    learningHours: 32,
                    certificatesCount: 3,
                    description: "Technical analytics profile with completions in Python, Artificial Intelligence, and Cybersecurity."
                  }
                ]).map(p => {
                  const isSelected = selectedDemoId === p.learnerId;
                  return (
                    <div
                      key={p.learnerId}
                      onClick={() => setSelectedDemoId(p.learnerId)}
                      style={{
                        padding: 14, borderRadius: 'var(--radius-md)',
                        background: isSelected ? 'rgba(37, 99, 235, 0.1)' : 'var(--color-bg-secondary)',
                        border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                        cursor: 'pointer', transition: 'all 0.2s ease', position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                              {p.name}
                            </span>
                            <span style={{
                              fontSize: '0.68rem', padding: '2px 6px', borderRadius: 4,
                              background: 'var(--color-bg-card)', color: 'var(--color-text-tertiary)', border: '1px solid var(--color-border)', fontWeight: 600
                            }}>
                              {p.learnerId}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                            {p.designation} • {p.department}
                          </span>
                        </div>

                        <div style={{
                          width: 18, height: 18, borderRadius: '50%',
                          border: isSelected ? '5px solid var(--color-primary)' : '2px solid var(--color-border)',
                          background: isSelected ? '#FFFFFF' : 'transparent', marginTop: 2
                        }} />
                      </div>

                      <p style={{ margin: '6px 0 8px 0', fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.35 }}>
                        {p.description}
                      </p>

                      <div style={{ display: 'flex', gap: 12, fontSize: '0.72rem', color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
                        <span>📚 <strong>{p.enrolledCount}</strong> Enrolled</span>
                        <span>✅ <strong>{p.completedCount}</strong> Completed</span>
                        <span>⏱️ <strong>{p.learningHours}h</strong> Learning</span>
                        <span>📜 <strong>{p.certificatesCount}</strong> Certificates</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{
              display: 'flex', justifyContent: 'flex-end', gap: 10,
              paddingTop: 14, borderTop: '1px solid var(--color-border)'
            }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowDemoLinkModal(false)}
                disabled={linkingDemo}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleLinkDemoAccount()}
                disabled={linkingDemo}
                style={{ minWidth: 170, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              >
                {linkingDemo ? (
                  'Linking Demo Account...'
                ) : (
                  <>
                    <Link2 size={14} /> Link Selected Demo Account
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
