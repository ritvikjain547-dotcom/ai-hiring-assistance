"use client";

import { useState } from "react";
import { submitPlatformFeedback } from "@/actions/feedback";
import { 
  HeartHandshake, 
  Frown, 
  Meh, 
  Smile, 
  Laugh, 
  Heart, 
  Mail, 
  Clock, 
  Calendar, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Loader2 
} from "lucide-react";

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    setMessage(null);

    const result = await submitPlatformFeedback(
      feedback,
      rating > 0 ? rating : undefined,
      undefined // No AI Screening rating for applicants
    );

    if (result.success) {
      setMessage({ type: "success", text: "Thank you for your feedback!" });
      setFeedback("");
      setRating(0);
    } else {
      setMessage({ type: "error", text: result.error || "Failed to submit feedback." });
    }
    setIsSubmitting(false);
  };

  const ratingOptions = [
    { value: 1, label: "Poor", icon: Frown },
    { value: 2, label: "Okay", icon: Meh },
    { value: 3, label: "Good", icon: Smile },
    { value: 4, label: "Great", icon: Laugh },
    { value: 5, label: "Awesome", icon: Heart },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ maxWidth: '1200px', margin: '0 auto', padding: 'var(--space-4) 0' }}>
      <style>{`
        .feedback-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-6);
          width: 100%;
        }
        @media (min-width: 1024px) {
          .feedback-grid {
            grid-template-columns: 2fr 1fr;
            gap: var(--space-8);
          }
        }
        .rating-emoji-btn {
          background: transparent;
          border: 1px solid transparent;
          border-radius: var(--radius-lg);
          padding: var(--space-3) var(--space-2);
          transition: all var(--transition-base);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-2);
          color: var(--color-text-muted);
          flex: 1;
          min-width: 70px;
        }
        .rating-emoji-btn:hover {
          background: var(--color-bg-secondary);
          color: var(--color-text-secondary);
          transform: translateY(-2px);
        }
        .rating-emoji-btn.active-1 { color: #ef4444; background: rgba(239, 68, 68, 0.08); border-color: rgba(239, 68, 68, 0.2); }
        .rating-emoji-btn.active-2 { color: #f97316; background: rgba(249, 115, 22, 0.08); border-color: rgba(249, 115, 22, 0.2); }
        .rating-emoji-btn.active-3 { color: #eab308; background: rgba(234, 179, 8, 0.08); border-color: rgba(234, 179, 8, 0.2); }
        .rating-emoji-btn.active-4 { color: #22c55e; background: rgba(34, 197, 94, 0.08); border-color: rgba(34, 197, 94, 0.2); }
        .rating-emoji-btn.active-5 { color: #ec4899; background: rgba(236, 72, 153, 0.08); border-color: rgba(236, 72, 153, 0.2); }
      `}</style>

      <div className="page-header" style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <HeartHandshake className="text-primary" size={28} />
          Feedback & Support
        </h1>
        <p className="page-subtitle" style={{ marginTop: 'var(--space-2)' }}>
          We value your feedback. Let us know how we can improve your experience or report any issues you've encountered.
        </p>
      </div>

      {message && (
        <div 
          className="card" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--space-3)', 
            padding: 'var(--space-4)',
            background: message.type === 'success' ? 'rgba(5, 150, 105, 0.08)' : 'rgba(220, 38, 38, 0.08)',
            borderColor: message.type === 'success' ? 'rgba(5, 150, 105, 0.2)' : 'rgba(220, 38, 38, 0.2)',
            color: message.type === 'success' ? 'var(--color-accent-success)' : 'var(--color-accent-danger)',
            marginBottom: 'var(--space-6)',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          {message.type === 'success' ? (
            <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
          ) : (
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
          )}
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{message.text}</span>
        </div>
      )}

      <div className="feedback-grid">
        {/* Left Box - Feedback Form */}
        <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
              How would you rate your overall experience?
            </label>
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)', flexWrap: 'wrap' }}>
              {ratingOptions.map((option) => {
                const Icon = option.icon;
                const isActive = rating === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRating(option.value)}
                    className={`rating-emoji-btn ${isActive ? `active-${option.value}` : ''}`}
                  >
                    <Icon size={32} strokeWidth={isActive ? 2.5 : 1.8} />
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="feedback" className="form-label" style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
              Your Feedback
            </label>
            <textarea
              id="feedback"
              className="form-input"
              rows={6}
              style={{ resize: 'none', fontFamily: 'inherit' }}
              placeholder="Tell us what you like, what could be improved, or any issues you've encountered..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !feedback.trim()}
            className="btn btn-primary"
            style={{ 
              width: '100%', 
              padding: 'var(--space-4)', 
              display: 'flex', 
              gap: 'var(--space-2)', 
              justifyContent: 'center', 
              alignItems: 'center',
              fontSize: 'var(--text-base)',
              fontWeight: 600
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                Submitting...
              </>
            ) : (
              "Submit Feedback"
            )}
          </button>
        </form>

        {/* Right Box - Support Details */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', height: 'fit-content' }}>
          <div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <HelpCircle className="text-primary" size={22} />
              Need Assistance?
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)', lineHeight: '1.6' }}>
              Experiencing a technical problem or have an urgent question? Get in touch with our customer support team directly.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
              <div style={{ color: 'var(--color-accent-info)', display: 'flex' }}>
                <Mail size={20} />
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--color-text-muted)' }}>Email Support</div>
                <a href="mailto:support@aihiring.com" style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)', textDecoration: 'underline' }}>
                  support@aihiring.com
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
              <div style={{ color: 'var(--color-accent-success)', display: 'flex' }}>
                <Clock size={20} />
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--color-text-muted)' }}>Response Time</div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  Under 24 hours
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
              <div style={{ color: 'var(--color-accent-warm)', display: 'flex' }}>
                <Calendar size={20} />
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--color-text-muted)' }}>Availability</div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  Monday - Friday
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
