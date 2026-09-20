import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { GlassCard } from '../../shared/components/GlassCard';
import styles from './DomSections.module.scss';

interface WorkOverlayProps {
  closeModalSignal?: number;
  onHover?: () => void;
  onSelectProject?: (id: string) => void;
  onModalStateChange?: (isOpen: boolean) => void;
}

export interface ProjectItem {
  id: string;
  file: string;
  badge: string;
  category: string;
  title: string;
  desc: string;
  metrics?: string;
  tags?: string[];
  accentColor: string;
}

export const INTERACTIVE_PROJECTS: ProjectItem[] = [
  {
    id: 'apex-f1',
    file: 'apex-f1.html',
    badge: 'TELEMETRY ENGINE',
    category: 'Motorsport & High-Perf',
    title: 'APEX F1 — Pit-Wall Telemetry',
    desc: 'Real-time F1 delta telemetry and race strategy simulations.',
    accentColor: '#ef4444',
  },
  {
    id: 'aeris-aviation',
    file: 'aeris-aviation.html',
    badge: 'LUXURY CONCIERGE',
    category: 'Aviation & Automotive',
    title: 'AERIS — Fleet Concierge',
    desc: 'Executive private aviation portal with 3D fleet visualizer.',
    accentColor: '#38bdf8',
  },
  {
    id: 'aether-hyperion',
    file: 'aether-hyperion.html',
    badge: '3D EV HYPERCAR',
    category: 'Aviation & Automotive',
    title: 'AETHER Hyperion — Configurator',
    desc: 'Interactive 3D EV hypercar configurator with aerodynamics.',
    accentColor: '#00e5ff',
  },
  {
    id: 'hyperedge',
    file: 'hyperedge.html',
    badge: 'EDGE INFRASTRUCTURE',
    category: 'Cloud & DevTools',
    title: 'HyperEdge — Cloud Mesh',
    desc: 'Ultra-low latency edge infrastructure and global ping tester.',
    accentColor: '#8b5cf6',
  },
  {
    id: 'aura-health',
    file: 'aura-health.html',
    badge: 'GENOMIC INTELLIGENCE',
    category: 'Healthcare & Architecture',
    title: 'Aura Health — Longevity Portal',
    desc: 'Genomic intelligence portal featuring biological age trends.',
    accentColor: '#10b981',
  },
  {
    id: 'nexus-shield',
    file: 'nexus-shield.html',
    badge: 'CYBER DEFENSE',
    category: 'Cloud & DevTools',
    title: 'Nexus Shield — Threat Interception',
    desc: 'Zero-trust cybersecurity dashboard and live packet telemetry.',
    accentColor: '#f59e0b',
  },
  {
    id: 'ajith-kumar-racing',
    file: 'ajith-kumar-racing.html',
    badge: 'VOLT-X HYPERDRIVE',
    category: 'Motorsport & High-Perf',
    title: 'Ajith Kumar Racing — Portal',
    desc: 'Championship motorsport portal with live lap timing analytics.',
    accentColor: '#ff2a14',
  },
  {
    id: 'atelier-vauquelin',
    file: 'atelier-vauquelin.html',
    badge: 'SPATIAL MONOGRAPH',
    category: 'Healthcare & Architecture',
    title: 'Atelier Vauquelin — Architecture',
    desc: 'Architectural studio showcase with spatial project monographs.',
    accentColor: '#d97706',
  },
  {
    id: 'kinetix-studio',
    file: 'kinetix-studio.html',
    badge: 'NEURAL VFX SUITE',
    category: 'Cloud & DevTools',
    title: 'Kinetix Studio — Cloud Video',
    desc: 'Browser-based video editing and neural VFX compositor.',
    accentColor: '#ec4899',
  },
  {
    id: 'the-hidden-sanctuary',
    file: 'the-hidden-sanctuary.html',
    badge: '3D SPATIAL ARCHITECTURE',
    category: 'Healthcare & Architecture',
    title: 'The Hidden Sanctuary — Spatial',
    desc: 'Three-dimensional spatial environment with dynamic lighting.',
    accentColor: '#06b6d4',
  },
];

const CATEGORIES = [
  'All Projects',
  'Motorsport & High-Perf',
  'Aviation & Automotive',
  'Cloud & DevTools',
  'Healthcare & Architecture',
];

export function WorkOverlay({ closeModalSignal, onHover, onSelectProject, onModalStateChange }: WorkOverlayProps) {
  const [selectedCategory, setSelectedCategory] = useState('All Projects');
  const [modalCategory, setModalCategory] = useState('All');
  const [activeModalApp, setActiveModalApp] = useState<ProjectItem | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const modalIframeRef = useRef<HTMLIFrameElement>(null);
  const modalBackdropRef = useRef<HTMLDivElement>(null);

  // Close modal ONLY when user explicitly clicks a navigation link in NavigationHUD
  const prevSignalRef = useRef(closeModalSignal);
  useEffect(() => {
    if (closeModalSignal !== undefined && closeModalSignal !== prevSignalRef.current) {
      prevSignalRef.current = closeModalSignal;
      if (activeModalApp) {
        setActiveModalApp(null);
      }
    }
  }, [closeModalSignal, activeModalApp]);

  // Manage body scroll lock and overscroll containment when modal opens/closes
  useEffect(() => {
    if (activeModalApp) {
      if (onModalStateChange) onModalStateChange(true);
      const prevOverflow = document.body.style.overflow;
      const prevOverscroll = document.body.style.overscrollBehavior;
      document.body.style.overflow = 'hidden';
      document.body.style.overscrollBehavior = 'contain';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setActiveModalApp(null);
        } else if (e.key === 'ArrowDown') {
          modalIframeRef.current?.contentWindow?.scrollBy({ top: 140, behavior: 'smooth' });
        } else if (e.key === 'ArrowUp') {
          modalIframeRef.current?.contentWindow?.scrollBy({ top: -140, behavior: 'smooth' });
        } else if (e.key === 'PageDown' || e.key === ' ') {
          modalIframeRef.current?.contentWindow?.scrollBy({ top: 400, behavior: 'smooth' });
        } else if (e.key === 'PageUp') {
          modalIframeRef.current?.contentWindow?.scrollBy({ top: -400, behavior: 'smooth' });
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        if (onModalStateChange) onModalStateChange(false);
        document.body.style.overflow = prevOverflow;
        document.body.style.overscrollBehavior = prevOverscroll;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [activeModalApp, onModalStateChange]);

  // Trap all wheel events natively on the modal so they NEVER leak to the page or Lenis
  useEffect(() => {
    const el = modalBackdropRef.current;
    if (!el || !activeModalApp) return;

    const onWheel = (e: WheelEvent) => {
      e.stopPropagation();
      // Only scroll the iframe if event wasn't directly within the side menu scrollable area
      const target = e.target as HTMLElement | null;
      const isInsideScrollableSidebar = target?.closest('#modal-projects-sidebar');
      if (!isInsideScrollableSidebar) {
        e.preventDefault();
        if (modalIframeRef.current?.contentWindow) {
          try {
            modalIframeRef.current.contentWindow.scrollBy({ top: e.deltaY, behavior: 'auto' });
          } catch {
            // Same-origin safe
          }
        }
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
    };
  }, [activeModalApp]);

  const scrollModalApp = useCallback((deltaY: number) => {
    if (modalIframeRef.current?.contentWindow) {
      try {
        modalIframeRef.current.contentWindow.scrollBy({ top: deltaY, behavior: 'smooth' });
      } catch (err) {
        console.warn('Could not scroll modal iframe', err);
      }
    }
  }, []);

  const resetModalAppScroll = useCallback(() => {
    if (modalIframeRef.current?.contentWindow) {
      try {
        modalIframeRef.current.contentWindow.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        console.warn('Could not reset modal iframe scroll', err);
      }
    }
  }, []);

  const handleModalWheel = useCallback((e: React.WheelEvent) => {
    e.stopPropagation();
    if (modalIframeRef.current?.contentWindow) {
      try {
        modalIframeRef.current.contentWindow.scrollBy({ top: e.deltaY, behavior: 'auto' });
      } catch {
        // Same-origin allows scrollBy
      }
    }
  }, []);

  const handleIframeLoad = useCallback(() => {
    try {
      const doc = modalIframeRef.current?.contentDocument;
      if (doc) {
        doc.documentElement.style.overscrollBehavior = 'contain';
        doc.body.style.overscrollBehavior = 'contain';
      }
    } catch {
      // Cross-origin fallback safety
    }
  }, []);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All Projects') return INTERACTIVE_PROJECTS;
    return INTERACTIVE_PROJECTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  const filteredModalProjects = useMemo(() => {
    if (modalCategory === 'All') return INTERACTIVE_PROJECTS;
    return INTERACTIVE_PROJECTS.filter((p) => p.category.toLowerCase().includes(modalCategory.toLowerCase()));
  }, [modalCategory]);

  return (
    <section id="projects" className={styles['section-stage']} aria-label="Featured Interactive Works">
      <div className={styles['work']}>
        {/* Section Header */}
        <div className={styles['work__header']}>
          <div className={styles['work__kicker']}>FEATURED PORTFOLIO // PRODUCTION APPLICATIONS</div>
          <h2 className={styles['work__title']}>Interactive Works & Enterprise Systems</h2>
          <p className={styles['work__desc']}>
            Production-grade interactive web applications, real-time telemetry dashboards, 3D WebGL
            configurators, and enterprise cloud portals designed and engineered with full accessibility,
            zero layout shift, and sub-50ms interaction latency.
          </p>
        </div>

        {/* Category Navigation Filter Pills */}
        <div className={styles['work__nav-tabs']} role="tablist" aria-label="Project Categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={selectedCategory === cat}
              className={`${styles['work__tab-btn']} ${
                selectedCategory === cat ? styles['work__tab-btn--active'] : ''
              }`}
              onClick={() => {
                setSelectedCategory(cat);
                if (onHover) onHover();
              }}
              onMouseEnter={onHover}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Interactive Case Study Cards Grid */}
        <div className={styles['work__cards-grid']} role="list">
          {filteredProjects.map((project) => (
            <GlassCard
              key={project.id}
              interactive
              id={`work-card-${project.id}`}
              className={styles['work__item-card']}
              style={{
                borderColor: activeModalApp?.id === project.id ? `${project.accentColor}` : undefined,
              }}
              onMouseEnter={() => {
                if (onHover) onHover();
                if (onSelectProject) onSelectProject(project.id);
              }}
            >
              <div className={styles['work__card-body']}>
                <div className={styles['work__card-kicker']}>
                  <span className={styles['work__card-badge']} style={{ color: project.accentColor }}>
                    <span
                      className={styles['work__badge-dot']}
                      style={{ backgroundColor: project.accentColor, boxShadow: `0 0 6px ${project.accentColor}` }}
                      aria-hidden="true"
                    />
                    {project.badge}
                  </span>
                  <span className={styles['work__card-cat']}>{project.category}</span>
                </div>

                <h3 className={styles['work__card-title']}>{project.title}</h3>

                <p className={styles['work__card-text']}>{project.desc}</p>
              </div>

              {/* Action Buttons: Preview opens Modal with project selector dropdown */}
              <div className={styles['work__card-actions']}>
                <button
                  type="button"
                  id={`preview-modal-${project.id}`}
                  className={`${styles['work__btn']} ${styles['work__btn--primary']}`}
                  style={{
                    background: `linear-gradient(135deg, ${project.accentColor} 0%, rgba(0, 229, 255, 0.85) 100%)`,
                  }}
                  onClick={() => {
                    setActiveModalApp(project);
                    if (onSelectProject) onSelectProject(project.id);
                  }}
                  onMouseEnter={onHover}
                  aria-label={`Preview ${project.title} in interactive modal`}
                >
                  <span>Preview</span>
                  <span aria-hidden="true">▶</span>
                </button>

                <a
                  href={`${import.meta.env.BASE_URL}works/${project.file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles['work__btn']} ${styles['work__btn--secondary']}`}
                  onMouseEnter={onHover}
                  aria-label={`Open ${project.title} in new window`}
                  title="Open project in new browser tab"
                >
                  <span>New Tab</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Live Interactive Multi-Project Application Modal with Side Menu */}
      {activeModalApp && (
        <div
          ref={modalBackdropRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="active-modal-app-title"
          data-lenis-prevent="true"
          data-lenis-prevent-wheel="true"
          data-lenis-prevent-touch="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 400,
            background: 'rgba(3, 7, 18, 0.92)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '76px 16px 14px 16px',
            pointerEvents: 'auto',
            overscrollBehavior: 'contain',
          }}
          onClick={() => setActiveModalApp(null)}
          onWheel={handleModalWheel}
        >
          <div
            data-lenis-prevent="true"
            data-lenis-prevent-wheel="true"
            data-lenis-prevent-touch="true"
            style={{
              width: '100%',
              maxWidth: '1600px',
              height: 'calc(100vh - 90px)',
              background: '#070b14',
              border: `1px solid ${activeModalApp.accentColor}60`,
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: `0 25px 80px rgba(0,0,0,0.95), 0 0 60px ${activeModalApp.accentColor}25`,
              overflow: 'hidden',
              overscrollBehavior: 'contain',
            }}
            onClick={(e) => e.stopPropagation()}
            onWheel={handleModalWheel}
          >
            {/* Dedicated App Preview Separate Topbar */}
            <div
              id="app-preview-topbar"
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(9, 14, 25, 0.98)',
                borderBottom: `1px solid ${activeModalApp.accentColor}40`,
                flexShrink: 0,
                boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
              }}
            >
              {/* Primary Topbar Row */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '9px 16px',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}
              >
                {/* Left Side: Preview Identity & Project Switcher Dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  {/* APP PREVIEW Indicator Badge */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '7px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                    }}
                  >
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: activeModalApp.accentColor,
                        boxShadow: `0 0 8px ${activeModalApp.accentColor}`,
                        display: 'inline-block',
                      }}
                      aria-hidden="true"
                    />
                    <span
                      style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        color: '#cbd5e1',
                      }}
                    >
                      APP PREVIEW
                    </span>
                  </div>

                  {/* Project Dropdown Selector with all projects */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <label
                      htmlFor="modal-project-dropdown"
                      style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: activeModalApp.accentColor,
                        letterSpacing: '0.06em',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      SWITCH PROJECT:
                    </label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <select
                        id="modal-project-dropdown"
                        value={activeModalApp.id}
                        onChange={(e) => {
                          const selected = INTERACTIVE_PROJECTS.find((p) => p.id === e.target.value);
                          if (selected) {
                            setActiveModalApp(selected);
                            if (onSelectProject) onSelectProject(selected.id);
                          }
                        }}
                        aria-label="Select interactive project to preview"
                        style={{
                          appearance: 'none',
                          WebkitAppearance: 'none',
                          background: 'rgba(15, 23, 42, 0.95)',
                          border: `1px solid ${activeModalApp.accentColor}`,
                          color: '#ffffff',
                          fontFamily: 'Plus Jakarta Sans, sans-serif',
                          fontWeight: 700,
                          fontSize: '0.84rem',
                          padding: '5px 30px 5px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          boxShadow: `0 0 12px ${activeModalApp.accentColor}25`,
                          minWidth: '220px',
                          maxWidth: '380px',
                          outline: 'none',
                        }}
                      >
                        {INTERACTIVE_PROJECTS.map((project, idx) => (
                          <option
                            key={project.id}
                            value={project.id}
                            style={{ background: '#0a101d', color: '#ffffff', padding: '8px' }}
                          >
                            {idx + 1}. {project.title} — {project.badge}
                          </option>
                        ))}
                      </select>
                      <span
                        style={{
                          position: 'absolute',
                          right: '10px',
                          pointerEvents: 'none',
                          fontSize: '0.62rem',
                          color: activeModalApp.accentColor,
                        }}
                        aria-hidden="true"
                      >
                        ▼
                      </span>
                    </div>

                    {/* Prev / Next Cycle Controls */}
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '6px',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        overflow: 'hidden',
                      }}
                    >
                      <button
                        type="button"
                        title="Previous project"
                        aria-label="Previous project"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#e2e8f0',
                          padding: '4px 7px',
                          fontSize: '0.7rem',
                          cursor: 'pointer',
                          fontFamily: 'JetBrains Mono, monospace',
                        }}
                        onClick={() => {
                          const currIdx = INTERACTIVE_PROJECTS.findIndex((p) => p.id === activeModalApp.id);
                          const prevIdx = (currIdx - 1 + INTERACTIVE_PROJECTS.length) % INTERACTIVE_PROJECTS.length;
                          setActiveModalApp(INTERACTIVE_PROJECTS[prevIdx]);
                        }}
                      >
                        ◀
                      </button>
                      <span style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.15)' }} />
                      <button
                        type="button"
                        title="Next project"
                        aria-label="Next project"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#e2e8f0',
                          padding: '4px 7px',
                          fontSize: '0.7rem',
                          cursor: 'pointer',
                          fontFamily: 'JetBrains Mono, monospace',
                        }}
                        onClick={() => {
                          const currIdx = INTERACTIVE_PROJECTS.findIndex((p) => p.id === activeModalApp.id);
                          const nextIdx = (currIdx + 1) % INTERACTIVE_PROJECTS.length;
                          setActiveModalApp(INTERACTIVE_PROJECTS[nextIdx]);
                        }}
                      >
                        ▶
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Side: In-App Scroll Controls & Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {/* Scroll controls */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '6px',
                      padding: '2px',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                    }}
                  >
                    <button
                      type="button"
                      id="modal-scroll-up-btn"
                      title="Scroll preview up"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#e2e8f0',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '0.7rem',
                        padding: '4px 8px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                      onClick={() => scrollModalApp(-350)}
                    >
                      <span aria-hidden="true">▲</span>
                      <span>Up</span>
                    </button>
                    <span style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.15)' }} />
                    <button
                      type="button"
                      id="modal-scroll-down-btn"
                      title="Scroll preview down"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#e2e8f0',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '0.7rem',
                        padding: '4px 8px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                      onClick={() => scrollModalApp(350)}
                    >
                      <span aria-hidden="true">▼</span>
                      <span>Down</span>
                    </button>
                    <span style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.15)' }} />
                    <button
                      type="button"
                      id="modal-scroll-top-btn"
                      title="Reset scroll to top"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#94a3b8',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '0.7rem',
                        padding: '4px 8px',
                        cursor: 'pointer',
                      }}
                      onClick={resetModalAppScroll}
                    >
                      Top
                    </button>
                  </div>

                  {/* Toggle Side Directory */}
                  <button
                    type="button"
                    id="modal-toggle-sidebar-btn"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '5px 10px',
                      borderRadius: '6px',
                      background: isSidebarOpen ? `${activeModalApp.accentColor}25` : 'rgba(255, 255, 255, 0.06)',
                      border: `1px solid ${isSidebarOpen ? activeModalApp.accentColor : 'rgba(255, 255, 255, 0.15)'}`,
                      color: '#ffffff',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                    onClick={() => setIsSidebarOpen((prev) => !prev)}
                    title={isSidebarOpen ? 'Hide directory menu' : 'Show directory menu'}
                  >
                    <span aria-hidden="true">{isSidebarOpen ? '◀' : '☰'}</span>
                    <span>{isSidebarOpen ? 'Hide Menu' : 'Side Menu'}</span>
                  </button>

                  {/* Open in New Tab */}
                  <a
                    href={`${import.meta.env.BASE_URL}works/${activeModalApp.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '5px 10px',
                      borderRadius: '6px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.16)',
                      color: '#ffffff',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '0.72rem',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                    title="Open standalone web application in new tab"
                  >
                    <span>New Tab</span>
                    <span aria-hidden="true">↗</span>
                  </a>

                  {/* Close Preview Button */}
                  <button
                    type="button"
                    id="close-modal-app-btn"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '5px 12px',
                      borderRadius: '6px',
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid #ef4444',
                      color: '#ffffff',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      fontWeight: 700,
                    }}
                    onClick={() => setActiveModalApp(null)}
                    title="Close preview modal and return to page [ESC]"
                  >
                    <span aria-hidden="true">✕</span>
                    <span>CLOSE [ESC]</span>
                  </button>
                </div>
              </div>

              {/* Secondary Sub-Topbar: Project Title, Badge, and Runtime Spec */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '5px 16px',
                  background: 'rgba(5, 8, 16, 0.95)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.68rem',
                  color: '#94a3b8',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h3
                    id="active-modal-app-title"
                    style={{
                      margin: 0,
                      color: '#ffffff',
                      fontWeight: 700,
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      fontSize: '0.84rem',
                    }}
                  >
                    {activeModalApp.title}
                  </h3>
                  <span
                    style={{
                      color: activeModalApp.accentColor,
                      padding: '1px 6px',
                      borderRadius: '4px',
                      background: `${activeModalApp.accentColor}18`,
                      border: `1px solid ${activeModalApp.accentColor}40`,
                      fontSize: '0.62rem',
                    }}
                  >
                    {activeModalApp.badge}
                  </span>
                  <span>//</span>
                  <span style={{ color: '#cbd5e1' }}>{activeModalApp.category}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.64rem' }}>
                  <span style={{ color: '#10b981' }}>● LIVE SANDBOX</span>
                  <span>/works/{activeModalApp.file}</span>
                </div>
              </div>
            </div>

            {/* Modal Body: Left Projects Side Menu + Right Website Viewport */}
            <div
              style={{
                display: 'flex',
                flex: '1 1 0%',
                minHeight: 0,
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Projects Side Menu */}
              {isSidebarOpen && (
                <aside
                  id="modal-projects-sidebar"
                  data-lenis-prevent="true"
                  style={{
                    width: '320px',
                    flexShrink: 0,
                    background: '#070c17',
                    borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    zIndex: 10,
                  }}
                >
                  {/* Sidebar Header & Categories */}
                  <div
                    style={{
                      padding: '12px 14px 10px 14px',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                      background: 'rgba(10, 16, 28, 0.85)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: '#00e5ff',
                          letterSpacing: '0.06em',
                        }}
                      >
                        PROJECTS DIRECTORY ({INTERACTIVE_PROJECTS.length})
                      </span>
                      <span
                        style={{
                          fontSize: '0.64rem',
                          color: '#64748b',
                          fontFamily: 'JetBrains Mono, monospace',
                        }}
                      >
                        CLICK TO LOAD
                      </span>
                    </div>

                    {/* Category Filter Pills inside Side Menu */}
                    <div
                      style={{
                        display: 'flex',
                        gap: '4px',
                        overflowX: 'auto',
                        paddingBottom: '2px',
                      }}
                    >
                      {['All', 'Motorsport', 'Aviation', 'Cloud', 'Healthcare'].map((catKey) => {
                        const isCatActive =
                          catKey === 'All'
                            ? modalCategory === 'All'
                            : modalCategory.toLowerCase().includes(catKey.toLowerCase());
                        return (
                          <button
                            key={catKey}
                            type="button"
                            style={{
                              background: isCatActive ? 'rgba(0, 229, 255, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                              border: `1px solid ${isCatActive ? '#00e5ff' : 'rgba(255, 255, 255, 0.08)'}`,
                              color: isCatActive ? '#ffffff' : '#94a3b8',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontSize: '0.64rem',
                              fontFamily: 'JetBrains Mono, monospace',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                            }}
                            onClick={() => {
                              if (catKey === 'All') setModalCategory('All');
                              else {
                                const matchedCat = CATEGORIES.find((c) =>
                                  c.toLowerCase().includes(catKey.toLowerCase())
                                );
                                setModalCategory(matchedCat || catKey);
                              }
                            }}
                          >
                            {catKey}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Scrollable Project Items List */}
                  <div
                    data-lenis-prevent="true"
                    style={{
                      flex: 1,
                      overflowY: 'auto',
                      padding: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '5px',
                    }}
                  >
                    {filteredModalProjects.map((project, idx) => {
                      const isActive = activeModalApp.id === project.id;
                      return (
                        <button
                          key={project.id}
                          type="button"
                          id={`sidebar-project-item-${project.id}`}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            background: isActive
                              ? `linear-gradient(90deg, ${project.accentColor}25 0%, rgba(15, 23, 42, 0.9) 100%)`
                              : 'rgba(255, 255, 255, 0.02)',
                            border: `1px solid ${isActive ? project.accentColor : 'rgba(255, 255, 255, 0.06)'}`,
                            borderLeft: `4px solid ${isActive ? project.accentColor : 'transparent'}`,
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.15s ease',
                            position: 'relative',
                            width: '100%',
                          }}
                          onClick={() => {
                            setActiveModalApp(project);
                            if (onSelectProject) onSelectProject(project.id);
                            if (onHover) onHover();
                          }}
                          onMouseEnter={onHover}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              width: '100%',
                              marginBottom: '3px',
                            }}
                          >
                            <span
                              style={{
                                fontFamily: 'JetBrains Mono, monospace',
                                fontSize: '0.62rem',
                                color: project.accentColor,
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                              }}
                            >
                              <span
                                style={{
                                  width: '6px',
                                  height: '6px',
                                  borderRadius: '50%',
                                  backgroundColor: project.accentColor,
                                  boxShadow: isActive ? `0 0 8px ${project.accentColor}` : 'none',
                                }}
                              />
                              {project.badge}
                            </span>
                            <span
                              style={{
                                fontFamily: 'JetBrains Mono, monospace',
                                fontSize: '0.62rem',
                                color: isActive ? '#00e5ff' : '#64748b',
                              }}
                            >
                              0{idx + 1}
                            </span>
                          </div>

                          <div
                            style={{
                              fontFamily: 'Plus Jakarta Sans, sans-serif',
                              fontSize: '0.85rem',
                              fontWeight: isActive ? 700 : 600,
                              color: isActive ? '#ffffff' : '#cbd5e1',
                              lineHeight: 1.25,
                              marginBottom: '2px',
                            }}
                          >
                            {project.title}
                          </div>

                          <div
                            style={{
                              fontFamily: 'JetBrains Mono, monospace',
                              fontSize: '0.64rem',
                              color: '#94a3b8',
                            }}
                          >
                            {project.category}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </aside>
              )}

              {/* Right: Active Project Website (Iframe) */}
              <div
                data-lenis-prevent="true"
                data-lenis-prevent-wheel="true"
                data-lenis-prevent-touch="true"
                style={{
                  flex: '1 1 0%',
                  minHeight: 0,
                  minWidth: 0,
                  height: '100%',
                  position: 'relative',
                  background: '#000000',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  overscrollBehavior: 'contain',
                }}
              >
                <iframe
                  ref={modalIframeRef}
                  key={activeModalApp.id}
                  src={`${import.meta.env.BASE_URL}works/${activeModalApp.file}`}
                  title={activeModalApp.title}
                  data-lenis-prevent="true"
                  onLoad={handleIframeLoad}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    display: 'block',
                    backgroundColor: '#000000',
                    flex: 1,
                  }}
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
