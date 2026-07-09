'use client';

import { useState, useEffect } from 'react';

const quotes = [
  '"Hire character. Train skill." – Peter Schutz',
  '"Great vision without great people is irrelevant." – Jim Collins',
  '"Acquiring the right talent is the most important key to growth." – Marc Benioff',
  '"To win in the marketplace you must first win in the workplace." – Doug Conant',
  '"AI accelerates the process, but humans make the choice."'
];

export function AnimatedQuote() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      setFade(false);
      
      // Wait for fade out, then change quote and fade in
      setTimeout(() => {
        setIndex((current) => (current + 1) % quotes.length);
        setFade(true);
      }, 500); // 500ms transition duration
    }, 8000); // Change quote every 8 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      padding: '0 var(--space-4)'
    }}>
      <span style={{
        fontSize: 'var(--text-sm)',
        fontWeight: 500,
        color: 'var(--color-text-secondary)',
        fontStyle: 'italic',
        opacity: fade ? 1 : 0,
        transform: fade ? 'translateY(0)' : 'translateY(10px)',
        transition: 'all 0.5s ease-in-out',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '100%'
      }}>
        {quotes[index]}
      </span>
    </div>
  );
}
