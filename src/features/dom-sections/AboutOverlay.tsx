import { useState } from 'react';
import { GlassCard } from '../../shared/components/GlassCard';
import styles from './DomSections.module.scss';

interface AboutOverlayProps {
  onHover?: () => void;
  onActionClick?: (msg: string) => void;
}

export function AboutOverlay({ onHover, onActionClick }: AboutOverlayProps) {
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'pillars' | 'timeline'>('pillars');

  const downloadMarkdownResume = () => {
    const resumeText = `# BHARATH KUMAR
**Senior UI Engineer & Enterprise Accessibility Architect**
Email: bharathkumar22971997@gmail.com | Location: Bengaluru, India
LinkedIn: https://www.linkedin.com/in/bharath2297

---

## PROFESSIONAL SUMMARY
Senior UI Engineer & Enterprise Accessibility Architecture Specialist with 6.3+ years of experience engineering scalable frontend systems, multi-brand design token engines, and 100% WCAG 2.2 AA compliant web applications. Proven track record across healthcare portals, financial dashboards, and high-performance accessible web architectures.

---

## CORE COMPETENCIES
- **Frontend Core:** React 19 / 18, TypeScript, Next.js, Modern ES Modules, HTML5 Canvas API
- **Accessibility & Compliance:** WCAG 2.1 / 2.2 AA Auditing, Section 508 VPAT, Screen Readers (NVDA, VoiceOver, JAWS), ARIA Authoring Patterns, Automated Axe-Core CI/CD
- **Design Systems & Architecture:** Design Token Engines, Feature-Sliced Architecture, Tailwind CSS, SASS BEM Modules, Micro-Frontends
- **Performance & Engineering:** Sub-50ms Interaction Latency, Zero Layout Shift, Lighthouse 100/100, Core Web Vitals

---

## PROFESSIONAL EXPERIENCE

### Lead UI Engineer & Accessibility Architect | ZeOmega Infotech
*2022 – Present | Bengaluru, India*
- Spearheaded the design and front-end engineering of enterprise healthcare portals servicing millions of patient records.
- Achieved 100% WCAG 2.1/2.2 AA compliance across 250+ enterprise screens, authoring comprehensive Section 508 VPAT reports.
- Engineered automated design-token linting pipelines ensuring zero contrast regressions across multi-brand enterprise themes.
- Accelerated page delivery speeds by 38% through optimized code-splitting and asset pipelining.

### Senior Frontend Engineer | MindMap Consulting
*2020 – 2022 | Bengaluru, India*
- Architected high-concurrency client dashboards and real-time telemetry visualizers using React and TypeScript.
- Implemented accessible keyboard focus-trapping patterns and screen reader aria-live announcements for complex data grids.
- Reduced overall application bundle size by 42% and achieved sub-50ms interaction response times.

### UI/UX Engineer | TotalAI Systems
*2018 – 2020 | Bengaluru, India*
- Designed and built generative AI workflow acceleration portals, interactive node graph editors, and data pipelines.
- Standardized accessible component libraries conforming to Section 508 VPAT specifications.
- Collaborated closely with product designers to bridge high-fidelity Figma prototypes into scalable production code.

---

## EDUCATION
**Bachelor of Engineering (B.E.) in Computer Science & Engineering**
Sri Eshwar College of Engineering | 2014 – 2018
First Class with Distinction
`;

    const blob = new Blob([resumeText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Bharath_Kumar_Senior_UI_Engineer_Resume.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="about" className={styles['section-stage']} aria-label="About Bharath Kumar">
      <div className={styles['about']}>
        {/* Left Column: Narrative Bio & Metrics */}
        <GlassCard interactive id="about-narrative-card">
          <div className={styles['about__header']}>
            <div className={styles['about__kanji']}>CAREER ARCHITECTURE // PROFESSIONAL SUMMARY</div>
            <h2 className={styles['about__title']}>Precision Engineering Meets Accessibility</h2>
          </div>

          <p className={styles['about__bio']}>
            I architect enterprise-grade web applications that harmonize <strong>high-end visual craft</strong> with 
            strict <strong>WCAG 2.1/2.2 AA accessibility standards</strong>. With 6.3+ years leading front-end 
            design systems and interactive architectures across enterprise portals, I specialize in ensuring complex applications remain fully usable, performant, and accessible to every human.
          </p>

          {/* Key Metrics Stats Grid */}
          <div className={styles['about__stats-grid']}>
            <div className={styles['about__stat-box']} onMouseEnter={onHover}>
              <h4>6.3+</h4>
              <p>YEARS EXP</p>
            </div>
            <div className={styles['about__stat-box']} onMouseEnter={onHover}>
              <h4>100%</h4>
              <p>WCAG AA RATE</p>
            </div>
          </div>

          {/* Action Trigger for Resume */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              id="view-resume-modal-btn"
              className={styles['work__btn'] + ' ' + styles['work__btn--primary']}
              onClick={() => {
                setShowResumeModal(true);
                if (onActionClick) onActionClick('📄 Viewing Bharath Kumar Enterprise Experience Brief');
              }}
              onMouseEnter={onHover}
            >
              <span>VIEW EXECUTIVE CV & MILESTONES</span>
            </button>

            <button
              type="button"
              id="download-resume-md-btn"
              className={styles['work__btn']}
              onClick={downloadMarkdownResume}
              onMouseEnter={onHover}
            >
              <span>DOWNLOAD RESUME (.MD)</span>
              <span aria-hidden="true">↓</span>
            </button>
          </div>
        </GlassCard>

        {/* Right Column: Interactive Tabs for Pillars vs Career Milestones */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Tab Switcher */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              padding: '6px',
              background: 'rgba(14, 20, 34, 0.7)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <button
              type="button"
              style={{
                flex: 1,
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'pillars' ? 'rgba(0, 229, 255, 0.2)' : 'transparent',
                color: activeTab === 'pillars' ? '#ffffff' : '#94a3b8',
                fontWeight: 600,
                fontSize: '0.8rem',
                fontFamily: 'JetBrains Mono, monospace',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onClick={() => setActiveTab('pillars')}
              onMouseEnter={onHover}
            >
              CORE ARCHITECTURAL PILLARS
            </button>
            <button
              type="button"
              style={{
                flex: 1,
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'timeline' ? 'rgba(0, 229, 255, 0.2)' : 'transparent',
                color: activeTab === 'timeline' ? '#ffffff' : '#94a3b8',
                fontWeight: 600,
                fontSize: '0.8rem',
                fontFamily: 'JetBrains Mono, monospace',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onClick={() => setActiveTab('timeline')}
              onMouseEnter={onHover}
            >
              CAREER MILESTONES
            </button>
          </div>

          {activeTab === 'pillars' ? (
            <div className={styles['about__pillars']}>
              <GlassCard interactive onMouseEnter={onHover} id="pillar-card-1">
                <div className={styles['about__pillar-item']}>
                  <div className={styles['pillar-icon']} aria-hidden="true">🛡️</div>
                  <div>
                    <h5>Enterprise Accessibility Architecture</h5>
                    <p>
                      Specialized in Section 508 VPAT audits, screen reader remediation (NVDA, VoiceOver, JAWS), 
                      and automated semantic linting pipelines.
                    </p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard interactive onMouseEnter={onHover} id="pillar-card-2">
                <div className={styles['about__pillar-item']}>
                  <div className={styles['pillar-icon']} aria-hidden="true">🎨</div>
                  <div>
                    <h5>Scalable Design Systems</h5>
                    <p>
                      Architected multi-brand token engines across React, SASS BEM, and Tailwind, 
                      servicing hundreds of enterprise components with zero style collision.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>
          ) : (
            <div className={styles['about__pillars']}>
              <GlassCard interactive onMouseEnter={onHover} id="timeline-card-1">
                <div className={styles['about__pillar-item']}>
                  <div className={styles['pillar-icon']} aria-hidden="true">🏥</div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h5>ZeOmega Infotech // Lead UI Engineer & Accessibility Architect</h5>
                      <span style={{ fontSize: '0.74rem', color: '#00e5ff', fontFamily: 'JetBrains Mono' }}>2022 – Present</span>
                    </div>
                    <p>
                      Led healthcare platform modernization across 250+ enterprise screens. Achieved 100% WCAG 2.1/2.2 AA compliance, authoring VPAT reports and multi-brand token engines.
                    </p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard interactive onMouseEnter={onHover} id="timeline-card-2">
                <div className={styles['about__pillar-item']}>
                  <div className={styles['pillar-icon']} aria-hidden="true">📊</div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h5>MindMap Consulting // Senior Frontend Engineer</h5>
                      <span style={{ fontSize: '0.74rem', color: '#00e5ff', fontFamily: 'JetBrains Mono' }}>2020 – 2022</span>
                    </div>
                    <p>
                      Architected high-concurrency client dashboards and real-time telemetry visualizers with React and TypeScript. Reduced bundle size by 42% with sub-50ms latency.
                    </p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard interactive onMouseEnter={onHover} id="timeline-card-3">
                <div className={styles['about__pillar-item']}>
                  <div className={styles['pillar-icon']} aria-hidden="true">🤖</div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h5>TotalAI Systems // UI/UX Engineer</h5>
                      <span style={{ fontSize: '0.74rem', color: '#00e5ff', fontFamily: 'JetBrains Mono' }}>2018 – 2020</span>
                    </div>
                    <p>
                      Engineered generative AI workflow acceleration portals and interactive node graph editors. Standardized accessible component libraries conforming to Section 508.
                    </p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard interactive onMouseEnter={onHover} id="timeline-card-4">
                <div className={styles['about__pillar-item']}>
                  <div className={styles['pillar-icon']} aria-hidden="true">🎓</div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h5>Sri Eshwar College of Engineering // B.E. Computer Science</h5>
                      <span style={{ fontSize: '0.74rem', color: '#00e5ff', fontFamily: 'JetBrains Mono' }}>2014 – 2018</span>
                    </div>
                    <p>
                      Bachelor of Engineering in Computer Science & Engineering (First Class with Distinction).
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}
        </div>
      </div>

      {/* Resume Modal Overlay */}
      {showResumeModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-resume-title"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 400,
            background: 'rgba(3, 5, 8, 0.9)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={() => setShowResumeModal(false)}
        >
          <div
            style={{
              maxWidth: '820px',
              width: '100%',
              maxHeight: '88vh',
              overflowY: 'auto',
              background: '#070b14',
              border: '1px solid rgba(0, 229, 255, 0.35)',
              borderRadius: '20px',
              padding: '36px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 40px rgba(0,229,255,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '20px',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                paddingBottom: '16px',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div>
                <h3 id="modal-resume-title" style={{ color: '#ffffff', margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>
                  Bharath Kumar // Executive Curriculum Vitae
                </h3>
                <div style={{ color: '#38bdf8', fontSize: '0.82rem', fontFamily: 'JetBrains Mono', marginTop: '4px' }}>
                  Senior UI Engineer & Enterprise Accessibility Architecture Specialist
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  style={{
                    background: 'rgba(0, 229, 255, 0.15)',
                    border: '1px solid #00e5ff',
                    color: '#ffffff',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    cursor: 'pointer',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                  }}
                  onClick={downloadMarkdownResume}
                >
                  Download .md
                </button>
                <button
                  type="button"
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#ffffff',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    cursor: 'pointer',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '0.78rem',
                  }}
                  onClick={() => setShowResumeModal(false)}
                >
                  CLOSE [ESC]
                </button>
              </div>
            </div>

            <div style={{ color: '#cbd5e1', fontSize: '0.92rem', lineHeight: '1.7', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h4 style={{ color: '#00e5ff', margin: '0 0 8px 0', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Professional Profile
                </h4>
                <p style={{ margin: 0 }}>
                  Accomplished UI Engineer with 6.3+ years leading front-end design systems, accessibility compliance (WCAG 2.1/2.2 AA), and high-performance interactive architectures. Skilled in bridging deep engineering rigor with exceptional design craftsmanship.
                </p>
              </div>

              <div>
                <h4 style={{ color: '#00e5ff', margin: '0 0 12px 0', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Career History
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#ffffff' }}>
                      <span>Lead UI Engineer & Accessibility Architect // ZeOmega Infotech</span>
                      <span style={{ color: '#38bdf8', fontFamily: 'JetBrains Mono', fontSize: '0.8rem' }}>2022 – Present</span>
                    </div>
                    <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', color: '#94a3b8', fontSize: '0.86rem' }}>
                      <li>Engineered enterprise healthcare web portals servicing millions of patient records with sub-50ms latency.</li>
                      <li>Attained 100% WCAG 2.1/2.2 AA compliance across 250+ enterprise screens; authored Section 508 VPAT documentation.</li>
                      <li>Architected multi-brand token engine across React, Tailwind, and SASS with automated regression gates.</li>
                    </ul>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#ffffff' }}>
                      <span>Senior Frontend Engineer // MindMap Consulting</span>
                      <span style={{ color: '#38bdf8', fontFamily: 'JetBrains Mono', fontSize: '0.8rem' }}>2020 – 2022</span>
                    </div>
                    <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', color: '#94a3b8', fontSize: '0.86rem' }}>
                      <li>Engineered financial analytics dashboards and real-time telemetry visualizers with React and TypeScript.</li>
                      <li>Reduced initial bundle sizes by 42% through aggressive tree-shaking and dynamic module chunking.</li>
                    </ul>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#ffffff' }}>
                      <span>UI/UX Engineer // TotalAI Systems</span>
                      <span style={{ color: '#38bdf8', fontFamily: 'JetBrains Mono', fontSize: '0.8rem' }}>2018 – 2020</span>
                    </div>
                    <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', color: '#94a3b8', fontSize: '0.86rem' }}>
                      <li>Built accessible UI component libraries and node graph visualizers for generative AI workflow pipelines.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ color: '#00e5ff', margin: '0 0 8px 0', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Education & Honors
                </h4>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#ffffff' }}>
                    <span>B.E. Computer Science & Engineering // Sri Eshwar College of Engineering</span>
                    <span style={{ color: '#38bdf8', fontFamily: 'JetBrains Mono', fontSize: '0.8rem' }}>2014 – 2018</span>
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '0.86rem', marginTop: '4px' }}>
                    Graduated First Class with Distinction.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.82rem', fontFamily: 'JetBrains Mono' }}>
                  Direct Contact: bharathkumar22971997@gmail.com
                </span>
                <a
                  href="https://www.linkedin.com/in/bharath2297"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#00e5ff', textDecoration: 'none', fontFamily: 'JetBrains Mono', fontSize: '0.82rem' }}
                >
                  LinkedIn Profile ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
