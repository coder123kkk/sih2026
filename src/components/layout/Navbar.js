'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles, Bell, Search, User, LogOut, ChevronDown,
  Shield, CheckCircle, ExternalLink, HelpCircle
} from 'lucide-react';

const pageTitles = {
  '/': 'Dashboard & Skill Intelligence',
  '/learning': 'My Learning & Pathways',
  '/competencies': 'Competency Framework & Analysis',
  '/assessments': 'Assessments & Quizzes',
  '/igot': 'iGOT Karmayogi Course Catalogue',
  '/training': 'NSSTA Training Programmes',
  '/ai-advisor': 'AI Copilot & Career Pathways',
  '/profile': 'Officer Competency Profile',
  '/admin': 'Cadre Administration & Workforce Analytics'
};

export default function Navbar() {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // If on login page, do not render header
  if (pathname === '/login') return null;

  const currentTitle = pageTitles[pathname] || 
    (pathname.startsWith('/igot/') ? 'iGOT Course Detail' : 'Skill Intelligence Platform');

  const notifications = [
    { id: 1, title: 'New Course Recommendation', text: 'Python for Data Analysis mapped to your skill gap', time: '10m ago' },
    { id: 2, title: 'Cadre Assessment Passed', text: 'Scored 100% on National Accounts Evaluation', time: '1h ago' },
    { id: 3, title: 'NSSTA Training Nominated', text: 'Nomination confirmed for Survey Sampling', time: '1d ago' }
  ];

  return (
    <header className="top-navbar">
      {/* Left: Context Breadcrumb / Title */}
      <div className="navbar-context-title">
        <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.82rem', fontWeight: 500 }}>
          India&apos;s Official Statistical System
        </span>
        <span style={{ color: 'var(--color-text-muted)' }}>/</span>
        <span style={{ color: 'var(--color-text-primary)', fontWeight: 700 }}>
          {currentTitle}
        </span>
      </div>

      {/* Right: Actions, AI Launcher, Notifications, Profile Chip */}
      <div className="navbar-actions">
        {/* Quick AI Copilot Launcher */}
        <Link
          href="/ai-advisor"
          className="btn btn-sm"
          style={{
            background: 'linear-gradient(135deg, #EEF2FF, #F3E8FF)',
            border: '1px solid #C7D2FE',
            color: 'var(--color-brand)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontWeight: 700,
            textDecoration: 'none'
          }}
        >
          <Sparkles size={14} color="#6366F1" />
          Ask AI Copilot
        </Link>

        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            style={{ padding: '7px 10px', position: 'relative' }}
            title="Notifications"
          >
            <Bell size={16} />
            <span style={{
              position: 'absolute', top: 3, right: 3, width: 7, height: 7,
              borderRadius: '50%', background: '#EF4444'
            }} />
          </button>

          {showNotifications && (
            <div style={{
              position: 'absolute', right: 0, top: '100%', marginTop: 8,
              width: 320, background: '#FFFFFF', border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
              zIndex: 100, padding: 12
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                paddingBottom: 8, borderBottom: '1px solid var(--color-border)', marginBottom: 8
              }}>
                <strong style={{ fontSize: '0.85rem' }}>Notifications</strong>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-brand)', cursor: 'pointer' }}>
                  Mark all as read
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {notifications.map(n => (
                  <div key={n.id} style={{
                    padding: '8px 10px', borderRadius: 'var(--radius-sm)',
                    background: 'var(--color-bg-primary)', fontSize: '0.78rem'
                  }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{n.title}</div>
                    <div style={{ color: 'var(--color-text-secondary)', marginTop: 2 }}>{n.text}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: 4 }}>{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Chip with Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="navbar-user-chip"
            style={{ cursor: 'pointer', border: '1px solid var(--color-border)', background: 'transparent' }}
          >
            <div className="navbar-avatar">
              PS
            </div>
            <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                Dr. Priya Sharma
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>
                Deputy Director, MoSPI
              </div>
            </div>
            <ChevronDown size={14} color="var(--color-text-muted)" />
          </button>

          {showProfileMenu && (
            <div style={{
              position: 'absolute', right: 0, top: '100%', marginTop: 8,
              width: 240, background: '#FFFFFF', border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
              zIndex: 100, padding: 8
            }}>
              <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--color-border)', marginBottom: 6 }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Dr. Priya Sharma</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>priya.sharma@mospi.gov.in</div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4,
                  padding: '2px 6px', borderRadius: 4, background: '#FEF3C7',
                  color: '#B45309', fontSize: '0.68rem', fontWeight: 700
                }}>
                  Demo Mode Active
                </div>
              </div>

              <Link
                href="/profile"
                className="sidebar-link"
                onClick={() => setShowProfileMenu(false)}
                style={{ padding: '8px 10px', fontSize: '0.82rem' }}
              >
                <User size={15} /> My Profile & Identity
              </Link>

              <Link
                href="/learning"
                className="sidebar-link"
                onClick={() => setShowProfileMenu(false)}
                style={{ padding: '8px 10px', fontSize: '0.82rem' }}
              >
                <CheckCircle size={15} /> My Learning Pathway
              </Link>

              <Link
                href="/admin"
                className="sidebar-link"
                onClick={() => setShowProfileMenu(false)}
                style={{ padding: '8px 10px', fontSize: '0.82rem' }}
              >
                <Shield size={15} /> Cadre Admin Portal
              </Link>

              <div style={{ borderTop: '1px solid var(--color-border)', marginTop: 6, paddingTop: 6 }}>
                <Link
                  href="/login"
                  className="sidebar-link"
                  onClick={() => setShowProfileMenu(false)}
                  style={{ padding: '8px 10px', fontSize: '0.82rem', color: '#DC2626' }}
                >
                  <LogOut size={15} /> Sign Out
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
