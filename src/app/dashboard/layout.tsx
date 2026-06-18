import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { signOut } from "@/lib/auth";
import Link from "next/link";
import {
  Brain,
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  User,
  Search,
  LogOut,
  Sparkles,
} from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");



  const role = (session.user as any).role;
  const isRecruiter = role === "RECRUITER";

  const recruiterLinks = [
    {
      section: "Overview",
      links: [
        { href: "/dashboard/recruiter", label: "Dashboard", icon: LayoutDashboard },
      ],
    },
    {
      section: "Recruitment",
      links: [
        { href: "/dashboard/recruiter/jobs", label: "My Jobs", icon: Briefcase },
        { href: "/dashboard/recruiter/jobs/new", label: "Post New Job", icon: FileText },
      ],
    },
    {
      section: "AI Screening",
      links: [
        { href: "/dashboard/recruiter/applications", label: "AI Screening", icon: Sparkles },
      ],
    },
  ];

  const applicantLinks = [
    {
      section: "Overview",
      links: [
        { href: "/dashboard/applicant", label: "Dashboard", icon: LayoutDashboard },
      ],
    },
    {
      section: "Job Search",
      links: [
        { href: "/dashboard/applicant/jobs", label: "Browse Jobs", icon: Search },
        { href: "/dashboard/applicant/applications", label: "My Applications", icon: FileText },
      ],
    },
    {
      section: "Profile",
      links: [
        { href: "/dashboard/applicant/profile", label: "My Profile", icon: User },
      ],
    },
  ];

  const navSections = isRecruiter ? recruiterLinks : applicantLinks;

  return (
    <div className="dashboard-layout">
      {/* Top Bar */}
      <div className="dashboard-topbar">
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
          <Link href="/" className="navbar-logo" style={{ color: "white" }}>
            <div className="navbar-logo-icon">
              <Brain size={18} />
            </div>
            <span>
              Hire<span style={{ color: "#38bdf8" }}>AI</span>
            </span>
          </Link>
        </div>

        <div className="dashboard-topbar-right">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-3)",
            }}
          >
            <span
              className={`badge ${isRecruiter ? "badge-primary" : "badge-success"}`}
            >
              {role}
            </span>
            <div className="avatar avatar-sm" style={{ overflow: "hidden" }}>
              {session.user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <span style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "white" }}>
              {session.user.name}
            </span>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button type="submit" className="btn btn-ghost btn-sm" id="logout-btn" style={{ color: "white" }}>
              <LogOut size={16} />
              Sign Out
            </button>
          </form>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="sidebar">
        <nav className="sidebar-nav">
          {navSections.map((section, si) => (
            <div key={si} className="sidebar-section">
              <div className="sidebar-section-title">{section.section}</div>
              {section.links.map((link, li) => (
                <Link
                  key={li}
                  href={link.href}
                  className="sidebar-link"
                >
                  <link.icon size={18} className="sidebar-link-icon" />
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-3)",
              padding: "var(--space-3)",
            }}
          >
            <div className="avatar avatar-sm" style={{ overflow: "hidden" }}>
              {session.user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "var(--text-sm)",
                  fontWeight: 600,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {session.user.name}
              </div>
              <div
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text-tertiary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {session.user.email}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">{children}</main>
    </div>
  );
}
