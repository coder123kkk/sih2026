'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, Clock, BarChart2, BookOpen, Filter, X, Tag, Layers, Zap, Sparkles } from 'lucide-react';
import { truncate, getDifficultyColor } from '@/lib/utils';

export default function IGOTCataloguePage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    skill: '',
    difficulty: '',
    duration: ''
  });
  
  const [categories, setCategories] = useState([
    'Statistics',
    'Data Science',
    'AI/ML',
    'Digital Governance',
    'Cybersecurity',
    'Management'
  ]);
  
  const [skills, setSkills] = useState([
    'Python',
    'R',
    'SQL',
    'GIS',
    'AI/ML',
    'Data Visualization',
    'Sampling',
    'Survey Design',
    'National Accounts',
    'Leadership'
  ]);

  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  const durations = [
    { id: 'short', label: '< 2 Hours', value: '<2h' },
    { id: 'medium', label: '2 – 4 Hours', value: '2-4h' },
    { id: 'long', label: '4+ Hours', value: '4h+' }
  ];

  const [total, setTotal] = useState(0);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query.trim());
      if (filters.category) params.set('category', filters.category);
      if (filters.skill) params.set('skill', filters.skill);
      if (filters.difficulty) params.set('difficulty', filters.difficulty);
      if (filters.duration) params.set('duration', filters.duration);
      params.set('limit', '50');

      const res = await fetch(`/api/igot/courses?${params.toString()}`);
      const data = await res.json();
      setCourses(data.courses || []);
      setTotal(data.total || 0);

      // Dynamically use available filter options if returned
      if (data.availableCategories && data.availableCategories.length > 0) {
        setCategories(data.availableCategories);
      }
      if (data.availableSkills && data.availableSkills.length > 0) {
        setSkills(data.availableSkills.slice(0, 10)); // Top 10 most relevant skills
      }
    } catch (err) {
      console.error('Failed to load iGOT courses:', err);
    } finally {
      setLoading(false);
    }
  }, [query, filters]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  function toggleFilter(key, value) {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key] === value ? '' : value
    }));
  }

  function clearAllFilters() {
    setFilters({
      category: '',
      skill: '',
      difficulty: '',
      duration: ''
    });
    setQuery('');
  }

  const categoryIcons = {
    'Statistics': '📊',
    'Statistical': '📊',
    'Data Science': '💻',
    'Technical': '💻',
    'AI/ML': '🤖',
    'Digital Governance': '🏛️',
    'Cybersecurity': '🔒',
    'Management': '👥',
    'Behavioural': '🤝'
  };

  const categoryGradients = {
    'Statistics': 'linear-gradient(135deg, #0F766E, #3B82F6)',
    'Statistical': 'linear-gradient(135deg, #0F766E, #3B82F6)',
    'Data Science': 'linear-gradient(135deg, #1E40AF, #8B5CF6)',
    'Technical': 'linear-gradient(135deg, #1E40AF, #8B5CF6)',
    'AI/ML': 'linear-gradient(135deg, #4F46E5, #EC4899)',
    'Digital Governance': 'linear-gradient(135deg, #065F46, #10B981)',
    'Cybersecurity': 'linear-gradient(135deg, #881337, #E11D48)',
    'Management': 'linear-gradient(135deg, #92400E, #F59E0B)',
    'Behavioural': 'linear-gradient(135deg, #92400E, #F59E0B)'
  };

  const hasActiveFilters = Boolean(
    filters.category || filters.skill || filters.difficulty || filters.duration || query
  );

  return (
    <div className="page-container animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
          <h1 className="page-title">iGOT Karmayogi</h1>
          <span className="igot-branding">
            <BookOpen size={12} /> Integrated with iGOT
          </span>
          <span style={{
            fontSize: '0.7rem', padding: '2px 8px', borderRadius: 10,
            background: 'rgba(245, 158, 11, 0.12)', color: 'var(--color-accent-gold)',
            border: '1px solid rgba(245, 158, 11, 0.3)', fontWeight: 700
          }}>
            DEMO / MOCK MODE
          </span>
        </div>
        <p className="page-subtitle">
          Explore official capacity building courses for Indian Statistical Service & official cadres.
          {total > 0 && (
            <span style={{ color: 'var(--color-accent-blue-light)', fontWeight: 600 }}>
              {' '}• {total} course{total !== 1 ? 's' : ''} available
            </span>
          )}
        </p>
      </div>

      {/* Search & Comprehensive Filters */}
      <div className="search-section" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Search Bar */}
        <div className="search-bar" style={{ position: 'relative' }}>
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search iGOT courses — Python, R, Sampling, AI, GIS, Survey Design, Cybersecurity..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                background: 'transparent', border: 'none', color: 'var(--color-text-muted)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 2
              }}
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Structured Filter Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* 1. Category Filter Row */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <span style={{
              fontSize: '0.76rem', color: 'var(--color-text-muted)', fontWeight: 700,
              minWidth: 130, display: 'flex', alignItems: 'center', gap: 5, textTransform: 'uppercase', letterSpacing: '0.03em'
            }}>
              <Layers size={13} color="var(--color-primary)" /> Category:
            </span>
            <button
              className={`filter-chip ${!filters.category ? 'active' : ''}`}
              onClick={() => toggleFilter('category', '')}
            >
              All Categories
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-chip ${filters.category === cat ? 'active' : ''}`}
                onClick={() => toggleFilter('category', cat)}
              >
                {categoryIcons[cat] || '📚'} {cat}
              </button>
            ))}
          </div>

          {/* 2. Skill/Competency Filter Row */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <span style={{
              fontSize: '0.76rem', color: 'var(--color-text-muted)', fontWeight: 700,
              minWidth: 130, display: 'flex', alignItems: 'center', gap: 5, textTransform: 'uppercase', letterSpacing: '0.03em'
            }}>
              <Tag size={13} color="#10B981" /> Skill / Competency:
            </span>
            <button
              className={`filter-chip ${!filters.skill ? 'active' : ''}`}
              onClick={() => toggleFilter('skill', '')}
            >
              All Skills
            </button>
            {skills.map(skill => (
              <button
                key={skill}
                className={`filter-chip ${filters.skill === skill ? 'active' : ''}`}
                onClick={() => toggleFilter('skill', skill)}
              >
                {skill}
              </button>
            ))}
          </div>

          {/* 3 & 4. Level & Duration Filter Row */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            {/* Level / Difficulty */}
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <span style={{
                fontSize: '0.76rem', color: 'var(--color-text-muted)', fontWeight: 700,
                minWidth: 130, display: 'flex', alignItems: 'center', gap: 5, textTransform: 'uppercase', letterSpacing: '0.03em'
              }}>
                <BarChart2 size={13} color="#F59E0B" /> Level:
              </span>
              <button
                className={`filter-chip ${!filters.difficulty ? 'active' : ''}`}
                onClick={() => toggleFilter('difficulty', '')}
              >
                All Levels
              </button>
              {difficulties.map(diff => (
                <button
                  key={diff}
                  className={`filter-chip ${filters.difficulty === diff ? 'active' : ''}`}
                  onClick={() => toggleFilter('difficulty', diff)}
                >
                  {diff}
                </button>
              ))}
            </div>

            <span style={{ color: 'var(--color-border)', display: 'inline-block' }}>|</span>

            {/* Duration */}
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <span style={{
                fontSize: '0.76rem', color: 'var(--color-text-muted)', fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: 5, textTransform: 'uppercase', letterSpacing: '0.03em'
              }}>
                <Clock size={13} color="#3B82F6" /> Duration:
              </span>
              <button
                className={`filter-chip ${!filters.duration ? 'active' : ''}`}
                onClick={() => toggleFilter('duration', '')}
              >
                All
              </button>
              {durations.map(dur => (
                <button
                  key={dur.id}
                  className={`filter-chip ${filters.duration === dur.value ? 'active' : ''}`}
                  onClick={() => toggleFilter('duration', dur.value)}
                >
                  {dur.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Filter Pills Bar */}
        {hasActiveFilters && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 14px', borderRadius: 'var(--radius-md)',
            background: 'rgba(37, 99, 235, 0.06)', border: '1px solid rgba(37, 99, 235, 0.2)',
            flexWrap: 'wrap', gap: 8
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                Active Filters ({courses.length} match{courses.length !== 1 ? 'es' : ''}):
              </span>

              {filters.category && (
                <span className="filter-chip active" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px' }}>
                  Category: {filters.category}
                  <X size={12} style={{ cursor: 'pointer' }} onClick={() => toggleFilter('category', '')} />
                </span>
              )}

              {filters.skill && (
                <span className="filter-chip active" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', background: '#10B981', borderColor: '#10B981' }}>
                  Skill: {filters.skill}
                  <X size={12} style={{ cursor: 'pointer' }} onClick={() => toggleFilter('skill', '')} />
                </span>
              )}

              {filters.difficulty && (
                <span className="filter-chip active" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', background: '#F59E0B', borderColor: '#F59E0B' }}>
                  Level: {filters.difficulty}
                  <X size={12} style={{ cursor: 'pointer' }} onClick={() => toggleFilter('difficulty', '')} />
                </span>
              )}

              {filters.duration && (
                <span className="filter-chip active" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', background: '#3B82F6', borderColor: '#3B82F6' }}>
                  Duration: {durations.find(d => d.value === filters.duration)?.label || filters.duration}
                  <X size={12} style={{ cursor: 'pointer' }} onClick={() => toggleFilter('duration', '')} />
                </span>
              )}

              {query && (
                <span className="filter-chip active" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', background: 'var(--color-text-secondary)', borderColor: 'var(--color-text-secondary)' }}>
                  Search: &quot;{query}&quot;
                  <X size={12} style={{ cursor: 'pointer' }} onClick={() => setQuery('')} />
                </span>
              )}
            </div>

            <button
              onClick={clearAllFilters}
              style={{
                background: 'transparent', border: 'none', color: 'var(--color-accent-red)',
                fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4
              }}
            >
              <X size={13} /> Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Results Section */}
      {loading ? (
        <div className="courses-grid">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="course-card">
              <div className="course-card-image loading-skeleton" />
              <div className="course-card-body">
                <div className="loading-skeleton" style={{ height: 14, width: '60%', marginBottom: 8 }} />
                <div className="loading-skeleton" style={{ height: 18, width: '90%', marginBottom: 8 }} />
                <div className="loading-skeleton" style={{ height: 40, width: '100%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="empty-state card" style={{ textAlign: 'center', padding: '48px 24px', margin: '24px 0' }}>
          <div className="empty-state-icon" style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔍</div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 700 }}>No courses found</h3>
          <p className="empty-state-text" style={{ color: 'var(--color-text-secondary)', maxWidth: 460, margin: '0 auto 16px auto', fontSize: '0.88rem' }}>
            No iGOT courses match your selected filter criteria. Try clearing one or more filters to view more courses.
          </p>
          <button className="btn btn-outline" onClick={clearAllFilters}>
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="courses-grid stagger-children">
          {courses.map(course => {
            const courseLevel = course.level || course.difficulty || 'Beginner';
            return (
              <Link key={course.id} href={`/igot/${course.id}`} style={{ textDecoration: 'none' }}>
                <div className="course-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div className="course-card-image" style={{
                    background: categoryGradients[course.category] || 'linear-gradient(135deg, #1E40AF, #8B5CF6)'
                  }}>
                    <span style={{ position: 'relative', zIndex: 1, fontSize: '1.8rem' }}>
                      {categoryIcons[course.category] || '📚'}
                    </span>
                    <span className="course-card-category">{course.category}</span>
                  </div>
                  <div className="course-card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div className="course-card-provider">{course.provider}</div>
                    <div className="course-card-title">{course.title}</div>
                    <div className="course-card-description">{truncate(course.description, 100)}</div>

                    <div className="course-card-meta" style={{ marginTop: 'auto', paddingTop: 10 }}>
                      <span className="course-card-meta-item">
                        <Clock size={13} /> {course.duration}
                      </span>
                      <span className="course-card-meta-item" style={{ color: getDifficultyColor(courseLevel), fontWeight: 600 }}>
                        <BarChart2 size={13} /> {courseLevel}
                      </span>
                    </div>

                    <div className="course-card-competencies" style={{ marginTop: 8 }}>
                      {(course.skills || (course.competencies || []).map(c => c.name || c)).slice(0, 3).map((skillName, idx) => (
                        <span key={idx} className="competency-badge medium">
                          {skillName}
                        </span>
                      ))}
                      {((course.skills || course.competencies || []).length > 3) && (
                        <span className="competency-badge low">
                          +{(course.skills || course.competencies).length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
