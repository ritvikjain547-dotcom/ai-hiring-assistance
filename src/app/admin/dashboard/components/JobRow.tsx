'use client'

import { useState } from 'react'
import { Briefcase, Trash2, Power, PowerOff } from 'lucide-react'
import { deleteJob, toggleJobStatus } from '@/actions/adminJobActions'

type JobProps = {
  job: {
    id: string
    title: string
    company: string
    status: string
    createdAt: Date
    recruiter: {
      name: string
    }
    _count: {
      applications: number
    }
  }
}

export function JobRow({ job }: JobProps) {
  const [loading, setLoading] = useState(false)

  async function handleToggleStatus() {
    setLoading(true)
    await toggleJobStatus(job.id, job.status)
    setLoading(false)
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this job? All associated applications will also be deleted.')) {
      return
    }
    setLoading(true)
    await deleteJob(job.id)
    setLoading(false)
  }

  return (
    <tr style={{ borderBottom: '1px solid var(--color-border)', transition: 'background var(--transition-fast)' }} className="hover:bg-white/[0.02]">
      <td style={{ padding: 'var(--space-4) var(--space-6)', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div className="avatar" style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)' }}>
            <Briefcase size={16} />
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{job.title}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{job.company}</div>
          </div>
        </div>
      </td>
      <td style={{ padding: 'var(--space-4) var(--space-6)', whiteSpace: 'nowrap', fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--color-text-primary)' }}>
        {job.recruiter.name}
      </td>
      <td style={{ padding: 'var(--space-4) var(--space-6)', whiteSpace: 'nowrap' }}>
        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', background: 'var(--color-bg-secondary)', padding: 'var(--space-1) var(--space-3)', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)' }}>
          {job._count.applications} Apps
        </span>
      </td>
      <td style={{ padding: 'var(--space-4) var(--space-6)', whiteSpace: 'nowrap', fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
        {new Date(job.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
      </td>
      <td style={{ padding: 'var(--space-4) var(--space-6)', whiteSpace: 'nowrap' }}>
        <span className={`badge ${job.status === 'OPEN' ? 'badge-success' : job.status === 'CLOSED' ? 'badge-danger' : 'badge-secondary'}`}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', marginRight: '4px' }}></span>
          {job.status}
        </span>
      </td>
      <td style={{ padding: 'var(--space-4) var(--space-6)', whiteSpace: 'nowrap', textAlign: 'right' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
          <button
            onClick={handleToggleStatus}
            disabled={loading}
            className="btn btn-sm btn-ghost"
            style={{ color: 'var(--color-text-secondary)' }}
            title={job.status === 'OPEN' ? 'Close Job' : 'Reopen Job'}
          >
            {loading ? (
              <div style={{ width: '14px', height: '14px', border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            ) : job.status === 'OPEN' ? (
              <PowerOff size={14} />
            ) : (
              <Power size={14} />
            )}
          </button>
          
          <button
            onClick={handleDelete}
            disabled={loading}
            className="btn btn-sm btn-ghost"
            style={{ color: 'var(--color-accent-danger)' }}
            title="Delete Job"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  )
}
