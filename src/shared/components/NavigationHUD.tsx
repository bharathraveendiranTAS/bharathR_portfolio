import styles from './SharedComponents.module.scss';

interface NavigationHUDProps {
  activeSection: number;
  scrollProgress: number;
  onNavigate: (sectionIndex: number) => void;
  onHover?: () => void;
}

const SECTIONS = [
  { label: 'HOME', id: 'home', step: '01' },
  { label: 'ABOUT', id: 'about', step: '02' },
  { label: 'PROJECTS', id: 'projects', step: '03' },
  { label: 'SKILLS', id: 'skills', step: '04' },
  { label: 'CONTACT', id: 'contact', step: '05' },
];

export function NavigationHUD({
  activeSection,
  scrollProgress,
  onNavigate,
  onHover,
}: NavigationHUDProps) {
  return (
    <>
      {/* Top Global Scroll Progress Bar */}
      <div
        className={styles['nav-progress-bar']}
        style={{ width: `${Math.round(scrollProgress * 100)}%` }}
        aria-hidden="true"
      />

      {/* Floating Pill Nav Bar */}
      <nav
        id="navigation-hud"
        className={styles['navigation-hud']}
        aria-label="Main Portfolio Navigation"
      >
        {SECTIONS.map((sec, idx) => (
          <button
            key={sec.label}
            type="button"
            id={`nav-btn-${sec.label.toLowerCase()}`}
            className={`${styles['nav-item']} ${
              activeSection === idx ? styles['nav-item--active'] : ''
            }`}
            onClick={() => onNavigate(idx)}
            onMouseEnter={onHover}
            aria-current={activeSection === idx ? 'step' : undefined}
            aria-label={`Jump to ${sec.label} section`}
          >
            <span className={styles['nav-dot']} aria-hidden="true" />
            <span style={{ opacity: 0.6, fontSize: '0.72rem', fontFamily: 'JetBrains Mono, monospace' }} aria-hidden="true">
              {sec.step}
            </span>
            <span className={styles['nav-label']}>{sec.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
