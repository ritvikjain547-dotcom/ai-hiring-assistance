'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, User, ArrowRight, Briefcase, UserCheck, Orbit } from "lucide-react";
import styles from "../login-new/page.module.css";

const backgrounds = [
  "/login-bg-1.png",
  "/login-bg-2.png",
  "/login-bg-3.png",
];

export default function NewRegisterPage() {
  const [currentBg, setCurrentBg] = useState(0);
  const [role, setRole] = useState<"APPLICANT" | "RECRUITER">("APPLICANT");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
      <div className={styles.card} style={{ maxWidth: '460px', padding: '32px' }}>
        <div className={styles.cardBorder} />
        
        {/* Header */}
        <div className={styles.logoContainer}>
          <div className={styles.logoIcon}>
            <Orbit size={18} style={{ animation: "spin 12s linear infinite" }} />
          </div>
          <span className={styles.logoText}>Hire<span style={{ color: "#ea580c" }}>AI</span></span>
        </div>

        <h1 className={styles.title}>
          Create an <span className={styles.titleHighlight}>account</span>
        </h1>
        <p className={styles.subtitle}>Join thousands of professionals on HireAI</p>

        {/* Role Selection Tabs */}
        <div className={styles.tabs} style={{ marginBottom: '16px' }}>
          <button 
            type="button"
            className={`${styles.tab} ${role === "APPLICANT" ? styles.tabActive : ""}`}
            onClick={() => setRole("APPLICANT")}
          >
            <UserCheck size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            Find a Job
          </button>
          <button 
            type="button"
            className={`${styles.tab} ${role === "RECRUITER" ? styles.tabActive : ""}`}
            onClick={() => setRole("RECRUITER")}
          >
            <Briefcase size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            Hire Talent
          </button>
        </div>

        {/* Form */}
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <div className={styles.inputGroup}>
            <div className={styles.labelRow}>
              <label className={styles.label}>Full Name</label>
            </div>
            <div className={styles.inputWrapper}>
              <User className={styles.inputIcon} />
              <input 
                type="text" 
                placeholder="John Doe" 
                className={styles.input}
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.labelRow}>
              <label className={styles.label}>Email Address</label>
            </div>
            <div className={styles.inputWrapper}>
              <Mail className={styles.inputIcon} />
              <input 
                type="email" 
                placeholder="you@company.com" 
                className={styles.input}
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.labelRow}>
              <label className={styles.label}>Password</label>
            </div>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} />
              <input 
                type="password" 
                placeholder="Create a password" 
                className={styles.input}
                required
                minLength={6}
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn}>
            Create Account <ArrowRight size={16} />
          </button>
        </form>

        {/* Divider */}
        <div className={styles.divider}>
          OR CONTINUE WITH
        </div>

        {/* Social Login */}
        <button type="button" className={styles.googleBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </button>

        {/* Footer */}
        <div className={styles.footer} style={{ marginTop: '24px' }}>
          Already have an account? <Link href="/login-new" className={styles.footerLink}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}
