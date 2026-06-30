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
      // Trigger error shake animation
      const errorBox = document.getElementById('error-box')
      if (errorBox) {
        errorBox.classList.remove('shake')
        void errorBox.offsetWidth // Trigger reflow
        errorBox.classList.add('shake')
      }
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
      background: 'linear-gradient(-45deg, #f8fafc, #f1f5f9, #e2e8f0, #f8fafc)',
      backgroundSize: '400% 400%',
      animation: 'gradient-bg 15s ease infinite',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Soft Pastel Background Blobs */}
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
          width: '60%',
          height: '60%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0) 70%)',
          filter: 'blur(60px)',
          animation: 'float-slow 20s infinite alternate'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-10%',
          width: '60%',
          height: '60%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.1) 0%, rgba(56, 189, 248, 0) 70%)',
          filter: 'blur(60px)',
          animation: 'float-slow 25s infinite alternate-reverse'
        }} />
      </div>

      {/* Main Container */}
      <div style={{
        width: '100%',
        maxWidth: '400px',
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '28px',
        animation: 'bounce-in-up 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: 'rgba(99, 102, 241, 0.05)',
            border: '1px solid rgba(99, 102, 241, 0.1)',
            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.05)',
            marginBottom: '16px',
            color: '#6366f1',
            animation: 'pulse-glow 3s infinite ease-in-out'
          }}>
            <Orbit size={30} className="animate-spin-slow" />
          </div>
          <h1 style={{
            fontSize: '30px',
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-0.025em',
            margin: 0
          }}>
            Hire<span style={{ color: '#6366f1' }}>AI</span> Admin
          </h1>
          <p style={{
            color: '#64748b',
            marginTop: '6px',
            fontSize: '14px',
            fontWeight: 500
          }}>
            Log in to manage the platform
          </p>
        </div>

        {/* 3D Glassmorphism Login Card (Light Theme) */}
        <div 
          className="login-card"
          style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 0, 0, 0.06)',
            borderRadius: '24px',
            padding: '36px 32px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
            boxSizing: 'border-box',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Username Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="username" style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#64748b',
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
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  color: '#0f172a',
                  outline: 'none',
                  fontSize: '14px',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6366f1';
                  e.target.style.background = '#ffffff';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.08), 0 0 0 3px rgba(99, 102, 241, 0.12)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.background = '#f8fafc';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Password Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="password" style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#64748b',
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
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  color: '#0f172a',
                  outline: 'none',
                  fontSize: '14px',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6366f1';
                  e.target.style.background = '#ffffff';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.08), 0 0 0 3px rgba(99, 102, 241, 0.12)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.background = '#f8fafc';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Error Message with Shake */}
            {error && (
              <div 
                id="error-box"
                className="shake"
                style={{
                  background: 'rgba(239, 68, 68, 0.05)',
                  border: '1px solid rgba(239, 68, 68, 0.15)',
                  color: '#ef4444',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <ShieldAlert size={16} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* 3D Tactile Login Button (Dark Slate) */}
            <button
              type="submit"
              disabled={loading}
              className="btn-3d"
              style={{
                position: 'relative',
                background: '#0f172a',
                color: '#ffffff',
                border: 'none',
                padding: '14px 28px',
                fontSize: '15px',
                fontWeight: 700,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 4px 0 #020617, 0 6px 12px rgba(15, 23, 42, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                outline: 'none',
                marginTop: '6px'
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(3px)';
                e.currentTarget.style.boxShadow = '0 1px 0 #020617, 0 2px 4px rgba(15, 23, 42, 0.1)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 0 #020617, 0 10px 20px rgba(15, 23, 42, 0.2)';
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 0 #020617, 0 10px 20px rgba(15, 23, 42, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 0 #020617, 0 6px 12px rgba(15, 23, 42, 0.15)';
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
            gap: '6px',
            fontSize: '12px',
            color: '#64748b'
          }}>
            <ShieldCheck size={14} />
            <span>Secure administrative access</span>
          </div>
        </div>
      </div>

      {/* Global CSS animations injected via style tag */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-slow {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(4%, 4%) scale(1.05); }
          100% { transform: translate(-4%, -4%) scale(0.98); }
        }
        .animate-spin-slow {
          animation: spin 10s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce-in-up {
          0% {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          70% {
            opacity: 0.9;
            transform: translateY(-5px) scale(1.01);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes pulse-glow {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 4px 20px rgba(99, 102, 241, 0.05);
          }
          50% {
            transform: scale(1.03);
            box-shadow: 0 8px 30px rgba(99, 102, 241, 0.15);
          }
        }
        @keyframes gradient-bg {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .login-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8);
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .shake {
          animation: shake 0.4s ease-in-out;
        }
      `}} />
    </div>
  )
}
