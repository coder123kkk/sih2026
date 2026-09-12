'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, User, BookOpen, GraduationCap, Target,
  Award, Zap, Building2, Menu, X, Sparkles, Shield,
  Layers, Users, BarChart3, TrendingUp, CheckCircle, Clock,
  ArrowRightLeft
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminMode, setAdminMode] = useState(pathname.startsWith('/admin'));

  if (pathname === '/login') return null;

  // Learner Navigation Items
  const learnerNavItems = [
    { section: 'Overview' },
    { href: '/', label: 'Home / Dashboard', icon: LayoutDashboard },
    { href: '/ai-advisor', label: 'AI Copilot', icon: Sparkles, badge: 'AI' },

    { section: 'Competency & Skills' },
    { href: '/competencies', label: 'Competencies', icon: Target },
    { href: '/assessments', label: 'Assessments & Quizzes', icon: Award },
    { href: '/learning', label: 'My Learning Pathways', icon: GraduationCap },

    { section: 'Learning Catalogue' },
    { href: '/igot', label: 'iGOT Karmayogi', icon: BookOpen, badge: 'iGOT', badgeGold: true },
    { href: '/training', label: 'NSSTA Training', icon: Building2 },

    { section: 'Officer Identity' },
    { href: '/profile', label: 'Profile & Credentials', icon: User },
  ];

  // Administrator Navigation Items
  const adminNavItems = [
    { section: 'Cadre Administration' },
    { href: '/admin', label: 'Admin Dashboard', icon: Shield, badge: 'MoSPI' },
    { href: '/admin?tab=workforce', label: 'Workforce Analytics', icon: Users },
    { href: '/admin?tab=competencies', label: 'Competency Heatmaps', icon: BarChart3 },
    { href: '/admin?tab=training', label: 'Training Analytics', icon: TrendingUp },

    { section: 'Navigation Switch' },
    { href: '/', label: 'Return to Learner Portal', icon: LayoutDashboard },
  ];

  const currentNav = (adminMode || pathname.startsWith('/admin')) ? adminNavItems : learnerNavItems;

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="mobile-menu-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{
          position: 'fixed', top: 14, left: 14, zIndex: 200,
          background: '#FFFFFF', border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)', padding: '8px',
          color: 'var(--color-text-primary)', cursor: 'pointer',
          display: 'none', boxShadow: 'var(--shadow-md)'
        }}
        aria-label="Toggle Navigation"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        {/* Platform Identity Header */}
        <div className="sidebar-header">
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div className="sidebar-logo">
              <div className="sidebar-logo-icon">
                <GraduationCap size={22} />
              </div>
              <div>
                <div className="sidebar-logo-text">Skill Intelligence</div>
                <div className="sidebar-logo-sub">Official Statistical Workforce</div>
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          {currentNav.map((item, i) => {
            if (item.section) {
              return (
                <div key={`section-${i}`} className="sidebar-section-title">
                  {item.section}
                </div>
              );
            }

            const Icon = item.icon;
            const isExactActive = pathname === item.href;
            const isPrefixActive = item.href !== '/' && pathname.startsWith(item.href);
            const isActive = isExactActive || isPrefixActive;

            return (
              <Link
                key={`${item.href}-${i}`}
                href={item.href}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={18} className="sidebar-link-icon" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`sidebar-badge ${item.badgeGold ? 'gold' : ''}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Portal Switcher & Demo Mode Footer */}
        <div className="sidebar-footer">
          {/* View Toggle */}
          <button
            onClick={() => setAdminMode(!adminMode)}
            className="btn btn-secondary btn-sm"
            style={{
              width: '100%', marginBottom: 10, fontSize: '0.74rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
            }}
          >
            <ArrowRightLeft size={13} />
            {adminMode ? 'Switch to Learner Portal' : 'Switch to Cadre Admin'}
          </button>

          <div className="sidebar-mode-badge">
            <Zap size={13} />
            <span>DEMO / MOCK MODE ACTIVE</span>
          </div>
        </div>
      </aside>
    </>
  );
}
