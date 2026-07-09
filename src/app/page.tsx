import Link from "next/link";
import Image from "next/image";
import { Orbit } from "lucide-react";
import styles from "./page.module.css";
import { LatestJobsCarousel } from "@/components/LatestJobsCarousel";
import { FAQAccordion } from "@/components/FAQAccordion";
import { AnimatedWorkflow } from "@/components/AnimatedWorkflow";

export default function HomePage() {
  return (
    <main className={styles.landing}>
      {/* ==================== NAVBAR ==================== */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.navLogo}>
            <div className={styles.navLogoIcon}>
              <Orbit size={20} style={{ animation: "spin 12s linear infinite" }} />
            </div>
            <span>Hire<span style={{ color: "#ea580c" }}>AI</span></span>
          </Link>

          <ul className={styles.navLinks}>
            <li>
              <a href="#benefits" className={styles.navLink}>
                About Us
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
              </a>
            </li>
            <li>
              <a href="#talent" className={styles.navLink}>
                Employers
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
              </a>
            </li>
            <li>
              <a href="#jobs" className={styles.navLink}>
                Job Seekers
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
              </a>
            </li>
            <li>
              <a href="#cta" className={styles.navLink}>Blogs</a>
            </li>
            <li>
              <a href="#footer" className={styles.navLink}>Contact</a>
            </li>
          </ul>

          <div className={styles.navActions}>
            <Link href="/login-new" className={styles.navBtnLogin}>
              Login
            </Link>
            <Link href="/register-new" className={styles.navBtnRegister}>
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* ==================== HERO SECTION — SLIDESHOW ==================== */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          {/* Slide 1 */}
          <div className={`${styles.heroSlide} ${styles.heroSlide1}`}>
            <Image
              src="/hero-bg.png"
              alt="Professional adjusting tie"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
          {/* Slide 2 */}
          <div className={`${styles.heroSlide} ${styles.heroSlide2}`}>
            <Image
              src="/hero-slide-2.png"
              alt="Professional woman in office"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          {/* Slide 3 */}
          <div className={`${styles.heroSlide} ${styles.heroSlide3}`}>
            <Image
              src="/hero-slide-3.png"
              alt="Team collaborating in meeting"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          {/* Slide 4 */}
          <div className={`${styles.heroSlide} ${styles.heroSlide4}`}>
            <Image
              src="/hero-slide-4.png"
              alt="Professional in corporate lobby"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className={styles.heroBgOverlay} />
        </div>

        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            The Future<br />of Hiring
          </h1>
          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <Link href="/register" className={styles.heroCta}>
              Search Jobs
            </Link>
            <Link href="/register?role=recruiter" className={styles.heroCtaOutline}>
              Start Hiring
            </Link>
          </div>
        </div>

        <div className={styles.heroSubtitle}>
          <div className={styles.heroSubTag}>HEADING</div>
          <p className={styles.heroSubText}>
            AI-powered recruitment platform connecting top talent with leading companies for mutual success.
          </p>
        </div>

        {/* Slide indicator dots */}
        <div className={styles.heroIndicators}>
          <div className={styles.heroIndicatorDot} />
          <div className={styles.heroIndicatorDot} />
          <div className={styles.heroIndicatorDot} />
          <div className={styles.heroIndicatorDot} />
        </div>
      </section>

      {/* ==================== COMPANY MARQUEE ==================== */}
      <section className={styles.marqueeSection}>
        <p className={styles.marqueeLabel}>
          Trusted by hiring teams at world-class companies
        </p>
        <div className={styles.marqueeTrack}>
          {/* Duplicate the list for seamless infinite loop */}
          {[...Array(2)].map((_, setIdx) => (
            [
              "Google", "Microsoft", "Amazon", "Apple", "Meta",
              "Netflix", "Flipkart", "Spotify", "Uber", "Airbnb",
              "Adobe", "Salesforce", "Oracle", "IBM", "Intel",
            ].map((company, i) => (
              <span key={`${setIdx}-${i}`}>
                <span className={styles.marqueeItem}>{company}</span>
                <span className={styles.marqueeDot} />
              </span>
            ))
          ))}
        </div>
      </section>

      {/* ==================== DIVIDER ==================== */}
      <div className={styles.divider}>
        <div className={styles.dividerInner}>
          {Array.from({ length: 80 }).map((_, i) => (
            <div key={i} className={styles.dividerLine} />
          ))}
        </div>
      </div>

      {/* ==================== KEY BENEFITS ==================== */}
      <section id="benefits" className={styles.benefits}>
        <h2 className={styles.benefitsTitle}>
          <span className={styles.benefitsTitleBold}>Explore </span>
          <span className={styles.benefitsTitleLight}>Our Key Benefits</span>
        </h2>

        <div className={styles.benefitsGrid}>
          {[
            {
              img: "/benefit-1.png",
              name: "AI Resume Screening",
              desc: "Our intelligent algorithms analyze and match resumes against job requirements with precision.",
            },
            {
              img: "/benefit-2.png",
              name: "Smart Matching",
              desc: "Get matched with candidates who truly fit your requirements based on skills and experience.",
            },
            {
              img: "/benefit-3.png",
              name: "Streamlined Process",
              desc: "From posting to hiring, manage your entire recruitment pipeline in one unified platform.",
            },
            {
              img: "/benefit-4.png",
              name: "Real-time Analytics",
              desc: "Track hiring metrics, conversion rates, and candidate pipeline with live dashboards.",
            },
          ].map((benefit, i) => (
            <div key={i} className={styles.benefitCard}>
              <div className={styles.benefitImageWrap}>
                <Image
                  src={benefit.img}
                  alt={benefit.name}
                  width={400}
                  height={533}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </div>
              <h3 className={styles.benefitName}>{benefit.name}</h3>
              <p className={styles.benefitDesc}>{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== DIVIDER ==================== */}
      <div className={styles.divider}>
        <div className={styles.dividerInner}>
          {Array.from({ length: 80 }).map((_, i) => (
            <div key={i} className={styles.dividerLine} />
          ))}
        </div>
      </div>

      {/* ==================== EMPOWER SECTION ==================== */}
      <section className={styles.empower}>
        <div className={styles.empowerGrid}>
          <div className={styles.empowerImageWrap}>
            <Image
              src="/empower-section.png"
              alt="Professional at desk"
              width={700}
              height={525}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          </div>

          <div className={styles.empowerRight}>
            <span className={styles.empowerTag}>[01]</span>
            <h2 className={styles.empowerTitle}>
              Empowering Professionals with{" "}
              <span className={styles.empowerTitleBold}>
                Tailored Recruitment Solutions for Career Growth
              </span>
            </h2>

            <div className={styles.empowerCard}>
              <h3 className={styles.empowerCardTitle}>How It Works</h3>
              <span className={styles.empowerCardSubtitle}>Simple & Effective</span>
              <div className={styles.empowerCardImg}>
                <Image
                  src="/benefit-3.png"
                  alt="Workspace overview"
                  width={500}
                  height={281}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </div>
              <Link href="/register" className={styles.empowerCardBtn}>
                Learn More
              </Link>
            </div>
          </div>
        </div>

        <p className={styles.empowerText}>
          Our AI-powered platform analyzes skills, experience, and cultural fit to connect the right
          candidates with the right opportunities — reducing time-to-hire by up to 92%.
        </p>
      </section>

      {/* ==================== CONNECTING TALENT (Dark Section) ==================== */}
      <section id="talent" className={styles.talent}>
        <div className={styles.talentBg}>
          <Image
            src="/talent-section.png"
            alt="Professional faces"
            fill
            style={{ objectFit: "cover", filter: "grayscale(100%) contrast(1.2)", opacity: 0.6 }}
          />
        </div>

        <div className={styles.talentContent}>
          <div className={styles.talentLeft}>
            <div className={styles.talentTag}>EST. 2024</div>
            <h2 className={styles.talentTitle}>
              Connecting top talent with leading companies for mutual success
            </h2>
            <p className={styles.talentText}>
              We bridge the gap between exceptional professionals and forward-thinking organizations.
              Our AI-driven approach ensures perfect matches, fostering growth on both sides of the
              hiring equation.
            </p>
            <Link href="/register" className={styles.talentCta}>
              About us
            </Link>
          </div>

          <div className={styles.talentRight}>
            <div className={styles.talentQuote}>
              <div className={styles.talentQuoteMark}>&rdquo;</div>
              <p className={styles.talentQuoteText}>
                &ldquo;HireAI transformed our recruitment process. We reduced our time-to-hire from 45 days to just
                12 days while improving candidate quality significantly.&rdquo;
              </p>
              <div className={styles.talentQuoteAuthor}>Priya Sharma</div>
              <div className={styles.talentQuoteRole}>VP Engineering at TechCorp</div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== DIVIDER ==================== */}
      <div className={styles.divider}>
        <div className={styles.dividerInner}>
          {Array.from({ length: 80 }).map((_, i) => (
            <div key={i} className={styles.dividerLine} />
          ))}
        </div>
      </div>

      {/* ==================== LATEST JOBS ==================== */}
      <LatestJobsCarousel />

      {/* ==================== WORKFLOW SECTION ==================== */}
      <AnimatedWorkflow />

      {/* ==================== DIVIDER ==================== */}
      <div className={styles.divider}>
        <div className={styles.dividerInner}>
          {Array.from({ length: 80 }).map((_, i) => (
            <div key={i} className={styles.dividerLine} />
          ))}
        </div>
      </div>

      {/* ==================== PRICING PLANS ==================== */}
      <section id="pricing" className={styles.pricing}>
        <div className={styles.pricingInner}>
          <div className={styles.pricingHeader}>
            <div className={styles.pricingTag}>Pricing Plans</div>
            <h2 className={styles.pricingTitle}>
              <span className={styles.pricingTitleBold}>Simple, </span>
              <span className={styles.pricingTitleLight}>transparent pricing</span>
            </h2>
            <p className={styles.pricingSubtitle}>
              Choose the perfect plan for your recruitment needs. Free for candidates, always.
            </p>
          </div>

          <div className={styles.pricingGrid}>
            {/* Candidate Plan */}
            <div className={styles.pricingCard}>
              <div>
                <h3 className={styles.pricingCardName}>For Candidates</h3>
                <p className={styles.pricingCardDesc}>Find and apply to your next dream job.</p>
                <div className={styles.pricingAmount}>
                  <span className={styles.pricingCurrency}>$</span>
                  <span className={styles.pricingValue}>0</span>
                  <span className={styles.pricingPeriod}>/ forever</span>
                </div>
                <ul className={styles.pricingFeatures}>
                  <li className={styles.pricingFeature}>
                    <span className={styles.pricingCheck}>✓</span>
                    Create a professional profile
                  </li>
                  <li className={styles.pricingFeature}>
                    <span className={styles.pricingCheck}>✓</span>
                    Upload custom resumes & CVs
                  </li>
                  <li className={styles.pricingFeature}>
                    <span className={styles.pricingCheck}>✓</span>
                    Unlimited job applications
                  </li>
                  <li className={styles.pricingFeature}>
                    <span className={styles.pricingCheck}>✓</span>
                    Application status tracking
                  </li>
                </ul>
              </div>
              <Link href="/register" className={styles.pricingBtn}>
                Sign Up Free
              </Link>
            </div>

            {/* Recruiter Starter Plan */}
            <div className={`${styles.pricingCard} ${styles.pricingCardPopular}`}>
              <div className={styles.pricingBadge}>Popular</div>
              <div>
                <h3 className={styles.pricingCardName}>Recruiter Starter</h3>
                <p className={styles.pricingCardDesc}>Perfect for growing teams and startups.</p>
                <div className={styles.pricingAmount}>
                  <span className={styles.pricingCurrency}>$</span>
                  <span className={styles.pricingValue}>49</span>
                  <span className={styles.pricingPeriod}>/ month</span>
                </div>
                <ul className={styles.pricingFeatures}>
                  <li className={styles.pricingFeature}>
                    <span className={styles.pricingCheck}>✓</span>
                    Post up to 10 active jobs
                  </li>
                  <li className={styles.pricingFeature}>
                    <span className={styles.pricingCheck}>✓</span>
                    Standard AI resume screening
                  </li>
                  <li className={styles.pricingFeature}>
                    <span className={styles.pricingCheck}>✓</span>
                    Basic applicant scoring
                  </li>
                  <li className={styles.pricingFeature}>
                    <span className={styles.pricingCheck}>✓</span>
                    Email & community support
                  </li>
                </ul>
              </div>
              <Link href="/register" className={styles.pricingBtnPrimary}>
                Get Started
              </Link>
            </div>

            {/* Recruiter Pro Plan */}
            <div className={styles.pricingCard}>
              <div>
                <h3 className={styles.pricingCardName}>Recruiter Pro</h3>
                <p className={styles.pricingCardDesc}>For scaling companies with high hiring needs.</p>
                <div className={styles.pricingAmount}>
                  <span className={styles.pricingCurrency}>$</span>
                  <span className={styles.pricingValue}>149</span>
                  <span className={styles.pricingPeriod}>/ month</span>
                </div>
                <ul className={styles.pricingFeatures}>
                  <li className={styles.pricingFeature}>
                    <span className={styles.pricingCheck}>✓</span>
                    Unlimited active jobs
                  </li>
                  <li className={styles.pricingFeature}>
                    <span className={styles.pricingCheck}>✓</span>
                    Advanced AI resume screening
                  </li>
                  <li className={styles.pricingFeature}>
                    <span className={styles.pricingCheck}>✓</span>
                    Detailed AI-driven fit analysis
                  </li>
                  <li className={styles.pricingFeature}>
                    <span className={styles.pricingCheck}>✓</span>
                    Priority 24/7 dedicated support
                  </li>
                </ul>
              </div>
              <Link href="/register" className={styles.pricingBtn}>
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== INSIGHTS SECTION ==================== */}
      <section id="insights" className={styles.insights}>
        <h2 className={styles.insightsTitle}>
          <span className={styles.insightsTitleBold}>Our Latest </span>
          <span className={styles.insightsTitleLight}>Insights</span>
        </h2>
        <div className={styles.insightsGrid}>
          {/* Insight 1 */}
          <div className={styles.insightCard}>
            <div className={styles.insightImageWrap}>
              <Image src="/insight-1.png" alt="Workspace at cafe" fill />
            </div>
            <div className={styles.insightContent}>
              <h3 className={styles.insightTitle}>
                How AI is Reshaping the Modern Recruitment Process
              </h3>
              <p className={styles.insightDesc}>
                Discover how artificial intelligence is drastically reducing time-to-hire by automating resume screening and identifying top-tier candidates faster than ever before.
              </p>
            </div>
          </div>
          {/* Insight 2 */}
          <div className={styles.insightCard}>
            <div className={styles.insightImageWrap}>
              <Image src="/insight-2-new.png" alt="Data analysis concept" fill />
            </div>
            <div className={styles.insightContent}>
              <h3 className={styles.insightTitle}>
                The Importance of Unbiased Screening in Hiring
              </h3>
              <p className={styles.insightDesc}>
                Learn how HireAI’s advanced algorithms evaluate candidates purely on merit and skills, helping eliminate unconscious bias and promoting genuine workplace diversity.
              </p>
            </div>
          </div>
          {/* Insight 3 */}
          <div className={styles.insightCard}>
            <div className={styles.insightImageWrap}>
              <Image src="/insight-3.png" alt="Candidate using laptop" fill />
            </div>
            <div className={styles.insightContent}>
              <h3 className={styles.insightTitle}>
                Mastering Your Resume for AI Applicant Tracking Systems
              </h3>
              <p className={styles.insightDesc}>
                For job seekers, AI isn't just for recruiters. Learn how to format your resume and highlight the right keywords to stand out in an automated screening process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== DIVIDER ==================== */}
      <div className={styles.divider}>
        <div className={styles.dividerInner}>
          {Array.from({ length: 80 }).map((_, i) => (
            <div key={i} className={styles.dividerLine} />
          ))}
        </div>
      </div>

      {/* ==================== SECTORS SECTION ==================== */}
      <section id="sectors" className={styles.sectors}>
        <div className={styles.sectorsHeader}>
          <h2 className={styles.sectorsTitle}>
            <span className={styles.sectorsTitleLight}>Our Key Recruitment</span>
            <span className={styles.sectorsTitleBold}>Sectors</span>
          </h2>
          <span className={styles.sectorsTag}>#HireAI</span>
        </div>
        <div className={styles.sectorsGrid}>
          <div className={`${styles.sectorItem} ${styles.sectorTech}`}>
            <Image src="/sector-tech.png" alt="Tech & IT" fill />
          </div>
          <div className={`${styles.sectorItem} ${styles.sectorScience}`}>
            <Image src="/sector-science.png" alt="Science & Healthcare" fill />
          </div>
          <div className={`${styles.sectorItem} ${styles.sectorConstruction}`}>
            <Image src="/sector-construction.png" alt="Construction & Engineering" fill />
          </div>
          <div className={`${styles.sectorItem} ${styles.sectorCorporate}`}>
            <Image src="/sector-corporate.png" alt="Corporate & Business" fill />
          </div>
          <div className={`${styles.sectorItem} ${styles.sectorLogistics}`}>
            <Image src="/sector-logistics.png" alt="Logistics & Warehousing" fill />
          </div>
          <div className={`${styles.sectorItem} ${styles.sectorCreative}`}>
            <Image src="/sector-creative.png" alt="Creative & Design" fill />
          </div>
        </div>
      </section>

      {/* ==================== DIVIDER ==================== */}
      <div className={styles.divider}>
        <div className={styles.dividerInner}>
          {Array.from({ length: 80 }).map((_, i) => (
            <div key={i} className={styles.dividerLine} />
          ))}
        </div>
      </div>


      {/* ==================== FAQ SECTION ==================== */}
      <FAQAccordion />

      {/* ==================== CTA SECTION ==================== */}
      <section id="cta" className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>
          Ready to transform<br />your hiring?
        </h2>
        <p className={styles.ctaText}>
          Join thousands of companies and candidates already using HireAI to make smarter,
          faster hiring decisions powered by artificial intelligence.
        </p>
        <Link href="/register" className={styles.ctaBtn}>
          Get Started Free
        </Link>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer id="footer" className={styles.footer}>
        <p className={styles.footerText}>
          © 2026 HireAI. All rights reserved. Built with ♥
        </p>
      </footer>
    </main>
  );
}
