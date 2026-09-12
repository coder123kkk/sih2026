'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  GraduationCap, LogIn, Shield, CheckCircle, Sparkles,
  BookOpen, Target, ArrowRight, Lock, KeyRound
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('priya.sharma@mospi.gov.in');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      // Store token
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      router.push('/');
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      background: '#FFFFFF'
    }}>
      {/* LEFT SIDE: Visual EdTech Inspirational Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 40%, #F0FDF4 100%)',
        borderRight: '1px solid var(--color-border)',
        padding: '60px 48px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle decorative circles */}
        <div style={{
          position: 'absolute', top: -80, right: -80, width: 260, height: 260,
          borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: -60, left: -60, width: 220, height: 220,
          borderRadius: '50%', background: 'rgba(13, 148, 136, 0.08)', pointerEvents: 'none'
        }} />

        {/* Top: Brand Header */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#FFFFFF', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
            }}>
              <GraduationCap size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-text-primary)' }}>
                Skill Intelligence Platform
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                Ministry of Statistics and Programme Implementation (MoSPI)
              </div>
            </div>
          </div>
        </div>

        {/* Middle: Value Proposition */}
        <div style={{ maxWidth: 520, margin: '40px 0' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 12px', borderRadius: 20,
            background: '#FFFFFF', border: '1px solid #C7D2FE',
            color: 'var(--color-brand)', fontSize: '0.78rem', fontWeight: 700,
            marginBottom: 20, boxShadow: 'var(--shadow-sm)'
          }}>
            <Sparkles size={14} color="#6366F1" />
            AI-Powered Statistical Workforce Development
          </div>

          <h1 style={{
            fontSize: '2.4rem', fontWeight: 800, color: 'var(--color-text-primary)',
            lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.02em'
          }}>
            Empowering India&apos;s Official Statistical Cadre
          </h1>

          <p style={{
            fontSize: '1rem', color: 'var(--color-text-secondary)',
            lineHeight: 1.6, marginBottom: 32
          }}>
            Continuous professional learning, competency diagnostics, and personalized iGOT Karmayogi pathways designed specifically for MoSPI and Indian Statistical Service (ISS) officers.
          </p>

          {/* 3 Key Educational Pillars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'rgba(255, 255, 255, 0.75)', padding: '12px 16px',
              borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(8px)', boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-brand)'
              }}>
                <Target size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-text-primary)' }}>
                  Autonomous Competency Diagnostics
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--color-text-secondary)' }}>
                  Measure 24 official statistical, technical, and governance competencies
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'rgba(255, 255, 255, 0.75)', padding: '12px 16px',
              borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(8px)', boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#0D9488'
              }}>
                <BookOpen size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-text-primary)' }}>
                  Integrated iGOT Karmayogi Curricula
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--color-text-secondary)' }}>
                  Curated courses mapped to departmental promotions and APAR evaluations
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'rgba(255, 255, 255, 0.75)', padding: '12px 16px',
              borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(8px)', boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: '#FDF4FF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#7C3AED'
              }}>
                <Sparkles size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-text-primary)' }}>
                  Karmayogi AI Copilot
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--color-text-secondary)' }}>
                  Intelligent statistical methodologies, survey advice, and roadmap planning
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Security Note */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          <Shield size={14} color="#0D9488" />
          <span>Government of India • Official Statistical Capacity Building Framework</span>
        </div>
      </div>

      {/* RIGHT SIDE: Clean EdTech Login Card */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 32px',
        background: '#FFFFFF'
      }}>
        <div style={{ maxWidth: 440, width: '100%' }}>
          {/* Welcome Header */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 8 }}>
              Officer Sign In
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
              Enter your official government email to access your personalized learning pathways.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 6 }}>
                Official Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="input"
                  style={{ width: '100%', padding: '12px 14px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.name@mospi.gov.in"
                  required
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  Password
                </label>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-brand)', cursor: 'pointer' }}>
                  Forgot password?
                </span>
              </div>
              <input
                type="password"
                className="input"
                style={{ width: '100%', padding: '12px 14px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>

            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                background: '#FEE2E2', border: '1px solid #FECACA',
                color: '#DC2626', fontSize: '0.82rem', fontWeight: 600
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%', padding: '12px', fontSize: '0.95rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                marginTop: 4
              }}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : (
                <>
                  <LogIn size={18} /> Sign In to Learning Portal
                </>
              )}
            </button>
          </form>

          {/* Parichay / MeriPehchan SSO Option */}
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0',
              color: 'var(--color-text-muted)', fontSize: '0.78rem'
            }}>
              <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
              <span>OR SINGLE SIGN-ON</span>
              <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
            </div>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setEmail('priya.sharma@mospi.gov.in');
                setPassword('demo123');
              }}
              style={{
                width: '100%', padding: '11px', fontSize: '0.85rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
              }}
            >
              <KeyRound size={16} color="var(--color-brand)" />
              Sign In via Parichay (National SSO)
            </button>
          </div>

          {/* Demo Mode Notice Box */}
          <div style={{
            marginTop: 28, padding: '14px 16px',
            borderRadius: 'var(--radius-md)',
            background: '#FEF3C7', border: '1px solid #FDE68A',
            color: '#92400E', fontSize: '0.78rem', lineHeight: 1.5
          }}>
            <div style={{ fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={14} color="#D97706" />
              DEMO / EVALUATION MODE ACTIVE
            </div>
            Pre-loaded with sample ISS Cadre officer:
            <div style={{ marginTop: 4, fontFamily: 'monospace', fontWeight: 600 }}>
              Email: priya.sharma@mospi.gov.in<br />
              Password: demo123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
