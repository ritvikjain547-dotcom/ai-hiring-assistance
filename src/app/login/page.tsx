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
import { Brain, Mail, Lock, Key, ArrowRight, Loader2, RefreshCw, ArrowLeft } from "lucide-react";

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
              <Brain size={20} />
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

        <div className="auth-footer">
          Don&apos;t have an account?{" "}
          <Link href="/register">Create one free</Link>
        </div>
      </div>
    </div>
  );
}
