import styles from './DomSections.module.scss';

interface HeroOverlayProps {
  onScrollClick: () => void;
  onHover?: () => void;
  onViewProjects?: () => void;
  onViewResume?: () => void;
}

export function HeroOverlay({ onScrollClick, onHover, onViewProjects, onViewResume }: HeroOverlayProps) {
  return (
    <section id="home" className={styles['section-stage']} aria-label="Introduction Stage">
      <div className={styles['hero']}>
        {/* High-Contrast Hero Card Framing */}
        <div className={styles['hero__card']}>
          {/* Available for work live beacon */}
          <div className={styles['hero__status-pill']}>
            <span className={styles['hero__status-dot']} aria-hidden="true" />
            <span>AVAILABLE FOR ENTERPRISE CONTRACTS // 2026</span>
          </div>

          {/* Professional Header Kicker */}
          <div className={styles['hero__kicker']}>
            LEAD UI ENGINEER & ACCESSIBILITY ARCHITECT
          </div>

          {/* Clean High-Contrast Headline */}
          <h1 className={styles['hero__title']}>
            BHARATH <span>KUMAR</span>
          </h1>

          {/* Role & Mission Statement with Perfect Contrast */}
          <p className={styles['hero__role']}>
            Senior UI Engineer & Enterprise Accessibility Architecture Specialist with{' '}
            <strong>6.3+&nbsp;years</strong> of experience bridging scalable frontend architectures,{' '}
            <strong>100%&nbsp;WCAG&nbsp;2.2&nbsp;AA</strong> compliance, and high-performance interactive 3D web
            applications.
          </p>

          {/* Specialization Tags */}
          <div className={styles['hero__tags']} role="list">
            <span className={styles['hero__tag']} role="listitem" onMouseEnter={onHover}>
              ⚡ WCAG 2.1 / 2.2 AA Audits
            </span>
            <span className={styles['hero__tag']} role="listitem" onMouseEnter={onHover}>
              🌐 Modern Frontend Systems
            </span>
            <span className={styles['hero__tag']} role="listitem" onMouseEnter={onHover}>
              🏛️ Enterprise Design Systems
            </span>
            <span className={styles['hero__tag']} role="listitem" onMouseEnter={onHover}>
              🚀 High-Performance Architecture
            </span>
          </div>

          {/* Primary Action Buttons */}
          <div className={styles['hero__actions']}>
            <button
              type="button"
              id="hero-btn-works"
              className={styles['work__btn'] + ' ' + styles['work__btn--primary']}
              onClick={onViewProjects || onScrollClick}
              onMouseEnter={onHover}
            >
              <span>EXPLORE INTERACTIVE WORKS</span>
              <span aria-hidden="true">→</span>
            </button>

            {onViewResume && (
              <button
                type="button"
                id="hero-btn-resume"
                className={styles['work__btn']}
                onClick={onViewResume}
                onMouseEnter={onHover}
              >
                <span>VIEW RESUME & MILESTONES</span>
              </button>
            )}
          </div>
        </div>

        {/* Interactive Scroll Prompter */}
        <button
          type="button"
          className={styles['hero__scroll-hint']}
          onClick={onScrollClick}
          onMouseEnter={onHover}
          aria-label="Scroll down to explore about section"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
        >
          <div className={styles['hero__scroll-icon']} aria-hidden="true" />
          <span>EXPLORE PORTFOLIO // SCROLL DOWN</span>
        </button>
      </div>
    </section>
  );
}
