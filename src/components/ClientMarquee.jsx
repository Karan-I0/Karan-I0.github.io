import { DEV } from '../data'
import useReveal, { revealStyle } from '../hooks/useReveal'

// Auto-scrolling horizontal "trusted by" wall. Text-only (monochrome), so it
// matches the Apple aesthetic and avoids dragging in copyrighted brand SVGs.
// Swap the rendered names for SVG <img> tags if/when you have logos.

export default function ClientMarquee({ tone = 'light' }) {
  const [ref, visible] = useReveal()
  const isDark = tone === 'dark'
  const fg = isDark ? '#f5f5f7' : '#1d1d1f'
  const muted = isDark ? '#86868b' : '#86868b'
  const fadeBg = isDark ? '#000000' : '#f5f5f7'

  // Repeat list 2x so the marquee can loop seamlessly without a visible jump.
  const items = [...DEV.clients, ...DEV.clients]

  return (
    <div ref={ref} style={{ ...revealStyle(visible, 100), marginTop: 96 }}>
      <p
        className="eyebrow"
        style={{
          color: muted,
          textAlign: 'center',
          marginBottom: 32,
        }}
      >
        Trusted by · Worked with
      </p>

      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          maskImage:
            'linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: 'max-content',
            animation: 'marquee 38s linear infinite',
            gap: 60,
            paddingRight: 60,
          }}
        >
          {items.map((name, i) => (
            <span
              key={`${name}-${i}`}
              style={{
                fontSize: 'clamp(20px, 2.6vw, 32px)',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: fg,
                opacity: 0.55,
                whiteSpace: 'nowrap',
                transition: 'opacity 0.25s ease',
                cursor: 'default',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.55)}
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
