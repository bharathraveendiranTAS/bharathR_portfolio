import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { CameraController } from './CameraController';
import { ParticleField } from './ParticleField';
import { HeroNexus } from './sections-3d/HeroNexus';
import { AboutSanctuary } from './sections-3d/AboutSanctuary';
import { WorkShowcase3D } from './sections-3d/WorkShowcase3D';
import { SkillsMatrix3D } from './sections-3d/SkillsMatrix3D';
import { ContactMonolith } from './sections-3d/ContactMonolith';
import { ErrorBoundary } from '../../shared/components/ErrorBoundary';

interface SceneCanvasProps {
  progress: number; // 0.0 to 1.0
  isReducedMotion?: boolean;
  onHoverItem?: (type: string) => void;
  onClickItem?: (type: string) => void;
}

function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export function SceneCanvas({
  progress,
  isReducedMotion = false,
  onHoverItem,
  onClickItem,
}: SceneCanvasProps) {
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  useEffect(() => {
    setWebglSupported(checkWebGLSupport());
  }, []);

  const ambientFallback = (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        background: 'radial-gradient(ellipse at 50% 30%, #0f1c30 0%, #070a12 70%)',
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );

  if (!webglSupported) {
    return ambientFallback;
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'auto',
      }}
      aria-hidden="true"
    >
      <ErrorBoundary fallback={ambientFallback} name="SceneCanvas3D">
        <Canvas
          camera={{ position: [0, 3.8, 8.5], fov: 42, near: 0.1, far: 60 }}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.15,
          }}
        >
          <Suspense fallback={null}>
            {/* Master Spline Camera Controller */}
            <CameraController progress={progress} isReducedMotion={isReducedMotion} />

            {/* Cinematic Studio Lighting Rig */}
            <ambientLight color="#0f172a" intensity={0.8} />

            {/* Primary Warm Key Spotlight */}
            <spotLight
              position={[4.0, 7.0, 5.0]}
              angle={0.58}
              penumbra={0.7}
              intensity={2.6}
              color="#fffbeb"
              castShadow
            />

            {/* Cyan Chakra Rim Light */}
            <directionalLight
              position={[-5.0, 3.5, -3.0]}
              intensity={3.2}
              color="#00e5ff"
            />

            {/* Vermilion Accent Point Light */}
            <pointLight
              position={[0, -0.8, 2.5]}
              intensity={1.5}
              color="#ff2a14"
              distance={7.0}
            />

            {/* Drifting Chakra Particle Field */}
            <ParticleField count={260} />

            {/* Section 1: Hero Gateway */}
            <HeroNexus
              progress={progress}
              onHover={() => onHoverItem && onHoverItem('hero-gateway')}
              onClick={() => onClickItem && onClickItem('hero-gateway')}
            />

            {/* Section 2: About Hidden Sanctuary Island */}
            <AboutSanctuary
              progress={progress}
              onHover={() => onHoverItem && onHoverItem('about-sanctuary')}
              onClick={() => onClickItem && onClickItem('about-sanctuary')}
            />

            {/* Section 3: Featured Interactive Projects Display */}
            <WorkShowcase3D
              progress={progress}
              onHoverItem={onHoverItem}
              onClickItem={onClickItem}
            />

            {/* Section 4: Skills Orbiting Constellation */}
            <SkillsMatrix3D
              progress={progress}
              onHoverRune={(idx) => onHoverItem && onHoverItem(`rune-${idx}`)}
              onClickRune={(idx) => onClickItem && onClickItem(`rune-${idx}`)}
            />

            {/* Section 5: Contact Monolith Terminal */}
            <ContactMonolith
              progress={progress}
              onHover={() => onHoverItem && onHoverItem('contact-monolith')}
              onClick={() => onClickItem && onClickItem('contact-monolith')}
            />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}
