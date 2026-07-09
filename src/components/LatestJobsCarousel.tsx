'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '../app/page.module.css';

const allJobs = [
  {
    title: "Software Engineer",
    location: "Bangalore",
    state: "Karnataka",
    type: "Full-Time",
    desc: "Build scalable applications using modern tech stack with AI integration...",
    daysAgo: 2,
  },
  {
    title: "Product Manager",
    location: "Mumbai",
    state: "Maharashtra",
    type: "Full-Time",
    desc: "Lead cross-functional teams to deliver impactful products for millions...",
    daysAgo: 5,
  },
  {
    title: "UI/UX Designer",
    location: "Remote",
    state: "India",
    type: "Contract",
    desc: "Create stunning, intuitive interfaces that delight users and drive engagement...",
    daysAgo: 3,
  },
  {
    title: "Data Scientist",
    location: "Hyderabad",
    state: "Telangana",
    type: "Full-Time",
    desc: "Leverage machine learning to build recommendation and matching systems...",
    daysAgo: 1,
  },
  {
    title: "Frontend Developer",
    location: "Pune",
    state: "Maharashtra",
    type: "Full-Time",
    desc: "Develop highly responsive user interfaces using React and Next.js...",
    daysAgo: 4,
  },
  {
    title: "DevOps Engineer",
    location: "Chennai",
    state: "Tamil Nadu",
    type: "Full-Time",
    desc: "Design and implement CI/CD pipelines, monitor infrastructure performance...",
    daysAgo: 2,
  },
  {
    title: "Marketing Specialist",
    location: "Delhi",
    state: "Delhi",
    type: "Contract",
    desc: "Plan and execute digital marketing campaigns to drive user acquisition...",
    daysAgo: 6,
  },
  {
    title: "HR Business Partner",
    location: "Bangalore",
    state: "Karnataka",
    type: "Full-Time",
    desc: "Partner with leadership to align human resources strategy with business goals...",
    daysAgo: 1,
  }
];

export function LatestJobsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(allJobs.length / itemsPerPage);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const visibleJobs = allJobs.slice(
    currentIndex * itemsPerPage,
    currentIndex * itemsPerPage + itemsPerPage
  );

  return (
    <section id="jobs" className={styles.jobs}>
      <div className={styles.jobsHeader}>
        <h2 className={styles.jobsTitle}>
          <span className={styles.jobsTitleBold}>Our Latest </span>
          <span className={styles.jobsTitleLight}>Jobs</span>
        </h2>
        <p className={styles.jobsSubtitle}>
          Explore the newest opportunities from top employers
        </p>
      </div>

      <div className={styles.jobsGrid}>
        {visibleJobs.map((job, i) => (
          <div key={i} className={styles.jobCard}>
            <div className={styles.jobCardInner}>
              <div className={styles.jobCardHeader}>
                <span className={styles.jobBadgeNew}>NEW</span>
                <span className={styles.jobBadgeDate}>{job.daysAgo} DAYS AGO</span>
              </div>
              <h3 className={styles.jobCardTitle}>{job.title}</h3>
              <div className={styles.jobCardMeta}>
                <div className={styles.jobCardMetaRow}>
                  <span>{job.location}</span>
                  <span className={styles.jobCardMetaDot}>●</span>
                  <span>{job.state}</span>
                </div>
                <span>{job.type}</span>
              </div>
              <p className={styles.jobCardDesc}>{job.desc}</p>
            </div>
            <div className={styles.jobCardActions}>
              <Link href="/register" className={styles.jobCardBtnRead}>
                READ MORE
              </Link>
              <Link href="/register" className={styles.jobCardBtnApply}>
                APPLY
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className={styles.jobsNavigation}>
        <button className={styles.jobsNavBtn} aria-label="Previous" onClick={handlePrev}>‹</button>
        <div className={styles.jobsNavDots}>
          {Array.from({ length: totalPages }).map((_, idx) => (
            <span 
              key={idx} 
              className={`${styles.jobsNavDot} ${idx === currentIndex ? styles.jobsNavDotActive : ''}`} 
              onClick={() => setCurrentIndex(idx)}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </div>
        <button className={styles.jobsNavBtn} aria-label="Next" onClick={handleNext}>›</button>
      </div>
    </section>
  );
}
