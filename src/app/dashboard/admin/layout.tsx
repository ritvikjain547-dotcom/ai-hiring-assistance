'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Building2, Briefcase, History, BarChart3, LogOut, Orbit, MessageSquare } from 'lucide-react'
import { logout } from '@/actions/admin'

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const links = [
    { href: '/dashboard/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/admin/applicants', label: 'Manage Applicants', icon: Users },
    { href: '/dashboard/admin/recruiters', label: 'Manage Recruiters', icon: Building2 },
    { href: '/dashboard/admin/jobs', label: 'Manage Jobs', icon: Briefcase },
    { href: '/dashboard/admin/review', label: 'Review Analytics', icon: BarChart3 },
    { href: '/dashboard/admin/feedback', label: 'Platform Feedback', icon: MessageSquare },
    { href: '/dashboard/admin/logs', label: 'Audit Logs', icon: History },
  ]

  return (
    <div className="dashboard-layout">
      {/* Top Bar */}
      <div className="dashboard-topbar">
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
          <Link href="/dashboard/admin" className="navbar-logo" style={{ color: "white" }}>
            <div className="navbar-logo-icon">
              <Orbit size={18} />
            </div>
            <span>
              Hire<span style={{ color: "#38bdf8" }}>AI</span> Admin
            </span>
          </Link>
        </div>

        <div className="dashboard-topbar-right">
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <span className="badge badge-primary">ADMIN</span>
            <div className="avatar avatar-sm">A</div>
            <span style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "white" }}>Administrator</span>
          </div>
          <form action={logout}>
            <button type="submit" className="btn btn-ghost btn-sm">
              <LogOut size={16} />
              Sign Out
            </button>
          </form>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="sidebar">
        <nav className="sidebar-nav">
          <div className="sidebar-section">
            <div className="sidebar-section-title">Menu</div>
            {links.map((link) => {
              const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/dashboard/admin');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
                >
                  <link.icon size={18} className="sidebar-link-icon" />
                  {link.label}
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="sidebar-footer">
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <div className="avatar avatar-sm">A</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                Administrator
              </div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                admin@hireai.com
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">{children}</main>
    </div>
  )
}
