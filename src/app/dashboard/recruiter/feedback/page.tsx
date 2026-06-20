"use client";

import { useState } from "react";
import { submitPlatformFeedback } from "@/actions/feedback";
import { MessageSquare, Smile } from "lucide-react";

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [aiScreeningRating, setAiScreeningRating] = useState<number>(0);
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
      aiScreeningRating > 0 ? aiScreeningRating : undefined
    );

    if (result.success) {
      setMessage({ type: "success", text: "Thank you for your feedback!" });
      setFeedback("");
      setRating(0);
      setAiScreeningRating(0);
    } else {
      setMessage({ type: "error", text: result.error || "Failed to submit feedback." });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2">
        <MessageSquare className="text-primary w-6 h-6" />
        <h1 className="text-2xl font-bold">Platform Feedback</h1>
      </div>
      <p className="text-[var(--color-text-secondary)]">
        We value your feedback to help us improve the platform. Let us know your thoughts, feature requests, or report any issues.
      </p>
      <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-md font-medium text-sm">
        ANY PROBLEM, QUERY WRITE TO OUR CUSTOMER SERVICE OUR AGENT WILL CONNECT TO YOU
      </div>

      {message && (
        <div className={`p-4 rounded-md ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-[var(--color-bg-primary)] p-6 rounded-lg border border-[var(--color-border)]">
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
          <label className="block text-sm font-medium">How do you rate our AI Screening? (0-10)</label>
          <div className="flex flex-wrap gap-2">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
              <button
                key={score}
                type="button"
                onClick={() => setAiScreeningRating(score)}
                className={`w-10 h-10 rounded-full font-medium transition-colors ${
                  aiScreeningRating === score
                    ? "bg-primary text-white"
                    : "bg-[var(--color-bg-secondary)] hover:bg-[var(--color-border)] text-[var(--color-text-secondary)]"
                }`}
              >
                {score}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="feedback" className="block text-sm font-medium">Your Feedback</label>
          <textarea
            id="feedback"
            rows={5}
            className="w-full p-3 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-primary outline-none"
            placeholder="Tell us what you like or what we can improve..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !feedback.trim()}
          className="btn btn-primary"
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
}
