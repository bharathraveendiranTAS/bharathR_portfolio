import { useRef, useCallback, useState } from 'react';
import { usePortfolioAudio } from '../shared/hooks/usePortfolioAudio';
import { useScrollOrchestrator } from '../shared/hooks/useScrollOrchestrator';
import { NavigationHUD } from '../shared/components/NavigationHUD';
import { AudioConsentPill } from '../shared/components/AudioConsentPill';
import { SceneCanvas } from '../features/canvas-world/SceneCanvas';
import { HeroOverlay } from '../features/dom-sections/HeroOverlay';
import { AboutOverlay } from '../features/dom-sections/AboutOverlay';
import { WorkOverlay } from '../features/dom-sections/WorkOverlay';
import { SkillsOverlay } from '../features/dom-sections/SkillsOverlay';
import { ContactOverlay } from '../features/dom-sections/ContactOverlay';
import styles from './App.module.scss';

export default function App() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const audio = usePortfolioAudio();

  const handleVelocity = useCallback(
    (vel: number) => {
      audio.onScrollVelocity(vel);
    },
    [audio]
  );

  const handleSectionChange = useCallback(
    (_prev: number, next: number) => {
      if (next === 2) {
        audio.playChakraPulse();
      } else if (next === 4) {
        audio.playTempleBell();
      } else {
        audio.playKunaiTap();
      }
    },
    [audio]
  );

  const {
    scrollProgress,
    activeSection,
    isReducedMotion,
    scrollToSection,
    pauseScroll,
    resumeScroll,
  } = useScrollOrchestrator({
    containerRef,
    onVelocityChange: handleVelocity,
    onSectionChange: handleSectionChange,
  });

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  }, []);

  const [closeModalSignal, setCloseModalSignal] = useState(0);

  const handleNavigate = useCallback(
    (idx: number) => {
      audio.playBambooClick();
      scrollToSection(idx);
      setCloseModalSignal((prev) => prev + 1);
    },
    [audio, scrollToSection]
  );

  const handle3DHover = useCallback(
    (_type: string) => {
      audio.playMetallicSheen();
    },
    [audio]
  );

  const handle3DClick = useCallback(
    (type: string) => {
      audio.playChakraPulse();
      showToast(`Activated 3D interactive relic: ${type}`);
    },
    [audio, showToast]
  );

  return (
    <div className={styles['app-viewport']}>
      {/* 1. Global Navigation HUD & Scroll Progress Bar */}
      <NavigationHUD
        activeSection={activeSection}
        scrollProgress={scrollProgress}
        onNavigate={handleNavigate}
        onHover={audio.playMetallicSheen}
      />

      {/* 2. Audio Consent & Visualizer Toggle Pill */}
      <AudioConsentPill
        soundEnabled={audio.soundEnabled}
        onToggle={audio.toggleSound}
        onHover={audio.playMetallicSheen}
      />

      {/* 3. Persistent 3D Three.js WebGL Scene Canvas */}
      <div className={styles['canvas-container']}>
        <SceneCanvas
          progress={scrollProgress}
          isReducedMotion={isReducedMotion}
          onHoverItem={handle3DHover}
          onClickItem={handle3DClick}
        />
      </div>

      {/* 4. Film Grain Texture & Soft Vignette Shaders */}
      <div className={styles['background-grain']} aria-hidden="true" />
      <div className={styles['vignette']} aria-hidden="true" />

      {/* 5. Continuous Scroll Container Driving GSAP ScrollTrigger */}
      <div ref={containerRef} className={styles['scroll-container']}>
        {/* Stage 0: Hero (The Awakening) */}
        <div className={styles['interactive-layer']}>
          <HeroOverlay
            onScrollClick={() => handleNavigate(1)}
            onHover={audio.playMetallicSheen}
          />
        </div>

        {/* Stage 1: About (The Hidden Sanctuary) */}
        <div className={styles['interactive-layer']}>
          <AboutOverlay
            onHover={audio.playMetallicSheen}
            onActionClick={showToast}
          />
        </div>

        {/* Stage 2: Featured Interactive Works & Applications */}
        <div className={styles['interactive-layer']}>
          <WorkOverlay
            closeModalSignal={closeModalSignal}
            onHover={audio.playMetallicSheen}
            onSelectProject={(id) => {
              audio.playChakraPulse();
              showToast(`Selected Project // ${id}`);
            }}
            onModalStateChange={(isOpen) => (isOpen ? pauseScroll() : resumeScroll())}
          />
        </div>

        {/* Stage 3: Skills & Architecture */}
        <div className={styles['interactive-layer']}>
          <SkillsOverlay
            onHover={audio.playMetallicSheen}
            onSelectSkill={(skill) => {
              audio.playKunaiTap();
              showToast(`Selected Skill: ${skill}`);
            }}
          />
        </div>

        {/* Stage 4: Contact & Inquiries */}
        <div className={styles['interactive-layer']}>
          <ContactOverlay
            onHover={audio.playMetallicSheen}
            onSubmitContact={(name) => {
              audio.playTempleBell();
              showToast(`Inquiry transmitted by ${name}`);
            }}
          />
        </div>

        {/* Portfolio Footer & Design Credits */}
        <footer className={styles['footer-credits']}>
          <p>
            ENGINEERED WITH <span>PERFORMANCE & ACCESSIBILITY</span> // BHARATH KUMAR © 2026
          </p>
          <p style={{ opacity: 0.65 }}>
            REACT 19 • THREE.JS • R3F • GSAP SCROLLTRIGGER • LENIS • NATIVE WEB AUDIO API • WCAG 2.2 AA
          </p>
        </footer>
      </div>

      {/* Global Interactive HUD Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            bottom: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            padding: '10px 22px',
            borderRadius: '9999px',
            background: 'rgba(7, 10, 18, 0.95)',
            border: '1px solid #00e5ff',
            color: '#ffffff',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.8rem',
            boxShadow: '0 0 25px rgba(0, 229, 255, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span style={{ color: '#00e5ff' }}>⚡</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
