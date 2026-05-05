import { useEffect, useRef, useState } from 'react'
import useReveal, { revealStyle } from '../hooks/useReveal'
import ClientMarquee from './ClientMarquee'
import { DEV } from '../data'

function CountUp({ target, suffix = '', visible }) {
  const [val, setVal] = useState(0)
  const startedRef = useRef(false)

  useEffect(() => {
    if (!visible || startedRef.current) return
    startedRef.current = true
    const isFloat = !Number.isInteger(target)
    const duration = 1400
    const start = performance.now()
    let raf
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      const next = isFloat
        ? +(target * eased).toFixed(1)
        : Math.round(target * eased)
      setVal(next)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [visible, target])

  return (
    <>
      {val}
      {suffix}
    </>
  )
}

function StatBlock({ stat, idx }) {
  const [ref, visible] = useReveal({ threshold: 0.3 })
  return (
    <div
      ref={ref}
      style={{
        ...revealStyle(visible, idx * 80),
        textAlign: 'left',
      }}
    >
      <p
        style={{
          fontSize: 'clamp(48px, 7vw, 84px)',
          fontWeight: 600,
          letterSpacing: '-0.035em',
          lineHeight: 1,
          color: '#1d1d1f',
          marginBottom: 10,
        }}
      >
        <CountUp
          target={typeof stat.value === 'number' ? stat.value : 0}
          suffix={stat.suffix ?? ''}
          visible={visible}
        />
      </p>
      <p
        style={{
          fontSize: 14,
          fontWeight: 400,
          color: '#86868b',
          letterSpacing: 0,
          lineHeight: 1.5,
        }}
      >
        {stat.label}
      </p>
    </div>
  )
}

function Role({ entry, isCurrent }) {
  const [ref, visible] = useReveal()
  return (
    <article
      ref={ref}
      style={{
        ...revealStyle(visible),
        display: 'grid',
        gridTemplateColumns: 'minmax(140px, 200px) 1fr',
        gap: 40,
        padding: '36px 0',
        borderTop: '1px solid #d2d2d7',
        alignItems: 'start',
      }}
    >
      <div>
        <p
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: '#86868b',
            letterSpacing: 0,
          }}
        >
          {entry.period}
        </p>
        {isCurrent && (
          <span
            style={{
              display: 'inline-block',
              marginTop: 8,
              padding: '2px 10px',
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#1d1d1f',
              border: '1px solid #1d1d1f',
              borderRadius: 999,
            }}
          >
            Current
          </span>
        )}
      </div>
      <div>
        <h3
          style={{
            fontSize: 'clamp(20px, 2.4vw, 26px)',
            fontWeight: 600,
            letterSpacing: '-0.015em',
            color: '#1d1d1f',
            marginBottom: 4,
          }}
        >
          {entry.role}
        </h3>
        <p
          style={{
            fontSize: 16,
            fontWeight: 400,
            color: '#86868b',
            marginBottom: 18,
          }}
        >
          {entry.company}
          {entry.location ? ` · ${entry.location}` : ''}
        </p>
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {entry.bullets.map((b, i) => (
            <li
              key={i}
              style={{
                fontSize: 16,
                lineHeight: 1.55,
                color: '#1d1d1f',
                paddingLeft: 18,
                position: 'relative',
              }}
            >
              <span
                aria-hidden
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 9,
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#1d1d1f',
                }}
              />
              {b}
            </li>
          ))}
        </ul>
        {entry.stack && entry.stack.length > 0 && (
          <p
            style={{
              fontSize: 13,
              color: '#86868b',
              marginTop: 16,
              letterSpacing: 0,
            }}
          >
            {entry.stack.join(' · ')}
          </p>
        )}
      </div>
    </article>
  )
}

export default function Work() {
  const [headerRef, headerVisible] = useReveal()
  // Show top 5 roles in detail; collapse the older two into a one-liner.
  const top = DEV.experience.slice(0, 5)
  const earlier = DEV.experience.slice(5)

  return (
    <section id="Work" className="section section-light">
      <div className="section-inner">
        <div ref={headerRef} style={revealStyle(headerVisible)}>
          <p className="eyebrow" style={{ color: '#86868b', marginBottom: 14 }}>
            Work
          </p>
          <h2
            style={{
              fontSize: 'clamp(40px, 6vw, 72px)',
              fontWeight: 600,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              color: '#1d1d1f',
              marginBottom: 14,
              maxWidth: 900,
            }}
          >
            Eight years of shipping mobile.
          </h2>
          <p
            style={{
              fontSize: 'clamp(17px, 2vw, 21px)',
              color: '#86868b',
              maxWidth: 700,
              lineHeight: 1.5,
            }}
          >
            From banking SDKs to a fitness app used by millions — built, led,
            and shipped across Android, iOS, and React Native.
          </p>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 40,
            marginTop: 90,
            marginBottom: 110,
          }}
        >
          {DEV.stats.slice(0, 4).map((s, i) => (
            <StatBlock key={s.label} stat={s} idx={i} />
          ))}
        </div>

        {/* Role timeline */}
        <div>
          {top.map((entry, i) => (
            <Role
              key={`${entry.company}-${i}`}
              entry={entry}
              isCurrent={i === 0}
            />
          ))}

          {earlier.length > 0 && (
            <div
              style={{
                borderTop: '1px solid #d2d2d7',
                padding: '28px 0',
                fontSize: 14,
                color: '#86868b',
              }}
            >
              <span className="eyebrow" style={{ marginRight: 12 }}>
                Earlier
              </span>
              {earlier
                .map((e) => `${e.role}, ${e.company} (${e.period})`)
                .join(' · ')}
            </div>
          )}
        </div>

        <ClientMarquee tone="light" />
      </div>
    </section>
  )
}
