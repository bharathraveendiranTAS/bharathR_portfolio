import { useState, useRef, RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register plugins safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface UseShowcaseScrollOptions {
  containerRef: RefObject<HTMLElement | null>;
  onVelocityChange?: (velocity: number) => void;
  onPageTurnSFX?: () => void;
  onChakraSFX?: () => void;
}

export interface ShowcaseScrollState {
  progress: number; // 0 to 1 overall progress
  activeStage: number; // 0, 1, or 2
  stageProgress: number; // 0 to 1 within active stage
  bookOpenProgress: number; // 0 to 1 for book cover & page turn
  isReducedMotion: boolean;
  scrollToStage: (stageIndex: number) => void;
}

export function useShowcaseScroll({
  containerRef,
  onVelocityChange,
  onPageTurnSFX,
  onChakraSFX,
}: UseShowcaseScrollOptions): ShowcaseScrollState {
  const [progress, setProgress] = useState<number>(0);
  const [activeStage, setActiveStage] = useState<number>(0);
  const [stageProgress, setStageProgress] = useState<number>(0);
  const [bookOpenProgress, setBookOpenProgress] = useState<number>(0);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);

  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const lastActiveStageRef = useRef<number>(0);

  // Check prefers-reduced-motion
  useGSAP(
    () => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setIsReducedMotion(mediaQuery.matches);

      const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
      mediaQuery.addEventListener('change', handler);

      if (mediaQuery.matches) {
        return () => mediaQuery.removeEventListener('change', handler);
      }

      if (!containerRef.current) return;

      const trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: 1.0,
        anticipatePin: 1,
        onUpdate: (self) => {
          const currentProg = self.progress;
          setProgress(currentProg);

          // Calculate current stage: 0 (0-0.33), 1 (0.33-0.66), 2 (0.66-1.0)
          let stage = 0;
          let subProg = 0;

          if (currentProg < 0.333) {
            stage = 0;
            subProg = currentProg / 0.333;
          } else if (currentProg < 0.666) {
            stage = 1;
            subProg = (currentProg - 0.333) / 0.333;
          } else {
            stage = 2;
            subProg = Math.min((currentProg - 0.666) / 0.334, 1);
          }

          setActiveStage(stage);
          setStageProgress(subProg);

          // Calculate book opening and page turning interpolation (Stage 1)
          if (currentProg >= 0.28 && currentProg <= 0.72) {
            const bookProg = (currentProg - 0.28) / (0.72 - 0.28);
            setBookOpenProgress(Math.min(Math.max(bookProg, 0), 1));
          } else if (currentProg < 0.28) {
            setBookOpenProgress(0);
          } else {
            setBookOpenProgress(1);
          }

          // Sound triggers on stage transitions
          if (lastActiveStageRef.current !== stage) {
            if (stage === 1 && onPageTurnSFX) {
              onPageTurnSFX();
            } else if (stage === 2 && onChakraSFX) {
              onChakraSFX();
            }
            lastActiveStageRef.current = stage;
          }

          // Real-time scroll velocity modulation for audio whoosh
          if (onVelocityChange) {
            const vel = self.getVelocity();
            onVelocityChange(vel);
          }
        },
      });

      scrollTriggerRef.current = trigger;

      return () => {
        mediaQuery.removeEventListener('change', handler);
        if (trigger) trigger.kill();
      };
    },
    { scope: containerRef, dependencies: [containerRef, onVelocityChange, onPageTurnSFX, onChakraSFX] }
  );

  const scrollToStage = (stageIndex: number) => {
    if (!scrollTriggerRef.current) return;
    const st = scrollTriggerRef.current;
    const targetProgress = stageIndex === 0 ? 0.05 : stageIndex === 1 ? 0.48 : 0.88;
    const scrollTarget = st.start + targetProgress * (st.end - st.start);

    gsap.to(window, {
      scrollTo: scrollTarget,
      duration: 1.2,
      ease: 'power3.inOut',
    });
  };

  return {
    progress,
    activeStage,
    stageProgress,
    bookOpenProgress,
    isReducedMotion,
    scrollToStage,
  };
}
