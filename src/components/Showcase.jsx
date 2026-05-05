import useReveal, { revealStyle } from '../hooks/useReveal'
import { DEV } from '../data'

// A stylized monochrome "phone preview" rectangle (no Three.js — keeps the
// section visually quiet and lets the hero's 3D phone be the unique moment).
function PhonePreview({ label }) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 280,
        aspectRatio: '9 / 19.5',
        background: '#1d1d1f',
        borderRadius: 28,
        padding: 14,
        boxShadow: '0 30px 60px -20px rgba(0,0,0,0.45)',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#000000',
          borderRadius: 18,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#86868b',
          fontSize: 14,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          fontWeight: 500,
          padding: 20,
          textAlign: 'center',
        }}
      >
        {label}
      </div>
    </div>
  )
}

function ProjectBlock({ project, idx }) {
  const [ref, visible] = useReveal({ threshold: 0.18 })
  const reverse = idx % 2 === 1

  return (
    <article
      ref={ref}
      style={{
        ...revealStyle(visible),
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 72,
        alignItems: 'center',
        padding: '90px 0',
        borderTop: idx === 0 ? 'none' : '1px solid #d2d2d7',
      }}
    >
      <div style={{ order: reverse ? 2 : 1 }}>
        <p
          className="eyebrow"
          style={{
            color: '#86868b',
            marginBottom: 14,
          }}
        >
          {project.org ?? 'Project'}
        </p>
        <h3
          style={{
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 600,
            letterSpacing: '-0.025em',
            lineHeight: 1.1,
            color: '#1d1d1f',
            marginBottom: 20,
          }}
        >
          {project.title}
        </h3>
        <p
          style={{
            fontSize: 18,
            lineHeight: 1.55,
            color: '#1d1d1f',
            marginBottom: 26,
            maxWidth: 520,
          }}
        >
          {project.desc}
        </p>
        {project.metric && (
          <p
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: '#1d1d1f',
              marginBottom: 22,
              letterSpacing: 0,
            }}
          >
            → {project.metric}
          </p>
        )}
        <p
          style={{
            fontSize: 13,
            color: '#86868b',
            letterSpacing: 0,
          }}
        >
          {project.tech.join(' · ')}
        </p>
      </div>

      <div
        style={{
          order: reverse ? 1 : 2,
          display: 'flex',
          justifyContent: reverse ? 'flex-start' : 'flex-end',
        }}
      >
        <PhonePreview label={project.title} />
      </div>
    </article>
  )
}

export default function Showcase() {
  const [headerRef, headerVisible] = useReveal()

  return (
    <section id="Showcase" className="section section-light">
      <div className="section-inner">
        <div ref={headerRef} style={revealStyle(headerVisible)}>
          <p className="eyebrow" style={{ color: '#86868b', marginBottom: 14 }}>
            Showcase
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
            Selected projects.
          </h2>
          <p
            style={{
              fontSize: 'clamp(17px, 2vw, 21px)',
              color: '#86868b',
              maxWidth: 700,
              lineHeight: 1.5,
            }}
          >
            A few of the apps and platforms I’ve led, shipped, and scaled.
          </p>
        </div>

        <div style={{ marginTop: 60 }}>
          {DEV.projects.map((p, i) => (
            <ProjectBlock key={p.title} project={p} idx={i} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          #Showcase article {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          #Showcase article > div { order: unset !important; }
          #Showcase article > div:last-child { justify-content: center !important; }
        }
      `}</style>
    </section>
  )
}
