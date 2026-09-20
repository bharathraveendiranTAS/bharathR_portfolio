import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SkillsMatrix3DProps {
  progress: number; // 0 to 1
  onHoverRune?: (runeIndex: number) => void;
  onClickRune?: (runeIndex: number) => void;
}

const RUNES_DATA = [
  { name: 'React 19 & TS', label: 'REACT / TS', color: '#00e5ff', glyph: 'TS' },
  { name: 'Three.js & WebGL', label: '3D / WEBGL', color: '#38bdf8', glyph: '3D' },
  { name: 'WCAG 2.2 AA Auditing', label: 'ACCESSIBILITY', color: '#10b981', glyph: 'A11Y' },
  { name: 'Design Systems', label: 'DESIGN SYSTEM', color: '#f59e0b', glyph: 'SYS' },
  { name: 'GSAP Motion Architecture', label: 'GSAP / MOTION', color: '#ff2a14', glyph: 'GSAP' },
  { name: 'Web Audio API', label: 'WEB AUDIO', color: '#a855f7', glyph: 'WAV' },
  { name: 'Performance Architecture', label: 'ARCHITECTURE', color: '#3b82f6', glyph: 'ARCH' },
  { name: 'Tailwind & SASS BEM', label: 'CSS / TOKENS', color: '#06b6d4', glyph: 'CSS' },
];

export function SkillsMatrix3D({ progress, onHoverRune, onClickRune }: SkillsMatrix3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Group>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Visibility fade (0.60 to 0.88)
  const opacity = useMemo(() => {
    if (progress < 0.60 || progress > 0.88) return 0;
    if (progress >= 0.68 && progress <= 0.82) return 1;
    if (progress < 0.68) return (progress - 0.60) / (0.68 - 0.60);
    return 1 - (progress - 0.82) / (0.88 - 0.82);
  }, [progress]);

  // Procedural canvas textures for the 8 tech badges with clean tech glyphs and titles
  const runeTextures = useMemo(() => {
    return RUNES_DATA.map((rune) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;

      // Obsidian backing
      ctx.fillStyle = '#080c16';
      ctx.fillRect(0, 0, 512, 512);

      // Glowing border
      ctx.strokeStyle = rune.color;
      ctx.lineWidth = 14;
      ctx.strokeRect(20, 20, 472, 472);

      // Inner octagonal border
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 3;
      ctx.strokeRect(40, 40, 432, 432);

      // Center Modern Tech Badge
      ctx.fillStyle = rune.color;
      ctx.font = 'bold 96px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(rune.glyph, 256, 210);

      // Subtitle
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 36px "JetBrains Mono", monospace';
      ctx.fillText(rune.label, 256, 380);

      return new THREE.CanvasTexture(canvas);
    });
  }, []);

  useEffect(() => {
    return () => {
      runeTextures.forEach((t) => t.dispose());
    };
  }, [runeTextures]);

  // Constellation lines positions (connecting ring + hub lines)
  const constellationGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const radius = 2.4;
    const count = RUNES_DATA.length;

    // Outer polygon lines
    for (let i = 0; i < count; i++) {
      const a1 = (i / count) * Math.PI * 2;
      const a2 = ((i + 1) / count) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(a1) * radius, 0, Math.sin(a1) * radius));
      points.push(new THREE.Vector3(Math.cos(a2) * radius, 0, Math.sin(a2) * radius));
    }

    // Spokes to central hub
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      points.push(new THREE.Vector3(0, 0, 0));
      points.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }

    const geom = new THREE.BufferGeometry().setFromPoints(points);
    return geom;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current || opacity <= 0.005) return;
    const time = state.clock.getElapsedTime();

    // Slowly rotate constellation ring
    if (ringRef.current) {
      ringRef.current.rotation.y = time * 0.18;
    }

    // Gentle vertical bobbing
    groupRef.current.position.y = 0.5 + Math.sin(time * 1.5) * 0.05;
  });

  if (opacity <= 0.005) return null;

  const radius = 2.4;
  const count = RUNES_DATA.length;

  return (
    <group
      ref={groupRef}
      position={[0, 0.5, 0]}
      rotation={[0.35, 0, 0]} // High-angle isometric tilt
    >
      {/* Central Constellation Hub Core */}
      <mesh position={[0, 0, 0]}>
        <octahedronGeometry args={[0.45, 0]} />
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={hoveredIdx !== null ? 3.0 : 1.8}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.9 * opacity}
        />
      </mesh>

      <pointLight
        position={[0, 0.2, 0]}
        color={hoveredIdx !== null ? RUNES_DATA[hoveredIdx].color : '#00e5ff'}
        distance={6.0}
        intensity={2.5 * opacity}
      />

      {/* Orbiting Constellation Ring of 8 Runes */}
      <group ref={ringRef}>
        {/* Glowing Constellation Lines */}
        <lineSegments geometry={constellationGeometry}>
          <lineBasicMaterial
            color="#00e5ff"
            transparent
            opacity={0.35 * opacity}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>

        {RUNES_DATA.map((rune, idx) => {
          const angle = (idx / count) * Math.PI * 2;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const isHovered = hoveredIdx === idx;

          return (
            <group
              key={rune.name}
              position={[x, 0, z]}
              onPointerOver={() => {
                setHoveredIdx(idx);
                if (onHoverRune) onHoverRune(idx);
              }}
              onPointerOut={() => setHoveredIdx(null)}
              onClick={() => onClickRune && onClickRune(idx)}
            >
              {/* Rune Crystal Badge Face */}
              <mesh rotation={[0, -angle + Math.PI / 2, 0]}>
                <boxGeometry args={[0.55, 0.55, 0.08]} />
                <meshStandardMaterial
                  map={runeTextures[idx]}
                  metalness={0.8}
                  roughness={0.2}
                  transparent
                  opacity={opacity}
                />
              </mesh>

              {/* Holographic Glowing Frame Trim */}
              <mesh rotation={[0, -angle + Math.PI / 2, 0]}>
                <boxGeometry args={[0.59, 0.59, 0.06]} />
                <meshStandardMaterial
                  color={rune.color}
                  emissive={rune.color}
                  emissiveIntensity={isHovered ? 2.5 : 0.8}
                  transparent
                  opacity={0.8 * opacity}
                />
              </mesh>

              {/* Hover Highlight Particle Aura */}
              {isHovered && (
                <pointLight
                  position={[0, 0, 0.2]}
                  color={rune.color}
                  distance={2.0}
                  intensity={3.0 * opacity}
                />
              )}
            </group>
          );
        })}
      </group>
    </group>
  );
}
