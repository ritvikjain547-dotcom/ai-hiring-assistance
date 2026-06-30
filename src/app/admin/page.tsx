'use client'

import { useState } from 'react'
import { login } from '@/actions/admin'
import { Orbit, ShieldCheck, ShieldAlert } from 'lucide-react'

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    
    const result = await login(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative p-4 overflow-hidden" style={{ background: 'var(--color-bg-primary)' }}>
      {/* Background Ambience */}
      <div className="animated-background">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)] shadow-lg mb-4 text-white">
            <Orbit size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">HireAI Admin</h1>
          <p className="text-[var(--color-text-secondary)] mt-2 font-medium">Log in to manage the platform</p>
        </div>

        {/* Login Form Card */}
        <div className="card">
          <form action={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label className="form-label" htmlFor="username">
                Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  placeholder="admin"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="form-input"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <ShieldAlert size={18} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? 'Logging in...' : 'Continue'}
            </button>
          </form>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <ShieldCheck size={16} />
            <span>Secure administrative access</span>
          </div>
        </div>
      </div>
    </div>
  )
}
