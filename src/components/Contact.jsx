import useReveal, { revealStyle } from '../hooks/useReveal'
import { DEV } from '../data'

const SOCIAL_LABELS = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  email: 'Email',
  whatsapp: 'WhatsApp',
  phone: 'Phone',
  stackoverflow: 'Stack Overflow',
}

// Format an E.164 number for display: +15816883007 → +1 (581) 688-3007
function formatPhone(e164) {
  const m = e164.match(/^\+(\d)(\d{3})(\d{3})(\d{4})$/)
  return m ? `+${m[1]} (${m[2]}) ${m[3]}-${m[4]}` : e164
}

export default function Contact() {
  const [headerRef, headerVisible] = useReveal()
  const [linksRef, linksVisible] = useReveal()
  const socialEntries = Object.entries(DEV.socials).filter(([, v]) => v)

  return (
    <section id="Contact" className="section section-dark">
      <div
        className="section-inner"
        style={{
          textAlign: 'center',
          paddingBottom: 60,
        }}
      >
        <div ref={headerRef} style={revealStyle(headerVisible)}>
          <p className="eyebrow" style={{ color: '#86868b', marginBottom: 18 }}>
            Connect
          </p>
          <h2
            style={{
              fontSize: 'clamp(48px, 8vw, 96px)',
              fontWeight: 600,
              letterSpacing: '-0.035em',
              lineHeight: 1.05,
              color: '#ffffff',
              marginBottom: 24,
            }}
          >
            Let’s build something.
          </h2>
          <p
            style={{
              fontSize: 'clamp(18px, 2.2vw, 22px)',
              color: '#86868b',
              maxWidth: 640,
              margin: '0 auto 40px',
              lineHeight: 1.5,
            }}
          >
            Open to senior mobile engineering roles and interesting
            collaborations across Android, iOS, and React Native.
          </p>
          <a
            href={`mailto:${DEV.socials.email}`}
            style={{
              display: 'inline-block',
              fontSize: 'clamp(20px, 2.5vw, 28px)',
              fontWeight: 500,
              color: '#ffffff',
              textDecoration: 'none',
              borderBottom: '1px solid #ffffff',
              paddingBottom: 4,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.7)}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
          >
            {DEV.socials.email}
          </a>
        </div>

        <div
          ref={linksRef}
          style={{
            ...revealStyle(linksVisible, 200),
            marginTop: 80,
            display: 'flex',
            justifyContent: 'center',
            gap: 36,
            flexWrap: 'wrap',
          }}
        >
          {socialEntries
            .filter(([k]) => k !== 'email')
            .map(([k, v]) => {
              const isPhone = k === 'phone'
              const href = isPhone ? `tel:${v}` : v
              const label = isPhone ? formatPhone(v) : SOCIAL_LABELS[k] ?? k
              return (
                <a
                  key={k}
                  href={href}
                  target={isPhone ? undefined : '_blank'}
                  rel={isPhone ? undefined : 'noopener noreferrer'}
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#86868b',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#86868b')}
                >
                  {label}
                </a>
              )
            })}
        </div>
      </div>

      {/* Footer microline */}
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '32px 32px 0',
          borderTop: '1px solid #2c2c2e',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          fontSize: 12,
          color: '#86868b',
        }}
      >
        <span>
          {DEV.education.map((e) => `${e.degree.split(',')[0]}, ${e.school}`).join(' · ')}
        </span>
        <span>© {new Date().getFullYear()} {DEV.name}</span>
      </div>
    </section>
  )
}
