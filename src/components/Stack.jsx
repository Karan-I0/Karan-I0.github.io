import useReveal, { revealStyle } from '../hooks/useReveal'
import { DEV } from '../data'

function Column({ title, items, idx }) {
  const [ref, visible] = useReveal()
  return (
    <div ref={ref} style={revealStyle(visible, idx * 100)}>
      <p
        className="eyebrow"
        style={{
          color: '#86868b',
          marginBottom: 22,
          fontSize: 12,
        }}
      >
        {title}
      </p>
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {items.map((item) => (
          <li
            key={item}
            style={{
              fontSize: 17,
              fontWeight: 400,
              color: '#f5f5f7',
              padding: '14px 0',
              borderTop: '1px solid #2c2c2e',
              letterSpacing: '-0.005em',
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

const COLUMN_TITLES = {
  android: 'Native Android',
  crossPlatform: 'Cross-Platform',
  engineering: 'Engineering',
}

export default function Stack() {
  const [headerRef, headerVisible] = useReveal()
  const cols = ['android', 'crossPlatform', 'engineering']

  return (
    <section id="Stack" className="section section-dark">
      <div className="section-inner">
        <div ref={headerRef} style={revealStyle(headerVisible)}>
          <p className="eyebrow" style={{ color: '#86868b', marginBottom: 14 }}>
            Stack
          </p>
          <h2
            style={{
              fontSize: 'clamp(40px, 6vw, 72px)',
              fontWeight: 600,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              color: '#ffffff',
              marginBottom: 14,
              maxWidth: 900,
            }}
          >
            Tools of the trade.
          </h2>
          <p
            style={{
              fontSize: 'clamp(17px, 2vw, 21px)',
              color: '#86868b',
              maxWidth: 700,
              lineHeight: 1.5,
              marginBottom: 80,
            }}
          >
            Native Android first. React Native for cross-platform delivery.
            Engineering practices that keep the code shippable.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 60,
          }}
        >
          {cols.map((c, i) => (
            <Column
              key={c}
              title={COLUMN_TITLES[c]}
              items={DEV.skills[c].items}
              idx={i}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
