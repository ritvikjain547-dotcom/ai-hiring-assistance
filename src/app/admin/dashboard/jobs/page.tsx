import { prisma } from '@/lib/prisma'
import { JobRow } from '../components/JobRow'
import { Briefcase, Search } from 'lucide-react'
import { SearchInput } from '../components/SearchInput'

export const dynamic = 'force-dynamic'

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const q = typeof params.q === 'string' ? params.q : undefined

  const jobs = await prisma.job.findMany({
    where: q ? {
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { company: { contains: q, mode: 'insensitive' } },
        { recruiter: { name: { contains: q, mode: 'insensitive' } } }
      ]
    } : {},
    orderBy: { createdAt: 'desc' },
    include: {
      recruiter: {
        select: {
          name: true
        }
      },
      _count: {
        select: { applications: true }
      }
    }
  })

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-6)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ padding: 'var(--space-2)', background: 'rgba(245, 158, 11, 0.1)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <Briefcase color="#fbbf24" size={24} />
            </div>
            Manage Jobs
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)', fontSize: 'var(--text-sm)', fontWeight: 500 }}>View and manage all job postings across the platform.</p>
        </div>
        <div style={{ width: '100%', maxWidth: '300px' }}>
          <SearchInput placeholder="Search jobs or recruiters..." />
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)' }}>
              <tr>
                <th style={{ padding: 'var(--space-4) var(--space-6)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Job Role
                </th>
                <th style={{ padding: 'var(--space-4) var(--space-6)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Recruiter
                </th>
                <th style={{ padding: 'var(--space-4) var(--space-6)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Activity
                </th>
                <th style={{ padding: 'var(--space-4) var(--space-6)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Posted
                </th>
                <th style={{ padding: 'var(--space-4) var(--space-6)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Status
                </th>
                <th style={{ padding: 'var(--space-4) var(--space-6)', textAlign: 'right', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody style={{ background: 'transparent' }}>
              {jobs.map((job) => (
                <JobRow key={job.id} job={job} />
              ))}
              
              {jobs.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: 'var(--space-12) var(--space-6)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)' }}>
                      <div style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-full)', background: 'var(--color-bg-secondary)', marginBottom: 'var(--space-2)' }}>
                        <Search size={32} color="var(--color-text-muted)" />
                      </div>
                      <p style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text-primary)' }}>No jobs found</p>
                      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>The database is currently empty.</p>
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
