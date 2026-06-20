"use client";

import { useState } from "react";
import { submitPlatformFeedback } from "@/actions/feedback";
import { MessageSquare, Smile } from "lucide-react";

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

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-primary" />
          Feedback & Support
        </h1>
        <p className="text-[var(--color-text-secondary)] mt-1">
          ANY PROBLEM, QUERY WRITE TO OUR CUSTOMER SERVICE OUR AGENT WILL CONNECT TO YOU
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[var(--color-bg-primary)] rounded-lg border border-[var(--color-border)] p-6 space-y-6">
        {message && (
          <div className={`p-4 rounded-md ${message.type === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
            {message.text}
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium">How would you rate your experience?</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`p-1 transition-colors ${rating >= star ? "text-yellow-500" : "text-gray-400 hover:text-yellow-400"}`}
              >
                <Smile className="w-8 h-8" fill={rating >= star ? "currentColor" : "none"} />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="feedback" className="block text-sm font-medium">Your Feedback</label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tell us what you love, what could be improved, or any issues you've encountered..."
            rows={5}
            className="w-full p-3 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:ring-2 focus:ring-primary outline-none resize-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !feedback.trim()}
          className="w-full py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
}
