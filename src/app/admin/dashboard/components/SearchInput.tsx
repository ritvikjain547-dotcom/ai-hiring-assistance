'use client'

import { Search } from 'lucide-react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useTransition, useState, useEffect } from 'react'

export function SearchInput({ placeholder }: { placeholder: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const initialQuery = searchParams.get('q') ?? ''
  const [query, setQuery] = useState(initialQuery)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query !== (searchParams.get('q') ?? '')) {
        startTransition(() => {
          const params = new URLSearchParams(searchParams.toString())
          if (query) {
            params.set('q', query)
          } else {
            params.delete('q')
          }
          router.replace(`${pathname}?${params.toString()}`)
        })
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, pathname, router, searchParams])

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
      <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>
        <Search size={18} />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '10px 16px 10px 40px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          background: 'var(--color-bg-primary)',
          color: 'var(--color-text-primary)',
          outline: 'none',
          transition: 'border-color 0.2s',
          fontSize: 'var(--text-sm)',
        }}
        onFocus={(e) => e.target.style.borderColor = 'var(--color-border-focus)'}
        onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
      />
      {isPending && (
        <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid var(--color-border)', borderTopColor: 'var(--color-border-focus)', animation: 'spin 1s linear infinite' }} />
        </div>
      )}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  )
}
