import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CameraRig } from './CameraRig';
import { CollectiblePedestal } from './CollectiblePedestal';
import { ArtBookViewer } from './ArtBookViewer';
import { ChakraStickers } from './ChakraStickers';

interface SceneCanvasProps {
  progress: number;
  bookOpenProgress: number;
  isVisible: boolean; // Managed by IntersectionObserver to pause loop
  onFigureHover?: () => void;
  onFigureClick?: () => void;
  onBookHover?: () => void;
  onBookClick?: () => void;
  onCardHover?: (cardIndex: number) => void;
  onCardClick?: (cardIndex: number) => void;
}

// Ambient Floating Shinobi Embers / Dust Fog
function AmbientFogParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const count = 220;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const cyan = new THREE.Color('#00e5ff');
    const vermilion = new THREE.Color('#ff2a14');

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = Math.random() * 4 - 0.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;

      const c = Math.random() > 0.7 ? vermilion : cyan;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return { positions: pos, colors: col };
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    const posAttr = pointsRef.current.geometry.attributes.position;
    const count = posAttr.count;

    for (let i = 0; i < count; i++) {
      let y = posAttr.getY(i);
      y += delta * 0.12;
      if (y > 3.5) y = -0.5;
      posAttr.setY(i, y);
      posAttr.setX(i, posAttr.getX(i) + Math.sin(time + i) * 0.0015);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export function SceneCanvas({
  progress,
  bookOpenProgress,
  isVisible,
  onFigureHover,
  onFigureClick,
  onBookHover,
  onBookClick,
  onCardHover,
  onCardClick,
}: SceneCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 1.25, 5.2], fov: 42, near: 0.1, far: 50 }}
      dpr={[1, 1.5]}
      frameloop={isVisible ? 'always' : 'never'}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      style={{ width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        {/* Dynamic Camera Spline Rig */}
        <CameraRig progress={progress} />

        {/* Cinematic Studio Lighting */}
        <ambientLight color="#1e293b" intensity={0.65} />

        {/* Key Warm Japanese Lantern Spotlight */}
        <spotLight
          position={[3.5, 5.0, 4.0]}
          angle={0.55}
          penumbra={0.8}
          intensity={2.2}
          color="#fffbeb"
          castShadow
        />

        {/* Rim Cyan Chakra Glow Light */}
        <directionalLight
          position={[-4.0, 3.0, -2.5]}
          intensity={2.8}
          color="#00e5ff"
        />

        {/* Vermilion Accent Fill Light */}
        <pointLight
          position={[0, -0.5, 2.0]}
          intensity={1.2}
          color="#ff2a14"
          distance={6}
        />

        {/* Ambient Fog Particles */}
        <AmbientFogParticles />

        {/* Showcase Anchor 1: Collectible Ninja Figure */}
        <CollectiblePedestal
          progress={progress}
          onHover={onFigureHover}
          onClick={onFigureClick}
        />

        {/* Showcase Anchor 2: Hardbound Art Book & Lore Codex */}
        <ArtBookViewer
          progress={progress}
          bookOpenProgress={bookOpenProgress}
          onHover={onBookHover}
          onClick={onBookClick}
        />

        {/* Showcase Anchor 3: Holographic Sealing Cards */}
        <ChakraStickers
          progress={progress}
          onHoverCard={onCardHover}
          onClickCard={onCardClick}
        />
      </Suspense>
    </Canvas>
  );
}
