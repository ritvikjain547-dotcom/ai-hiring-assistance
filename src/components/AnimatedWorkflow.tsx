'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import styles from './AnimatedWorkflow.module.css';

export function AnimatedWorkflow() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [particles, setParticles] = useState<{ left: string, delay: string, duration: string }[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }).map(() => ({
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 8}s`,
        duration: `${6 + Math.random() * 6}s`,
      }))
    );
  }, []);

  const runCycle = useCallback(() => {
    // Each cycle: reveal steps one by one, hold, then reset
    const STEP_DELAY = 1000;
    const HOLD_TIME = 3000;
    const CYCLE_TOTAL = STEP_DELAY * 5 + HOLD_TIME;

    setActiveStep(-1);
    setTimeout(() => setActiveStep(0), STEP_DELAY);
    setTimeout(() => setActiveStep(1), STEP_DELAY * 2);
    setTimeout(() => setActiveStep(2), STEP_DELAY * 3);
    setTimeout(() => setActiveStep(3), STEP_DELAY * 4);
    setTimeout(() => setActiveStep(4), STEP_DELAY * 5);

    return CYCLE_TOTAL;
  }, []);

  // Start looping once visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    // Run the first cycle immediately
    const cycleTime = runCycle();

    // Then loop it forever
    const interval = setInterval(() => {
      runCycle();
    }, cycleTime);

    return () => clearInterval(interval);
  }, [isVisible, runCycle]);

  const steps = [
    {
      num: "01",
      title: "Upload Resume",
      desc: "Candidates upload their resumes. Our AI parses skills, experience & qualifications instantly.",
      gradient: "linear-gradient(135deg, #fc7933, #f97316)",
      iconPath: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
    },
    {
      num: "02",
      title: "AI Analysis",
      desc: "Smart algorithms score every candidate against job requirements for the perfect match.",
      gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
      iconPath: "M12 2a4 4 0 0 0-4 4c0 2.8 2 6 4 8 2-2 4-5.2 4-8a4 4 0 0 0-4-4z M12 18v4 M8 22h8 M9 12c-3 1-5 4-5 7h4 M15 12c3 1 5 4 5 7h-4",
    },
    {
      num: "03",
      title: "Shortlist & Review",
      desc: "Hiring managers get a curated shortlist with AI insights and detailed match scores.",
      gradient: "linear-gradient(135deg, #06b6d4, #0891b2)",
      iconPath: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M13 7A4 4 0 1 1 5 7 4 4 0 0 1 13 7Z M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
    },
    {
      num: "04",
      title: "Hire Top Talent",
      desc: "Connect with the best, schedule interviews, and seamlessly hire top talent.",
      gradient: "linear-gradient(135deg, #22c55e, #16a34a)",
      iconPath: "M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3",
    },
    {
      num: "05",
      title: "Offer & Onboarding",
      desc: "AI generates tailored offer letters and streamlines onboarding for a smooth day-one experience.",
      gradient: "linear-gradient(135deg, #e11d48, #f43f5e)",
      iconPath: "M4 4h16v16H4z M8 2v4 M16 2v4 M4 10h16 M9 14l2 2 4-4",
    },
  ];

  const lineProgress = activeStep < 0 ? 0 : Math.min(((activeStep + 1) / 5) * 100, 100);

  return (
    <section ref={sectionRef} className={styles.section}>
      {/* Background floating particles */}
      <div className={styles.particles}>
        {particles.map((p, i) => (
          <span key={i} className={styles.particle} style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }} />
        ))}
      </div>

      <div className={styles.inner}>
        <div className={`${styles.header} ${isVisible ? styles.headerVisible : ''}`}>
          <span className={styles.tag}>HOW IT WORKS</span>
          <h2 className={styles.heading}>
            <span className={styles.headingLight}>Our Intelligent </span>
            <span className={styles.headingBold}>Recruitment Process</span>
          </h2>
          <p className={styles.subheading}>
            From resume upload to perfect hire — our AI handles the heavy lifting in four seamless steps.
          </p>
        </div>

        <div className={styles.track}>
          {/* Animated connecting line */}
          <div className={styles.connectorLine}>
            <div
              className={styles.connectorFill}
              style={{ width: `${lineProgress}%` }}
            />
          </div>

          {steps.map((step, i) => (
            <div
              key={i}
              className={`${styles.step} ${activeStep >= i ? styles.stepActive : ''}`}
            >
              {/* Glowing icon circle */}
              <div className={styles.iconArea}>
                <div className={styles.iconGlow} style={{ background: step.gradient }} />
                <div className={styles.iconRing} style={{ borderColor: activeStep >= i ? 'transparent' : undefined }}>
                  <div className={styles.iconRingFill} style={{ background: activeStep >= i ? step.gradient : undefined }} />
                  <svg
                    className={styles.icon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={step.iconPath} />
                  </svg>
                </div>
                {/* Pulse rings */}
                {activeStep >= i && (() => {
                  const pulseColor = step.gradient.includes('#fc') ? '#fc7933' : step.gradient.includes('#8b') ? '#8b5cf6' : step.gradient.includes('#06') ? '#06b6d4' : step.gradient.includes('#22') ? '#22c55e' : '#e11d48';
                  return (
                    <>
                      <div className={styles.pulse} style={{ borderColor: pulseColor }} />
                      <div className={styles.pulse2} style={{ borderColor: pulseColor }} />
                    </>
                  );
                })()}
              </div>

              {/* Step number */}
              <span className={styles.stepNum} style={{ color: activeStep >= i ? '#fff' : undefined }}>{step.num}</span>

              {/* Content */}
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>


            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
