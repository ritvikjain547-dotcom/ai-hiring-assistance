import { prisma } from "@/lib/prisma";
import { MessageSquare, Smile } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FeedbackPage() {
  const feedbacks = await prisma.platformFeedback.findMany({
    include: {
      user: {
        select: { name: true, email: true, role: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-6)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ padding: 'var(--space-2)', background: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
              <MessageSquare color="#60a5fa" size={24} />
            </div>
            Platform Feedback
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
            Review feedback and feature requests submitted by recruiters.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {feedbacks.length === 0 ? (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            No feedback has been submitted yet.
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Platform Rating</th>
                  <th>AI Screening</th>
                  <th style={{ width: '50%' }}>Feedback</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((fb) => (
                  <tr key={fb.id}>
                    <td>
                      <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{fb.user.name}</div>
                      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{fb.user.email}</div>
                    </td>
                    <td>
                      <span className="badge badge-outline">{fb.user.role}</span>
                    </td>
                    <td>
                      {fb.rating ? (
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {[...Array(5)].map((_, i) => (
                            <Smile
                              key={i}
                              size={16}
                              color={i < (fb.rating || 0) ? "#eab308" : "#d1d5db"}
                              fill={i < (fb.rating || 0) ? "#eab308" : "none"}
                            />
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>N/A</span>
                      )}
                    </td>
                    <td>
                      {fb.aiScreeningRating !== null ? (
                        <span style={{ fontWeight: 500, fontSize: 'var(--text-lg)' }}>{fb.aiScreeningRating}/10</span>
                      ) : (
                        <span style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>N/A</span>
                      )}
                    </td>
                    <td style={{ fontSize: 'var(--text-sm)', whiteSpace: 'pre-wrap', color: 'var(--color-text-secondary)' }}>
                      {fb.feedback}
                    </td>
                    <td style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                      {new Date(fb.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
