import { useEffect, useState } from 'react'
import { DEV } from '../data'

const SECTIONS = [
  { label: 'Work', id: 'Work' },
  { label: 'Stack', id: 'Stack' },
  { label: 'Showcase', id: 'Showcase' },
  { label: 'Contact', id: 'Contact' },
]

export default function Nav({ active, onNav }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px clamp(20px, 4vw, 48px)',
        background: scrolled ? 'rgba(0,0,0,0.7)' : 'transparent',
        backdropFilter: scrolled ? 'saturate(180%) blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'saturate(180%) blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
        transition: 'background 0.25s ease, border-color 0.25s ease',
      }}
    >
      <button
        onClick={() => onNav('About')}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          color: '#ffffff',
          fontSize: 16,
          fontWeight: 600,
          letterSpacing: '-0.01em',
        }}
      >
        {DEV.name}
      </button>

      <div
        style={{
          display: 'flex',
          gap: 4,
        }}
      >
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => onNav(s.id)}
            style={{
              border: 'none',
              background: 'transparent',
              padding: '8px 14px',
              fontSize: 13,
              fontWeight: 400,
              color: active === s.id ? '#ffffff' : '#86868b',
              transition: 'color 0.2s',
              letterSpacing: 0,
            }}
            onMouseEnter={(e) => {
              if (active !== s.id) e.currentTarget.style.color = '#ffffff'
            }}
            onMouseLeave={(e) => {
              if (active !== s.id) e.currentTarget.style.color = '#86868b'
            }}
          >
            {s.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
