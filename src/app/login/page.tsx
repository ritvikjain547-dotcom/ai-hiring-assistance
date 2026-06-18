'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  loginUser, 
  sendLoginOTP, 
  loginWithOTP,
  sendResetPasswordOTP,
  resetPasswordWithOTP
} from "@/actions/auth";
import { Orbit, Mail, Lock, Key, ArrowRight, Loader2, RefreshCw, ArrowLeft } from "lucide-react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [loginMode, setLoginMode] = useState<"password" | "otp" | "forgot-password">("password");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Sign Up Quick Redirection State
  const [showSignUp, setShowSignUp] = useState(false);
  const [notFoundEmail, setNotFoundEmail] = useState("");

  // OTP & Verification State
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for resending OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  async function handleSendOTP() {
    if (!email) {
      setError("Please enter your email address first");
      return;
    }

    setSendingOtp(true);
    setError("");
    setSuccessMessage("");
    setShowSignUp(false);

    const result = await sendLoginOTP(email);
    setSendingOtp(false);

    if (result?.error) {
      setError(result.error);
      if (result.showSignUp) {
        setShowSignUp(true);
        setNotFoundEmail(result.email || email);
      }
    } else {
      setOtpSent(true);
      setSuccessMessage("Verification code sent to your email!");
      setCountdown(60); // 60 seconds countdown
    }
  }

  async function handleSendResetOTP() {
    if (!email) {
      setError("Please enter your email address first");
      return;
    }

    setSendingOtp(true);
    setError("");
    setSuccessMessage("");
    setShowSignUp(false);

    const result = await sendResetPasswordOTP(email);
    setSendingOtp(false);

    if (result?.error) {
      setError(result.error);
      if (result.showSignUp) {
        setShowSignUp(true);
        setNotFoundEmail(result.email || email);
      }
    } else {
      setOtpSent(true);
      setSuccessMessage("Verification code sent to your email!");
      setCountdown(60);
    }
  }

  async function handleSubmitPassword(formData: FormData) {
    setLoading(true);
    setError("");
    setSuccessMessage("");
    setShowSignUp(false);

    const result = await loginUser(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
      if (result.showSignUp) {
        setShowSignUp(true);
        setNotFoundEmail(result.email || (formData.get("email") as string));
      }
    }
  }

  async function handleSubmitOTP(formData: FormData) {
    setLoading(true);
    setError("");
    setSuccessMessage("");
    setShowSignUp(false);

    const result = await loginWithOTP(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  async function handleSubmitResetOTP(formData: FormData) {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const result = await resetPasswordWithOTP(formData);
    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else {
      setSuccessMessage("Password reset successfully! You can now log in.");
      setLoginMode("password");
      setOtpSent(false);
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
          <h1 className="auth-title">
            {loginMode === "forgot-password" ? "Reset password" : "Welcome back"}
          </h1>
          <p className="auth-subtitle">
            {loginMode === "forgot-password" 
              ? "Verify your account to set a new password" 
              : "Sign in to your account to continue"
            }
          </p>
        </div>

        {/* Login Mode Selector Tabs (only shown during standard login) */}
        {loginMode !== "forgot-password" && (
          <div 
            className="tab-group" 
            style={{ 
              display: "flex", 
              gap: "var(--space-2)", 
              marginBottom: "var(--space-6)",
              background: "var(--color-bg-secondary)",
              padding: "4px",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--color-border)"
            }}
          >
            <button
              type="button"
              className="btn w-full"
              style={{
                background: loginMode === "password" ? "var(--color-accent-primary)" : "transparent",
                color: loginMode === "password" ? "white" : "var(--color-text-secondary)",
                border: "none",
                borderRadius: "var(--radius-lg)"
              }}
              onClick={() => {
                setLoginMode("password");
                setError("");
                setSuccessMessage("");
                setShowSignUp(false);
              }}
            >
              Password
            </button>
            <button
              type="button"
              className="btn w-full"
              style={{
                background: loginMode === "otp" ? "var(--color-accent-primary)" : "transparent",
                color: loginMode === "otp" ? "white" : "var(--color-text-secondary)",
                border: "none",
                borderRadius: "var(--radius-lg)"
              }}
              onClick={() => {
                setLoginMode("otp");
                setError("");
                setSuccessMessage("");
                setShowSignUp(false);
              }}
            >
              OTP Code
            </button>
          </div>
        )}

        {error && (
          <div className="alert alert-error" style={{ marginBottom: "var(--space-5)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <span>{error}</span>
            {showSignUp && (
              <Link
                href={`/register?email=${encodeURIComponent(notFoundEmail)}`}
                className="btn btn-secondary btn-sm w-full"
                style={{ 
                  justifyContent: "center",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderColor: "rgba(255, 255, 255, 0.2)",
                  color: "white"
                }}
              >
                Create Account Now
              </Link>
            )}
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success" style={{ marginBottom: "var(--space-5)" }}>
            {successMessage}
          </div>
        )}

        {loginMode === "password" && (
          /* Password Login Form */
          <form action={handleSubmitPassword} className="auth-form">
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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label className="form-label" htmlFor="login-password">Password</label>
                <button
                  type="button"
                  className="btn-ghost"
                  style={{ fontSize: "var(--text-xs)", padding: 0, background: "none" }}
                  onClick={() => {
                    setLoginMode("forgot-password");
                    setError("");
                    setSuccessMessage("");
                    setOtpSent(false);
                    setShowSignUp(false);
                  }}
                >
                  Forgot Password?
                </button>
              </div>
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
        )}

        {loginMode === "otp" && (
          /* OTP Login Form */
          <form action={handleSubmitOTP} className="auth-form">
            <input type="hidden" name="email" value={email} />
            <div className="form-group">
              <label className="form-label" htmlFor="otp-email">Email Address</label>
              <div style={{ display: "flex", gap: "var(--space-2)" }}>
                <div style={{ position: "relative", flex: 1 }}>
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
                    id="otp-email"
                    type="email"
                    className="form-input"
                    placeholder="you@company.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={otpSent}
                    style={{ paddingLeft: "38px" }}
                  />
                </div>
                {!otpSent && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleSendOTP}
                    disabled={sendingOtp || !email}
                    style={{ padding: "0 var(--space-4)", height: "42px" }}
                  >
                    {sendingOtp ? (
                      <Loader2 size={16} className="spinner" />
                    ) : (
                      "Send OTP"
                    )}
                  </button>
                )}
              </div>
            </div>

            {otpSent && (
              <>
                <div className="form-group animate-slide-up">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label className="form-label" htmlFor="otp-code">One-Time Password (OTP)</label>
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={handleSendOTP}
                      disabled={countdown > 0 || sendingOtp}
                      style={{ 
                        fontSize: "var(--text-xs)", 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "4px",
                        padding: 0,
                        background: "none",
                        cursor: (countdown > 0 || sendingOtp) ? "not-allowed" : "pointer"
                      }}
                    >
                      <RefreshCw size={12} className={sendingOtp ? "spinner" : ""} />
                      {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                    </button>
                  </div>
                  <div style={{ position: "relative" }}>
                    <Key
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
                      id="otp-code"
                      name="otp"
                      type="text"
                      className="form-input"
                      placeholder="Enter 6-digit code"
                      required
                      maxLength={6}
                      pattern="[0-9]{6}"
                      style={{ paddingLeft: "38px", letterSpacing: "2px", fontWeight: "600" }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-full"
                  disabled={loading}
                  id="otp-login-submit"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="spinner" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify & Sign In
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </>
            )}
          </form>
        )}

        {loginMode === "forgot-password" && (
          /* Forgot Password Form */
          <form action={handleSubmitResetOTP} className="auth-form">
            <input type="hidden" name="email" value={email} />
            <div className="form-group">
              <label className="form-label" htmlFor="forgot-email">Email Address</label>
              <div style={{ display: "flex", gap: "var(--space-2)" }}>
                <div style={{ position: "relative", flex: 1 }}>
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
                    id="forgot-email"
                    type="email"
                    className="form-input"
                    placeholder="you@company.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={otpSent}
                    style={{ paddingLeft: "38px" }}
                  />
                </div>
                {!otpSent && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleSendResetOTP}
                    disabled={sendingOtp || !email}
                    style={{ padding: "0 var(--space-4)", height: "42px" }}
                  >
                    {sendingOtp ? (
                      <Loader2 size={16} className="spinner" />
                    ) : (
                      "Send Code"
                    )}
                  </button>
                )}
              </div>
            </div>

            {otpSent && (
              <>
                <div className="form-group animate-slide-up">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label className="form-label" htmlFor="reset-code">Verification Code (OTP)</label>
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={handleSendResetOTP}
                      disabled={countdown > 0 || sendingOtp}
                      style={{ 
                        fontSize: "var(--text-xs)", 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "4px",
                        padding: 0,
                        background: "none",
                        cursor: (countdown > 0 || sendingOtp) ? "not-allowed" : "pointer"
                      }}
                    >
                      <RefreshCw size={12} className={sendingOtp ? "spinner" : ""} />
                      {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
                    </button>
                  </div>
                  <div style={{ position: "relative" }}>
                    <Key
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
                      id="reset-code"
                      name="otp"
                      type="text"
                      className="form-input"
                      placeholder="Enter 6-digit code"
                      required
                      maxLength={6}
                      pattern="[0-9]{6}"
                      style={{ paddingLeft: "38px", letterSpacing: "2px", fontWeight: "600" }}
                    />
                  </div>
                </div>

                <div className="form-group animate-slide-up">
                  <label className="form-label" htmlFor="reset-password">New Password</label>
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
                      id="reset-password"
                      name="newPassword"
                      type="password"
                      className="form-input"
                      placeholder="Min 6 characters"
                      required
                      minLength={6}
                      style={{ paddingLeft: "38px" }}
                    />
                  </div>
                </div>

                <div className="form-group animate-slide-up">
                  <label className="form-label" htmlFor="reset-confirm-password">Confirm New Password</label>
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
                      id="reset-confirm-password"
                      name="confirmPassword"
                      type="password"
                      className="form-input"
                      placeholder="Confirm new password"
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
                  id="reset-password-submit"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="spinner" />
                      Resetting...
                    </>
                  ) : (
                    <>
                      Reset Password
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </>
            )}

            <button
              type="button"
              className="btn btn-secondary w-full"
              style={{ marginTop: "var(--space-2)" }}
              onClick={() => {
                setLoginMode("password");
                setError("");
                setSuccessMessage("");
                setOtpSent(false);
                setShowSignUp(false);
              }}
            >
              <ArrowLeft size={16} />
              Back to Sign In
            </button>
          </form>
        )}

        <div className="auth-separator" style={{ margin: "var(--space-6) 0", display: "flex", alignItems: "center", textAlign: "center", color: "var(--color-text-muted)" }}>
          <div style={{ flex: 1, borderBottom: "1px solid var(--color-border)" }}></div>
          <span style={{ padding: "0 var(--space-3)", fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "1px" }}>Or continue with</span>
          <div style={{ flex: 1, borderBottom: "1px solid var(--color-border)" }}></div>
        </div>

        <button
          type="button"
          className="btn btn-secondary w-full"
          onClick={() => signIn("google", { callbackUrl: "/dashboard/applicant" })}
          style={{ display: "flex", justifyContent: "center", gap: "var(--space-2)", height: "46px", marginBottom: "var(--space-6)", background: "white", color: "#3c4043", border: "1px solid #dadce0" }}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          Google
        </button>

        <div className="auth-footer">
          Don&apos;t have an account?{" "}
          <Link href="/register">Create one free</Link>
        </div>
      </div>
    </div>
  );
}
