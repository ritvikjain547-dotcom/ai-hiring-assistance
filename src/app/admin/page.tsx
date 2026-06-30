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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      padding: '24px',
      overflow: 'hidden',
      background: '#09090b', // Deep rich dark background
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Dynamic Ambient Background Blobs */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0
      }}>
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '50%',
          height: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0) 70%)',
          filter: 'blur(80px)',
          animation: 'float-slow 20s infinite alternate'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-10%',
          width: '50%',
          height: '50%',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, rgba(6, 182, 212, 0) 70%)',
          filter: 'blur(80px)',
          animation: 'float-slow 25s infinite alternate-reverse'
        }} />
      </div>

      {/* Main Container */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '32px'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            marginBottom: '16px',
            color: '#818cf8'
          }}>
            <Orbit size={32} className="animate-spin-slow" />
          </div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.025em',
            margin: 0
          }}>
            Hire<span style={{ color: '#38bdf8' }}>AI</span> Admin
          </h1>
          <p style={{
            color: '#a1a1aa',
            marginTop: '8px',
            fontSize: '15px',
            fontWeight: 500
          }}>
            Log in to manage the platform
          </p>
        </div>

        {/* 3D Glassmorphism Login Card */}
        <div style={{
          width: '100%',
          background: 'rgba(20, 20, 25, 0.7)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          padding: '40px 32px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}>
          <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Username Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="username" style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#a1a1aa',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                placeholder="Enter admin username"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  color: '#ffffff',
                  outline: 'none',
                  fontSize: '15px',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#818cf8';
                  e.target.style.background = 'rgba(255, 255, 255, 0.04)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.02)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Password Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="password" style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#a1a1aa',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  color: '#ffffff',
                  outline: 'none',
                  fontSize: '15px',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#818cf8';
                  e.target.style.background = 'rgba(255, 255, 255, 0.04)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.02)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#f87171',
                padding: '12px 16px',
                borderRadius: '12px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <ShieldAlert size={18} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* 3D Tactile Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-3d"
              style={{
                position: 'relative',
                background: '#ffffff',
                color: '#09090b',
                border: 'none',
                padding: '14px 28px',
                fontSize: '16px',
                fontWeight: 700,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.1s ease',
                boxShadow: '0 4px 0 #d4d4d8, 0 8px 16px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                outline: 'none',
                marginTop: '8px'
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(3px)';
                e.currentTarget.style.boxShadow = '0 1px 0 #d4d4d8, 0 2px 4px rgba(0, 0, 0, 0.2)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 0 #d4d4d8, 0 8px 16px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 0 #d4d4d8, 0 8px 16px rgba(0, 0, 0, 0.3)';
              }}
            >
              {loading ? 'Logging in...' : 'Continue'}
            </button>
          </form>

          {/* Footer badge */}
          <div style={{
            marginTop: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '13px',
            color: '#71717a'
          }}>
            <ShieldCheck size={16} />
            <span>Secure administrative access</span>
          </div>
        </div>
      </div>

      {/* Global CSS animations injected via style tag */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-slow {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(5%, 5%) scale(1.1); }
          100% { transform: translate(-5%, -5%) scale(0.95); }
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  )
}
