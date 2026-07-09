'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Loader2, Key, Orbit } from "lucide-react";
import { signIn } from "next-auth/react";
import { 
  loginUser, 
  sendLoginOTP, 
  loginWithOTP
} from "@/actions/auth";
import styles from "./page.module.css";

const backgrounds = [
  "/login-bg-1.png",
  "/login-bg-2.png",
  "/login-bg-3.png",
];

export default function NewLoginPage() {
  const [tab, setTab] = useState<"password" | "otp">("password");
  const [currentBg, setCurrentBg] = useState(0);

  // Auth States
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  async function handleSubmitPassword(formData: FormData) {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    const result = await loginUser(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  async function handleSendOTP() {
    if (!email) {
      setError("Please enter your email address first");
      return;
    }

    setSendingOtp(true);
    setError("");
    setSuccessMessage("");

    const result = await sendLoginOTP(email);
    setSendingOtp(false);

    if (result?.error) {
      setError(result.error);
    } else {
      setOtpSent(true);
      setSuccessMessage("Verification code sent to your email!");
    }
  }

  async function handleSubmitOTP(formData: FormData) {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    const result = await loginWithOTP(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      {/* Background Slideshow */}
      <div className={styles.slideshow}>
        {backgrounds.map((bg, index) => (
          <Image 
            key={bg}
            src={bg} 
            alt="Background" 
            fill 
            className={`${styles.slide} ${index === currentBg ? styles.slideActive : ""}`} 
          />
        ))}
        <div className={styles.overlay} />
      </div>

      {/* Main Card */}
      <div className={styles.card}>
        <div className={styles.cardBorder} />
        
        {/* Header */}
        <div className={styles.logoContainer}>
          <div className={styles.logoIcon}>
            <Orbit size={18} style={{ animation: "spin 12s linear infinite" }} />
          </div>
          <span className={styles.logoText}>Hire<span style={{ color: "#ea580c" }}>AI</span></span>
        </div>

        <h1 className={styles.title}>
          Welcome <span className={styles.titleHighlight}>back</span>
        </h1>
        <p className={styles.subtitle}>Sign in to your account to continue</p>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button 
            type="button"
            className={`${styles.tab} ${tab === "password" ? styles.tabActive : ""}`}
            onClick={() => { setTab("password"); setError(""); setSuccessMessage(""); }}
          >
            Password
          </button>
          <button 
            type="button"
            className={`${styles.tab} ${tab === "otp" ? styles.tabActive : ""}`}
            onClick={() => { setTab("otp"); setError(""); setSuccessMessage(""); }}
          >
            OTP Code
          </button>
        </div>

        {error && (
          <div style={{ padding: "10px", background: "#fee2e2", color: "#b91c1c", borderRadius: "8px", fontSize: "13px", marginBottom: "16px", width: "100%", textAlign: "center" }}>
            {error}
          </div>
        )}

        {successMessage && (
          <div style={{ padding: "10px", background: "#fff7ed", color: "#9a3412", borderRadius: "8px", fontSize: "13px", marginBottom: "16px", width: "100%", textAlign: "center" }}>
            {successMessage}
          </div>
        )}

        {/* Form */}
        <form className={styles.form} action={tab === "password" ? handleSubmitPassword : handleSubmitOTP}>
          <div className={styles.inputGroup}>
            <div className={styles.labelRow}>
              <label className={styles.label}>Email Address</label>
            </div>
            <div className={styles.inputWrapper}>
              <Mail className={styles.inputIcon} />
              <input 
                type="email" 
                name="email"
                placeholder="you@company.com" 
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {tab === "password" && (
            <div className={styles.inputGroup}>
              <div className={styles.labelRow}>
                <label className={styles.label}>Password</label>
                <Link href="#" className={styles.forgotLink}>Forgot Password?</Link>
              </div>
              <div className={styles.inputWrapper}>
                <Lock className={styles.inputIcon} />
                <input 
                  type="password" 
                  name="password"
                  placeholder="Enter your password" 
                  className={styles.input}
                  required
                />
              </div>
            </div>
          )}

          {tab === "otp" && otpSent && (
            <div className={styles.inputGroup}>
              <div className={styles.labelRow}>
                <label className={styles.label}>Verification Code</label>
              </div>
              <div className={styles.inputWrapper}>
                <Key className={styles.inputIcon} />
                <input 
                  type="text" 
                  name="otp"
                  placeholder="Enter 6-digit code" 
                  className={styles.input}
                  required
                />
              </div>
            </div>
          )}

          {tab === "password" || (tab === "otp" && otpSent) ? (
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={16} style={{ animation: "spin 1s linear infinite" }} /> : "Sign In"} 
              {!loading && <ArrowRight size={16} />}
            </button>
          ) : (
            <button 
              type="button" 
              className={styles.submitBtn} 
              onClick={handleSendOTP}
              disabled={sendingOtp || !email}
            >
              {sendingOtp ? <Loader2 className="animate-spin" size={16} style={{ animation: "spin 1s linear infinite" }} /> : "Send Verification Code"}
            </button>
          )}
        </form>

        {/* Divider */}
        <div className={styles.divider}>
          OR CONTINUE WITH
        </div>

        {/* Social Login */}
        <button 
          type="button" 
          className={styles.googleBtn}
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </button>

        {/* Footer */}
        <div className={styles.footer}>
          Don't have an account? <Link href="/register-new" className={styles.footerLink}>Create one free</Link>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}

