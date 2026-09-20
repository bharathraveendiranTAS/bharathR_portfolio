import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export interface ScrollOrchestratorOptions {
  containerRef: React.RefObject<HTMLDivElement | null>;
  onVelocityChange?: (velocity: number) => void;
  onSectionChange?: (prev: number, next: number) => void;
  onWorkSubProgress?: (prog: number) => void;
}

export interface ScrollOrchestratorState {
  scrollProgress: number; // 0.0 to 1.0
  activeSection: number; // 0: Hero, 1: About, 2: Work, 3: Skills, 4: Contact
  velocity: number;
  isReducedMotion: boolean;
  scrollToSection: (sectionIndex: number) => void;
  pauseScroll: () => void;
  resumeScroll: () => void;
  lenisInstance: Lenis | null;
}

export function useScrollOrchestrator({
  containerRef,
  onVelocityChange,
  onSectionChange,
  onWorkSubProgress,
}: ScrollOrchestratorOptions): ScrollOrchestratorState {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const activeSectionRef = useRef<number>(0);

  // Check prefers-reduced-motion media query
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Initialize Lenis inertia smooth scrolling synced with GSAP ticker
  useEffect(() => {
    if (isReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [isReducedMotion]);

  // Master GSAP ScrollTrigger timeline declaration bound strictly to containerRef scope
  useGSAP(
    () => {
      if (!containerRef.current || isReducedMotion) return;

      const trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.8,
        onUpdate: (self) => {
          const prog = self.progress; // 0 to 1
          setScrollProgress(prog);

          const vel = self.getVelocity();
          setVelocity(vel);
          if (onVelocityChange) {
            onVelocityChange(vel);
          }

          // 5 continuous stages: [0: Hero (0-0.2), 1: About (0.2-0.4), 2: Work (0.4-0.65), 3: Skills (0.65-0.85), 4: Contact (0.85-1.0)]
          let currentSec = 0;
          if (prog < 0.2) {
            currentSec = 0;
          } else if (prog < 0.4) {
            currentSec = 1;
          } else if (prog < 0.65) {
            currentSec = 2;
          } else if (prog < 0.85) {
            currentSec = 3;
          } else {
            currentSec = 4;
          }

          if (currentSec !== activeSectionRef.current) {
            if (onSectionChange) {
              onSectionChange(activeSectionRef.current, currentSec);
            }
            activeSectionRef.current = currentSec;
            setActiveSection(currentSec);
          }

          // Calculate work sub-progress inside Work zone (0.4 to 0.65)
          if (onWorkSubProgress) {
            if (prog >= 0.38 && prog <= 0.67) {
              const subProg = Math.max(0, Math.min(1, (prog - 0.4) / 0.25));
              onWorkSubProgress(subProg);
            }
          }
        },
      });

      return () => {
        trigger.kill();
      };
    },
    { scope: containerRef, dependencies: [isReducedMotion] }
  );

  const scrollToSection = useCallback((sectionIndex: number) => {
    const sectionIds = ['home', 'about', 'projects', 'skills', 'contact'];
    const targetId = sectionIds[Math.max(0, Math.min(sectionIds.length - 1, sectionIndex))];
    const targetEl = document.getElementById(targetId);

    if (targetEl) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(targetEl, { duration: 1.4, offset: -24 });
      } else {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (!containerRef.current) return;
    const totalScroll = containerRef.current.scrollHeight - window.innerHeight;
    const sectionRatios = [0.0, 0.25, 0.52, 0.75, 0.98];
    const targetRatio = sectionRatios[Math.max(0, Math.min(4, sectionIndex))];
    const targetScrollY = totalScroll * targetRatio;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(targetScrollY, { duration: 1.4 });
    } else {
      window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
    }
  }, [containerRef]);

  const pauseScroll = useCallback(() => {
    if (lenisRef.current) {
      lenisRef.current.stop();
    }
  }, []);

  const resumeScroll = useCallback(() => {
    if (lenisRef.current) {
      lenisRef.current.start();
    }
  }, []);

  return {
    scrollProgress,
    activeSection,
    velocity,
    isReducedMotion,
    scrollToSection,
    pauseScroll,
    resumeScroll,
    lenisInstance: lenisRef.current,
  };
}
