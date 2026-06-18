'use client';

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { registerUser } from "@/actions/auth";
import { Mail, Lock, User, ArrowRight, Loader2, Briefcase, UserCheck, Orbit } from "lucide-react";
import { signIn } from "next-auth/react";

function RegisterForm() {
  const searchParams = useSearchParams();
  const defaultEmail = searchParams.get("email") || "";

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"RECRUITER" | "APPLICANT">("APPLICANT");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    formData.set("role", role);
    const result = await registerUser(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="hero-glow" />
      <div className="auth-card">
        <div className="auth-header">
          <Link
            href="/"
            className="navbar-logo"
            style={{ justifyContent: "center", marginBottom: "var(--space-6)" }}
          >
            <div className="navbar-logo-icon">
              <Orbit size={24} />
            </div>
            <span>
              Hire<span className="gradient-text">AI</span>
            </span>
          </Link>
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">
            Join thousands of professionals on HireAI
          </p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: "var(--space-5)" }}>
            {error}
          </div>
        )}

        <form action={handleSubmit} className="auth-form">
          {/* Role Selector */}
          <div className="form-group">
            <label className="form-label">I want to</label>
            <div className="role-selector">
              <div
                className={`role-option ${role === "APPLICANT" ? "selected" : ""}`}
                onClick={() => setRole("APPLICANT")}
              >
                <div
                  className="role-option-icon"
                  style={{
                    background: "rgba(16, 185, 129, 0.12)",
                    color: "#34d399",
                  }}
                >
                  <UserCheck size={20} />
                </div>
                <div className="role-option-title">Find a Job</div>
                <div className="role-option-desc">Apply for positions</div>
              </div>
              <div
                className={`role-option ${role === "RECRUITER" ? "selected" : ""}`}
                onClick={() => setRole("RECRUITER")}
              >
                <div
                  className="role-option-icon"
                  style={{
                    background: "rgba(99, 102, 241, 0.12)",
                    color: "#818cf8",
                  }}
                >
                  <Briefcase size={20} />
                </div>
                <div className="role-option-title">Hire Talent</div>
                <div className="role-option-desc">Post jobs & recruit</div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-name">Full Name</label>
            <div style={{ position: "relative" }}>
              <User
                size={16}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--color-text-muted)",
                }}
              />
              <input
                id="register-name"
                name="name"
                type="text"
                className="form-input"
                placeholder="John Doe"
                required
                style={{ paddingLeft: "38px" }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-email">Email Address</label>
            <div style={{ position: "relative" }}>
              <Mail
                size={16}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--color-text-muted)",
                }}
              />
              <input
                id="register-email"
                name="email"
                type="email"
                className="form-input"
                placeholder="you@company.com"
                required
                defaultValue={defaultEmail}
                style={{ paddingLeft: "38px" }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-password">Password</label>
            <div style={{ position: "relative" }}>
              <Lock
                size={16}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--color-text-muted)",
                }}
              />
              <input
                id="register-password"
                name="password"
                type="password"
                className="form-input"
                placeholder="Min 6 characters"
                required
                minLength={6}
                style={{ paddingLeft: "38px" }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-confirm-password">Confirm Password</label>
            <div style={{ position: "relative" }}>
              <Lock
                size={16}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--color-text-muted)",
                }}
              />
              <input
                id="register-confirm-password"
                name="confirmPassword"
                type="password"
                className="form-input"
                placeholder="Confirm your password"
                required
                minLength={6}
                style={{ paddingLeft: "38px" }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg w-full"
            disabled={loading}
            id="register-submit"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spinner" />
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-separator" style={{ margin: "var(--space-6) 0", display: "flex", alignItems: "center", textAlign: "center", color: "var(--color-text-muted)" }}>
          <div style={{ flex: 1, borderBottom: "1px solid var(--color-border)" }}></div>
          <span style={{ padding: "0 var(--space-3)", fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "1px" }}>Or continue with Google</span>
          <div style={{ flex: 1, borderBottom: "1px solid var(--color-border)" }}></div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", marginBottom: "var(--space-6)" }}>
          <button
            type="button"
            className="btn btn-secondary w-full"
            onClick={() => {
              document.cookie = "google-oauth-role=APPLICANT; path=/; max-age=60";
              signIn("google", { callbackUrl: "/dashboard/applicant" });
            }}
            style={{ display: "flex", justifyContent: "center", gap: "var(--space-2)", height: "46px", background: "white", color: "#3c4043", border: "1px solid #dadce0" }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Sign up as Applicant
          </button>
          
          <button
            type="button"
            className="btn btn-secondary w-full"
            onClick={() => {
              document.cookie = "google-oauth-role=RECRUITER; path=/; max-age=60";
              signIn("google", { callbackUrl: "/dashboard/recruiter" });
            }}
            style={{ display: "flex", justifyContent: "center", gap: "var(--space-2)", height: "46px", background: "white", color: "#3c4043", border: "1px solid #dadce0" }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Sign up as Recruiter
          </button>
        </div>

        <div className="auth-footer">
          Already have an account? <Link href="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="auth-page">
        <div className="auth-card" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
          <Loader2 className="spinner" size={24} />
        </div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
