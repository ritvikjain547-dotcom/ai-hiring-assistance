'use client';

import { useState } from 'react';
import styles from '../app/page.module.css';

const faqs = [
  {
    question: "How does the AI resume screening work?",
    answer: "Our advanced AI analyzes resumes against job descriptions, identifying key skills, experiences, and qualifications to instantly provide a highly accurate match score, saving recruiters hours of manual review."
  },
  {
    question: "Can I integrate HireAI with my existing ATS?",
    answer: "Yes! HireAI offers seamless integration APIs for popular Applicant Tracking Systems (ATS), allowing you to synchronize candidate data and match scores effortlessly."
  },
  {
    question: "What kind of support is included in the Pro plan?",
    answer: "The Pro plan includes 24/7 priority email and chat support, along with a dedicated account manager to assist you with team onboarding and custom workflow setups."
  },
  {
    question: "Is my company data kept secure and private?",
    answer: "Absolutely. We use industry-standard AES-256 encryption, maintain strict SOC2 compliance, and adhere to global privacy regulations to ensure your candidate data is always safe and confidential."
  }
];

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className={styles.faq}>
      <h2 className={styles.faqTitle}>
        <span className={styles.faqTitleBold}>Frequently Asked </span>
        <span className={styles.faqTitleLight}>Questions</span>
      </h2>
      <div className={styles.faqList}>
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index} 
              className={styles.faqItem} 
              onClick={() => toggleFaq(index)}
              style={{ 
                cursor: 'pointer', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'flex-start',
                padding: 'var(--space-5) 0',
                borderBottom: '1px solid var(--color-border)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <span className={styles.faqQuestion} style={{ fontSize: '18px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                  {faq.question}
                </span>
                <span 
                  className={styles.faqIcon} 
                  style={{ 
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    color: 'var(--color-text-accent)'
                  }}
                >
                  ▼
                </span>
              </div>
              <div 
                style={{ 
                  maxHeight: isOpen ? '200px' : '0', 
                  overflow: 'hidden', 
                  transition: 'max-height 0.3s ease, margin-top 0.3s ease',
                  marginTop: isOpen ? 'var(--space-3)' : '0',
                  color: 'var(--color-text-secondary)',
                  lineHeight: '1.6'
                }}
              >
                {faq.answer}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
