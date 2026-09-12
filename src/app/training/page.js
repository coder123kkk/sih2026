'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building2, Calendar, MapPin, Users, Clock, Search, Filter } from 'lucide-react';
import { formatDate, getModeIcon } from '@/lib/utils';

export default function TrainingPage() {
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [modeFilter, setModeFilter] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (modeFilter) params.set('mode', modeFilter);

    fetch(`/api/training?${params}`)
      .then(r => r.json())
      .then(data => { setProgrammes(data.programmes || []); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, [query, modeFilter]);

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">NSSTA / TPAC Training Programmes</h1>
        <p className="page-subtitle">
          Training programmes from the National Statistical Systems Training Academy
        </p>
      </div>

      {/* Search & Filters */}
      <div className="search-section">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search training programmes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="filter-row">
          <span style={{fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4}}>
            <Filter size={14} /> Mode:
          </span>
          {['classroom', 'online', 'hybrid'].map(mode => (
            <button
              key={mode}
              className={`filter-chip ${modeFilter === mode ? 'active' : ''}`}
              onClick={() => setModeFilter(modeFilter === mode ? '' : mode)}
            >
              {getModeIcon(mode)} {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Programmes Grid */}
      {loading ? (
        <div className="courses-grid">
          {[1,2,3].map(i => (
            <div key={i} className="training-card"><div className="loading-skeleton" style={{height: 200}} /></div>
          ))}
        </div>
      ) : programmes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏛️</div>
          <div className="empty-state-text">No training programmes found</div>
        </div>
      ) : (
        <div className="courses-grid stagger-children">
          {programmes.map(prog => (
            <div key={prog.id} className="training-card">
              <div className="training-card-header">
                <span className="training-card-mode">
                  {getModeIcon(prog.mode)} {prog.mode}
                </span>
                <span className="training-card-dates">
                  {formatDate(prog.startDate)} — {formatDate(prog.endDate)}
                </span>
              </div>

              <div className="training-card-title">{prog.title}</div>
              <div className="training-card-institution">
                <Building2 size={12} style={{verticalAlign: 'middle', marginRight: 4}} />
                {prog.institution}
              </div>

              <p style={{fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-md)', lineHeight: 1.5}}>
                {prog.description?.slice(0, 140)}...
              </p>

              <div className="training-card-details">
                <span><Clock size={12} /> {prog.duration}</span>
                <span><Users size={12} /> {prog.targetGroup?.split(',')[0]}</span>
                <span><MapPin size={12} /> {prog.venue?.split(',')[0]}</span>
              </div>

              {/* Competencies */}
              <div style={{display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 'var(--space-md)'}}>
                {(prog.competencies || []).map(comp => (
                  <span key={comp.id} className={`competency-badge ${comp.weight}`}>
                    {comp.name}
                  </span>
                ))}
              </div>

              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span className="training-card-seats">
                  <span className="seats-available">{prog.seatsAvailable}</span> / {prog.seats} seats available
                </span>
                <span style={{fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-accent-green)'}}>
                  {prog.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
