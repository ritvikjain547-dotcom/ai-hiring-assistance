'use client';

import { useState } from "react";
import Link from "next/link";
import { registerUser } from "@/actions/auth";
import { Brain, Mail, Lock, User, ArrowRight, Loader2, Briefcase, UserCheck } from "lucide-react";

export default function RegisterPage() {
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
              <Brain size={20} />
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

        <div className="auth-footer">
          Already have an account? <Link href="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
