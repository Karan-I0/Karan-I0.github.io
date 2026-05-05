import { useEffect, useState } from 'react'
import MockupPhone from './MockupPhone'
import { DEV } from '../data'

export default function Hero() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      // 0 at top, 1 once we've scrolled past the hero (~viewport height).
      const p = Math.min(1, Math.max(0, window.scrollY / window.innerHeight))
      setScrollProgress(p)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const heroOpacity = 1 - scrollProgress * 0.9

  return (
    <section
      id="About"
      style={{
        minHeight: '100vh',
        background: '#000000',
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 32px 60px',
        overflow: 'hidden',
      }}
    >
      {/* Subtle radial backdrop */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center top, #1a1a1c 0%, #000000 60%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 1080,
          textAlign: 'center',
          opacity: heroOpacity,
        }}
      >
        <p
          className="eyebrow"
          style={{
            color: '#86868b',
            marginBottom: 18,
          }}
        >
          Senior Mobile Engineer · Calgary
        </p>

        {/* The phone */}
        <div
          style={{
            width: '100%',
            height: 'min(60vh, 540px)',
            margin: '0 auto 30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MockupPhone scrollProgress={scrollProgress} />
        </div>

        <h1
          style={{
            fontSize: 'clamp(44px, 8vw, 96px)',
            fontWeight: 600,
            letterSpacing: '-0.035em',
            lineHeight: 1.05,
            color: '#ffffff',
            marginBottom: 20,
          }}
        >
          {DEV.name}.
        </h1>
        <p
          style={{
            fontSize: 'clamp(17px, 2.2vw, 22px)',
            fontWeight: 400,
            color: '#86868b',
            maxWidth: 720,
            margin: '0 auto',
            lineHeight: 1.5,
          }}
        >
          {DEV.tagline}
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: 36,
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: Math.max(0, 1 - scrollProgress * 4),
          transition: 'opacity 0.3s',
          color: '#86868b',
          fontSize: 12,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span>Scroll</span>
        <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
          <path
            d="M7 1v17m0 0l-5-5m5 5l5-5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </section>
  )
}
