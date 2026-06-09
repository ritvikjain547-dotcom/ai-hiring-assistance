'use client';

import { useState } from "react";
import Link from "next/link";
import { loginUser } from "@/actions/auth";
import { Brain, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    const result = await loginUser(formData);
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
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">
            Sign in to your account to continue
          </p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: "var(--space-5)" }}>
            {error}
          </div>
        )}

        <form action={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
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
                id="login-email"
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
            <label className="form-label" htmlFor="login-password">Password</label>
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
                id="login-password"
                name="password"
                type="password"
                className="form-input"
                placeholder="Enter your password"
                required
                style={{ paddingLeft: "38px" }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg w-full"
            disabled={loading}
            id="login-submit"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spinner" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Don&apos;t have an account?{" "}
          <Link href="/register">Create one free</Link>
        </div>
      </div>
    </div>
  );
}
