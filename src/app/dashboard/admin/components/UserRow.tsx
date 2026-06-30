'use client'

import { useState } from 'react'
import { toggleUserBlockStatus } from '@/actions/adminUserActions'
import { ShieldBan, ShieldCheck } from 'lucide-react'

type UserProps = {
  user: {
    id: string
    name: string
    email: string
    role: string
    isBlocked: boolean
    createdAt: Date
    _count?: {
      jobs?: number
      applications?: number
    }
  }
}

export function UserRow({ user }: UserProps) {
  const [loading, setLoading] = useState(false)

  async function handleToggle() {
    setLoading(true)
    await toggleUserBlockStatus(user.id, user.isBlocked)
    setLoading(false)
  }

  return (
    <tr style={{ borderBottom: '1px solid var(--color-border)', transition: 'background var(--transition-fast)' }} className="hover:bg-white/[0.02]">
      <td style={{ padding: 'var(--space-4) var(--space-6)', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div className="avatar" style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)' }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{user.name}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{user.email}</div>
          </div>
        </div>
      </td>
      <td style={{ padding: 'var(--space-4) var(--space-6)', whiteSpace: 'nowrap' }}>
        <span className={`badge ${user.role === 'RECRUITER' ? 'badge-primary' : 'badge-info'}`}>
          {user.role}
        </span>
      </td>
      <td style={{ padding: 'var(--space-4) var(--space-6)', whiteSpace: 'nowrap' }}>
        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', background: 'var(--color-bg-secondary)', padding: 'var(--space-1) var(--space-3)', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)' }}>
          {user.role === 'RECRUITER' ? `${user._count?.jobs || 0} Jobs` : `${user._count?.applications || 0} Apps`}
        </span>
      </td>
      <td style={{ padding: 'var(--space-4) var(--space-6)', whiteSpace: 'nowrap', fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
        {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
      </td>
      <td style={{ padding: 'var(--space-4) var(--space-6)', whiteSpace: 'nowrap' }}>
        <span className={`badge ${user.isBlocked ? 'badge-danger' : 'badge-success'}`}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', marginRight: '4px' }}></span>
          {user.isBlocked ? 'Blocked' : 'Active'}
        </span>
      </td>
      <td style={{ padding: 'var(--space-4) var(--space-6)', whiteSpace: 'nowrap', textAlign: 'right' }}>
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`btn btn-sm ${user.isBlocked ? 'btn-secondary' : 'btn-ghost'}`}
          style={{ color: user.isBlocked ? 'var(--color-accent-success)' : 'var(--color-accent-danger)' }}
        >
          {loading ? (
            <div style={{ width: '14px', height: '14px', border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          ) : user.isBlocked ? (
            <ShieldCheck size={14} />
          ) : (
            <ShieldBan size={14} />
          )}
          {user.isBlocked ? 'Unblock' : 'Block'}
        </button>
      </td>
    </tr>
  )
}
