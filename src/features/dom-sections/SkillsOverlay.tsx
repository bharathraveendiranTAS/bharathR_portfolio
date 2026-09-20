import { GlassCard } from '../../shared/components/GlassCard';
import styles from './DomSections.module.scss';

interface SkillsOverlayProps {
  onHover?: () => void;
  onSelectSkill?: (skillName: string) => void;
}

const SKILL_CLUSTERS = [
  {
    title: 'Accessibility & Compliance',
    icon: '🛡️',
    skills: [
      'WCAG 2.1 / 2.2 AA Auditing',
      'Section 508 VPAT',
      'Screen Readers (NVDA/JAWS)',
      'ARIA Authoring Patterns',
      'Keyboard Navigation Maps',
      'Color Contrast Remediation',
      'Axe-Core Automated Testing',
      'Accessible Forms & Dialogs',
    ],
  },
  {
    title: 'Architecture & Design Systems',
    icon: '🏛️',
    skills: [
      'Design Token Engines',
      'Feature-Sliced Design',
      'Tailwind CSS v4',
      'SASS / SCSS BEM Modules',
      'Micro-Frontends',
      'State Orchestration',
      'Component Documentation',
      'Monorepo Tooling',
    ],
  },
];

export function SkillsOverlay({ onHover, onSelectSkill }: SkillsOverlayProps) {
  return (
    <section id="skills" className={styles['section-stage']} aria-label="Skills & Technical Architecture">
      <div className={styles['skills']}>
        {/* Section Header */}
        <div className={styles['skills__header']}>
          <div className={styles['skills__kicker']}>TECHNICAL ARSENAL // CORE CAPABILITIES</div>
          <h2 className={styles['skills__title']}>Technical Stack & Architectural Standards</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.92rem', maxWidth: '650px', margin: '4px auto 0 auto' }}>
            Multi-disciplinary expertise across scalable front-end systems, enterprise design systems,
            and WCAG 2.1/2.2 AA accessibility audits.
          </p>
        </div>

        {/* Categorized Skill Clusters */}
        <div className={styles['skills__grid']}>
          {SKILL_CLUSTERS.map((cluster) => (
            <GlassCard key={cluster.title} interactive className={styles['skills__category']}>
              <h3 className={styles['skills__category-title']}>
                <span aria-hidden="true">{cluster.icon}</span>
                <span>{cluster.title}</span>
              </h3>
              <div className={styles['skills__badge-list']} role="list">
                {cluster.skills.map((skill) => (
                  <span
                    key={skill}
                    role="listitem"
                    className={styles['skills__badge']}
                    onMouseEnter={onHover}
                    onClick={() => onSelectSkill && onSelectSkill(skill)}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
