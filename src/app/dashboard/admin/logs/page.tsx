import { prisma } from '@/lib/prisma'
import { History, Search, ShieldAlert, Briefcase, UserX, Activity } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AuditLogsPage() {
  // Fetch admin audit logs
  const auditLogs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100 // Limit to recent 100 for performance
  })

  // Optionally fetch some global activity (like recent jobs) to make it a combined feed
  const recentJobs = await prisma.job.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: { recruiter: { select: { name: true } } }
  })
  
  const recentApplications = await prisma.application.findMany({
    orderBy: { appliedAt: 'desc' },
    take: 20,
    include: { 
      applicant: { select: { name: true } },
      job: { select: { title: true } }
    }
  })

  // Combine and sort them chronologically
  const feed = [
    ...auditLogs.map(log => ({
      id: log.id,
      type: 'ADMIN',
      action: log.action,
      details: log.details,
      date: log.createdAt,
      icon: log.action.includes('USER') ? UserX : ShieldAlert,
      color: log.action.includes('DELETED') ? 'text-red-500 bg-red-500/10 border-red-500/20' : 'text-orange-500 bg-orange-500/10 border-orange-500/20'
    })),
    ...recentJobs.map(job => ({
      id: `job-${job.id}`,
      type: 'USER',
      action: 'NEW_JOB_POSTED',
      details: `Recruiter ${job.recruiter.name} posted a new job: ${job.title}`,
      date: job.createdAt,
      icon: Briefcase,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20'
    })),
    ...recentApplications.map(app => ({
      id: `app-${app.id}`,
      type: 'USER',
      action: 'NEW_APPLICATION',
      details: `Applicant ${app.applicant.name} applied for ${app.job.title}`,
      date: app.appliedAt,
      icon: Activity,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 50) // Top 50 chronological events

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-6)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ padding: 'var(--space-2)', background: 'rgba(99, 102, 241, 0.1)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
              <History color="#6366f1" size={24} />
            </div>
            Activity & Audit Logs
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)', fontSize: 'var(--text-sm)', fontWeight: 500 }}>A real-time global feed of all platform and administrative actions.</p>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)' }}>
              <tr>
                <th style={{ padding: 'var(--space-4) var(--space-6)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Event
                </th>
                <th style={{ padding: 'var(--space-4) var(--space-6)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Action Type
                </th>
                <th style={{ padding: 'var(--space-4) var(--space-6)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Details
                </th>
                <th style={{ padding: 'var(--space-4) var(--space-6)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody style={{ background: 'transparent' }}>
              {feed.map((event) => (
                <tr key={event.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background var(--transition-fast)' }} className="hover:bg-white/[0.02]">
                  <td style={{ padding: 'var(--space-4) var(--space-6)', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: 'var(--radius-full)' }} className={`border ${event.color}`}>
                      <event.icon size={16} />
                    </div>
                  </td>
                  <td style={{ padding: 'var(--space-4) var(--space-6)', whiteSpace: 'nowrap' }}>
                    <span className={`badge ${event.type === 'ADMIN' ? 'badge-danger' : 'badge-primary'}`}>
                      {event.action}
                    </span>
                  </td>
                  <td style={{ padding: 'var(--space-4) var(--space-6)', color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
                    {event.details}
                  </td>
                  <td style={{ padding: 'var(--space-4) var(--space-6)', whiteSpace: 'nowrap', fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                    {event.date.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
              
              {feed.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: 'var(--space-12) var(--space-6)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)' }}>
                      <div style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-full)', background: 'var(--color-bg-secondary)', marginBottom: 'var(--space-2)' }}>
                        <Search size={32} color="var(--color-text-muted)" />
                      </div>
                      <p style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text-primary)' }}>No logs found</p>
                      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>The platform hasn't registered any activity yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
