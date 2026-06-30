import Link from "next/link";
import {
  Briefcase,
  Users,
  Brain,
  Shield,
  BarChart3,
  Zap,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Orbit,
} from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";

export default function HomePage() {
  return (
    <main style={{ position: "relative" }}>
      {/* Animated Background Blobs */}
      <div className="animated-background">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      {/* Subtle grid overlay */}
      <div className="bg-grid" style={{ zIndex: 0, opacity: 0.4 }} />

      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="navbar-logo">
            <div className="navbar-logo-icon">
              <Orbit size={20} style={{ animation: "spin 12s linear infinite" }} />
            </div>
            <span>
              Hire<span className="gradient-text">AI</span>
            </span>
          </Link>

          <div className="navbar-links">
            <a href="#features" className="navbar-link">Features</a>
            <a href="#pricing" className="navbar-link">Pricing</a>
            <a href="#faq" className="navbar-link">FAQ</a>
          </div>

          <div className="navbar-actions">
            <Link href="/login" className="btn btn-ghost">
              Sign In
            </Link>
            <Link href="/register" className="btn btn-primary">
              Get Started Free
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-badge">
          <Sparkles size={14} />
          AI-Powered Recruitment Platform
        </div>

        <h1 className="hero-title">
          Hire Smarter with{" "}
          <span className="gradient-text">Artificial Intelligence</span>
        </h1>

        <p className="hero-description">
          Screen, evaluate, and shortlist candidates 10x faster. Our AI-powered
          platform helps companies find the perfect match while giving
          applicants a seamless experience.
        </p>

        <div className="hero-actions">
          <Link href="/register" className="btn btn-primary btn-lg">
            Start Hiring Today
            <ArrowRight size={18} />
          </Link>
          <Link href="/register" className="btn btn-secondary btn-lg">
            Find Your Dream Job
          </Link>
        </div>

        {/* Trust Badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "var(--space-8)",
            marginTop: "var(--space-12)",
            animation: "slide-up 0.6s ease-out 0.4s both",
          }}
        >
          {[
            { icon: <CheckCircle2 size={16} />, text: "Free to start" },
            { icon: <Shield size={16} />, text: "Enterprise security" },
            { icon: <Zap size={16} />, text: "AI-powered matching" },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                fontSize: "var(--text-sm)",
                color: "var(--color-text-secondary)",
              }}
            >
              <span style={{ color: "var(--color-accent-success)" }}>{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>
      </section>

      {/* Logos Section */}
      <section style={{ padding: "var(--space-6) 0", borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)", textAlign: "center", background: "var(--color-bg-secondary)", overflow: "hidden" }}>
        <p style={{ fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-text-tertiary)", fontWeight: 600, marginBottom: "var(--space-4)" }}>
          Trusted by hiring teams at world-class companies
        </p>
        <div className="horizontal-marquee-container" style={{ padding: "0" }}>
          <div className="horizontal-marquee">
            {[
              "Google", "Flipkart", "Amazon", "Microsoft", "Netflix", "Meta", "Apple", "Spotify", "Uber", "Airbnb",
              "Google", "Flipkart", "Amazon", "Microsoft", "Netflix", "Meta", "Apple", "Spotify", "Uber", "Airbnb" // Duplicate for infinite scroll
            ].map((company, i) => (
              <span 
                key={i} 
                style={{ 
                  fontSize: "var(--text-2xl)", 
                  fontWeight: 800, 
                  color: "var(--color-text-primary)", 
                  letterSpacing: "-0.05em",
                  opacity: 0.6,
                  display: "inline-flex",
                  alignItems: "center"
                }}
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="stats-section" style={{ marginTop: "100px" }}>
        <div className="stats-grid">
          {[
            { end: 50, suffix: "K+", label: "Jobs Posted" },
            { end: 200, suffix: "K+", label: "Active Candidates" },
            { end: 15, suffix: "K+", label: "Companies Trust Us" },
            { end: 92, suffix: "%", label: "Faster Hiring" },
          ].map((stat, i) => (
            <div key={i}>
              <AnimatedCounter end={stat.end} suffix={stat.suffix} />
              <div className="stats-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="text-center" style={{ marginBottom: "var(--space-16)" }}>
          <div className="section-badge">
            <Sparkles size={12} />
            Features
          </div>
          <h2 className="section-title">
            Everything you need to{" "}
            <span className="gradient-text">hire effectively</span>
          </h2>
          <p
            className="section-description"
            style={{ margin: "0 auto", maxWidth: "600px" }}
          >
            From job posting to candidate screening, our platform streamlines
            every step of the recruitment process.
          </p>
        </div>

        <div className="grid-3">
          {[
            {
              icon: <Briefcase size={24} />,
              title: "Smart Job Posting",
              description:
                "Create detailed job listings with skill requirements, salary ranges, and AI-optimized descriptions that attract top talent.",
              color: "#6366f1",
              bg: "rgba(99, 102, 241, 0.08)",
            },
            {
              icon: <Users size={24} />,
              title: "Candidate Management",
              description:
                "Track every applicant through your hiring pipeline with a centralized dashboard showing real-time application status.",
              color: "#06b6d4",
              bg: "rgba(6, 182, 212, 0.08)",
            },
            {
              icon: <Brain size={24} />,
              title: "AI Resume Screening",
              description:
                "Leverage artificial intelligence to analyze resumes, match skills to requirements, and rank candidates automatically.",
              color: "#8b5cf6",
              bg: "rgba(139, 92, 246, 0.08)",
            },
            {
              icon: <BarChart3 size={24} />,
              title: "Analytics Dashboard",
              description:
                "Get insights into your hiring funnel with real-time analytics, conversion rates, and time-to-hire metrics.",
              color: "#10b981",
              bg: "rgba(16, 185, 129, 0.08)",
            },
            {
              icon: <Shield size={24} />,
              title: "Secure & Compliant",
              description:
                "Enterprise-grade security with role-based access control, encrypted data storage, and compliance-ready infrastructure.",
              color: "#f59e0b",
              bg: "rgba(245, 158, 11, 0.08)",
            },
            {
              icon: <Zap size={24} />,
              title: "Lightning Fast",
              description:
                "Reduce your hiring cycle from weeks to days with automated workflows, instant notifications, and one-click actions.",
              color: "#ef4444",
              bg: "rgba(239, 68, 68, 0.08)",
            },
          ].map((feature, i) => (
            <div key={i} className="feature-card">
              <div
                className="feature-icon"
                style={{ background: feature.bg, color: feature.color }}
              >
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ padding: "var(--space-24) var(--space-8)", borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)", background: "var(--color-bg-secondary)" }}>
        <div className="text-center" style={{ marginBottom: "var(--space-16)" }}>
          <div className="section-badge">
            Pricing Plans
          </div>
          <h2 className="section-title">
            Simple, transparent pricing
          </h2>
          <p className="section-description" style={{ margin: "0 auto", maxWidth: "600px" }}>
            Choose the perfect plan for your recruitment needs. Free for candidates, always.
          </p>
        </div>

        <div className="grid-3" style={{ maxWidth: "1100px", margin: "0 auto" }}>
          {/* Candidates Plan */}
          <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 700, color: "#000000", marginBottom: "var(--space-2)" }}>For Candidates</h3>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", marginBottom: "var(--space-6)" }}>Find and apply to your next dream job.</p>
              <div style={{ fontSize: "var(--text-4xl)", fontWeight: 800, color: "#000000", marginBottom: "var(--space-6)" }}>
                $0 <span style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-text-tertiary)" }}>/ forever</span>
              </div>
              <ul style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", listStyle: "none", padding: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>✓ Create a professional profile</li>
                <li style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>✓ Upload custom resumes/CVs</li>
                <li style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>✓ Unlimited job applications</li>
                <li style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>✓ Application status tracking</li>
              </ul>
            </div>
            <Link href="/register" className="btn btn-secondary w-full" style={{ marginTop: "var(--space-8)" }}>
              Sign Up as Candidate
            </Link>
          </div>

          {/* Recruiter Starter Plan */}
          <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", borderColor: "var(--color-border-accent)", boxShadow: "var(--shadow-md)" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-2)" }}>
                <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 700, color: "#000000" }}>Recruiter Starter</h3>
                <span className="badge badge-primary">Popular</span>
              </div>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", marginBottom: "var(--space-6)" }}>Perfect for growing teams and startups.</p>
              <div style={{ fontSize: "var(--text-4xl)", fontWeight: 800, color: "#000000", marginBottom: "var(--space-6)" }}>
                $49 <span style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-text-tertiary)" }}>/ month</span>
              </div>
              <ul style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", listStyle: "none", padding: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>✓ Post up to 10 active jobs</li>
                <li style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>✓ Standard AI resume screening</li>
                <li style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>✓ Basic applicant scoring</li>
                <li style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>✓ Email & community support</li>
              </ul>
            </div>
            <Link href="/register" className="btn btn-primary w-full" style={{ marginTop: "var(--space-8)" }}>
              Get Started
            </Link>
          </div>

          {/* Recruiter Pro Plan */}
          <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 700, color: "#000000", marginBottom: "var(--space-2)" }}>Recruiter Pro</h3>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", marginBottom: "var(--space-6)" }}>For scaling companies with high hiring needs.</p>
              <div style={{ fontSize: "var(--text-4xl)", fontWeight: 800, color: "#000000", marginBottom: "var(--space-6)" }}>
                $149 <span style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-text-tertiary)" }}>/ month</span>
              </div>
              <ul style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", listStyle: "none", padding: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>✓ Unlimited active jobs</li>
                <li style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>✓ Advanced AI resume screening</li>
                <li style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>✓ Detailed AI-driven fit analysis</li>
                <li style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>✓ Priority 24/7 dedicated support</li>
              </ul>
            </div>
            <Link href="/register" className="btn btn-secondary w-full" style={{ marginTop: "var(--space-8)" }}>
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" style={{ padding: "var(--space-24) var(--space-8)", maxWidth: "800px", margin: "0 auto" }}>
        <div className="text-center" style={{ marginBottom: "var(--space-16)" }}>
          <div className="section-badge">
            FAQ
          </div>
          <h2 className="section-title">
            Frequently Asked Questions
          </h2>
          <p className="section-description" style={{ margin: "0 auto" }}>
            Got questions? We've got answers. If you need further help, feel free to contact our support team.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          {[
            {
              q: "How does the AI resume screening match candidate skills?",
              a: "Our AI model analyzes the text structure and semantics of uploaded resumes (PDF/Word), matches them against the specified 'Required Skills' and job description, and evaluates the candidate's experience level to score candidate profiles objectively."
            },
            {
              q: "Is it completely free for candidates to apply?",
              a: "Yes! Candidates can sign up, create profiles, upload their CVs, search, and apply for open positions absolutely free of charge."
            },
            {
              q: "Can I customize the screening parameters for different jobs?",
              a: "Absolutely. When creating a job, recruiters can specify required skills, experience level, employment types, and salary brackets. The AI matches applications specifically against those variables."
            },
            {
              q: "How secure is the candidate resume and personal data?",
              a: "We prioritize security. All personal data is encrypted, and resume files are stored in a secure environment. We do not sell candidate data to third parties, and access is restricted using strict role-based authorization."
            },
            {
              q: "How can I upgrade or downgrade my Recruiter subscription plan?",
              a: "You can manage your subscription settings directly from your recruiter dashboard settings panel. Upgrades are applied instantly, and downgrades take effect at the end of the current billing cycle."
            }
          ].map((item, i) => (
            <details
              key={i}
              className="card"
              style={{
                padding: "var(--space-5)",
                cursor: "pointer",
                borderRadius: "var(--radius-lg)",
                boxShadow: "none",
              }}
            >
              <summary
                style={{
                  fontWeight: 600,
                  fontSize: "var(--text-base)",
                  color: "#000000",
                  outline: "none",
                  listStyle: "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{item.q}</span>
                <span className="faq-chevron" style={{ transition: "transform var(--transition-fast)" }}>↓</span>
              </summary>
              <p
                style={{
                  marginTop: "var(--space-3)",
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-secondary)",
                  lineHeight: "var(--leading-relaxed)",
                  cursor: "default",
                }}
              >
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="cta-section">
        <div className="cta-card">
          <h2 className="section-title">
            Ready to transform your hiring process?
          </h2>
          <p
            className="section-description"
            style={{ margin: "var(--space-4) auto 0", maxWidth: "500px" }}
          >
            Join thousands of companies and candidates already using HireAI to
            make smarter hiring decisions.
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "var(--space-4)",
              marginTop: "var(--space-8)",
            }}
          >
            <Link href="/register" className="btn btn-primary btn-lg">
              Create Free Account
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "var(--space-3)",
            marginBottom: "var(--space-4)",
          }}
        >
          <div className="navbar-logo-icon" style={{ width: 28, height: 28 }}>
            <Orbit size={16} style={{ animation: "spin 12s linear infinite" }} />
          </div>
          <span style={{ fontWeight: 700 }}>
            Hire<span className="gradient-text">AI</span>
          </span>
        </div>
        <p>© 2026 HireAI. All rights reserved. Built with Next.js and AI.</p>
      </footer>
    </main>
  );
}
