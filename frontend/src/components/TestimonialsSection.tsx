'use client'

import { Badge } from '@/components/Badge'

export function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Engineering Manager @ Stripe',
      quote: '"ORKA cut our sprint planning ceremony from 2 hours to 20 minutes. The AI delegation is eerily accurate — like it knows our team better than we do."',
      initials: 'PS',
      color: '#16a34a'
    },
    {
      name: 'Marcus Löwe',
      role: 'CTO @ Sumup',
      quote: '"The burnout radar caught three engineers in the red before it became a retention problem. That alone was worth the annual contract."',
      initials: 'ML',
      color: '#2563eb'
    },
    {
      name: 'Anya Chen',
      role: 'Director of Engineering @ Notion',
      quote: '"We evaluated 6 tools. ORKA was the only one that felt like it was built for people who actually run engineering teams, not PMs."',
      initials: 'AC',
      color: '#7c3aed'
    }
  ]

  return (
    <section style={{ padding: 'clamp(56px, 8vw, 110px) 0', background: 'var(--bg-canvas)' }}>
      <div className="container" style={{ maxWidth: 1140 }}>
        <div className="section-header" style={{ marginBottom: 48 }}>
          <Badge variant="indigo" style={{ marginBottom: 12 }}>Testimonials</Badge>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em' }}>
            Loved by Engineering Leaders Worldwide
          </h2>
          <p style={{ color: '#64748b', marginTop: 10, fontSize: 'var(--font-base)', maxWidth: 580, margin: '10px auto 0' }}>
            See how top technology companies scale velocity and prevent burnout with ORKA v2.
          </p>
        </div>

        <div className="testimonials-grid" style={{ gap: 24 }}>
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="glass-card testimonial-card p-6 flex flex-col justify-between"
              style={{ borderRadius: 16, border: '1px solid #e2e8f0', padding: '24px', minHeight: 220 }}
            >
              <p style={{ fontSize: 'var(--font-xs)', color: '#334155', lineHeight: 1.65, fontStyle: 'italic', marginBottom: 20 }}>
                {t.quote}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: `${t.color}15`, color: t.color,
                  fontWeight: 800, fontSize: 'var(--font-xs)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1px solid ${t.color}30`, flexShrink: 0
                }}>
                  {t.initials}
                </div>
                <div>
                  <p style={{ fontSize: 'var(--font-xs)', fontWeight: 800, color: '#0f172a' }}>{t.name}</p>
                  <p style={{ fontSize: '11px', color: '#64748b' }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
