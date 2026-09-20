import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ContactMonolithProps {
  progress: number; // 0 to 1
  onHover?: () => void;
  onClick?: () => void;
}

export function ContactMonolith({ progress, onHover, onClick }: ContactMonolithProps) {
  const groupRef = useRef<THREE.Group>(null);
  const runesRef = useRef<THREE.Mesh>(null);
  const beaconRef = useRef<THREE.Mesh>(null);
  const pillarLightRef = useRef<THREE.PointLight>(null);

  // Visibility fade (0.80 to 1.0)
  const opacity = useMemo(() => {
    if (progress < 0.78) return 0;
    if (progress >= 0.88) return 1;
    return (progress - 0.78) / (0.88 - 0.78);
  }, [progress]);

  // Procedural carved rune texture for the terminal stele
  const monolithTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Black volcanic basalt texture
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, 512, 1024);

    // Stone chisel texture noise
    for (let i = 0; i < 3000; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? '#111827' : '#030712';
      ctx.fillRect(Math.random() * 512, Math.random() * 1024, 2, 2);
    }

    // Glowing cyan vertical matrix circuit lines
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(256, 80);
    ctx.lineTo(256, 940);
    ctx.stroke();

    // Etched Terminal Inscription: Modern Circuit & Code Indicators
    const glyphs = ['SYS', 'NET', 'INIT', 'PORT', '2026', 'OK'];
    ctx.fillStyle = '#00e5ff';
    ctx.font = 'bold 44px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    glyphs.forEach((g, idx) => {
      ctx.fillText(g, 256, 220 + idx * 110);
    });

    // Gold decorative terminal header border
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 6;
    ctx.strokeRect(40, 40, 432, 944);

    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state) => {
    if (!groupRef.current || opacity <= 0.005) return;
    const time = state.clock.getElapsedTime();

    // Subtle breathing pulse on the terminal light pillar
    if (beaconRef.current) {
      const p = 1.0 + Math.sin(time * 2.5) * 0.08;
      beaconRef.current.scale.set(p, 1, p);
    }

    if (pillarLightRef.current) {
      pillarLightRef.current.intensity = (2.8 + Math.sin(time * 3.0) * 0.6) * opacity;
    }
  });

  if (opacity <= 0.005) return null;

  return (
    <group
      ref={groupRef}
      position={[0, 0.4, 0]}
      onPointerOver={onHover}
      onClick={onClick}
    >
      {/* 1. Main Obsidian Monolith Stele */}
      <mesh position={[0, 1.8, 0]}>
        <boxGeometry args={[1.4, 3.6, 0.5]} />
        <meshStandardMaterial
          map={monolithTexture}
          roughness={0.35}
          metalness={0.7}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Gold Trim Corner Braces on Monolith */}
      {[
        [-0.7, 3.55, 0.25],
        [0.7, 3.55, 0.25],
        [-0.7, 0.05, 0.25],
        [0.7, 0.05, 0.25],
      ].map(([x, y, z], idx) => (
        <mesh key={idx} position={[x, y, z]}>
          <boxGeometry args={[0.15, 0.15, 0.05]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} transparent opacity={opacity} />
        </mesh>
      ))}

      {/* 2. Top Beacon Crystal Node */}
      <mesh ref={beaconRef} position={[0, 3.75, 0]}>
        <octahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={2.8}
          transparent
          opacity={0.95 * opacity}
        />
      </mesh>

      {/* Upward Reaching Pillar of Light */}
      <mesh position={[0, 6.0, 0]}>
        <cylinderGeometry args={[0.08, 0.25, 4.5, 16, 1, true]} />
        <meshBasicMaterial
          color="#00e5ff"
          transparent
          opacity={0.25 * opacity}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <pointLight
        ref={pillarLightRef}
        position={[0, 3.8, 0.5]}
        color="#00e5ff"
        distance={7.0}
        intensity={3.0 * opacity}
      />

      {/* 3. Ceremonial Stepped Octagonal Dais Base */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[1.8, 2.1, 0.3, 8]} />
        <meshStandardMaterial color="#0b1120" roughness={0.8} metalness={0.3} transparent opacity={opacity} />
      </mesh>

      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[2.3, 2.6, 0.25, 8]} />
        <meshStandardMaterial color="#070a12" roughness={0.85} metalness={0.2} transparent opacity={opacity} />
      </mesh>

      {/* Glowing Chakra Rune Ring on Pedestal Floor */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.35, 32]} />
        <meshStandardMaterial
          color="#ff2a14"
          emissive="#ff2a14"
          emissiveIntensity={1.8}
          transparent
          opacity={0.85 * opacity}
        />
      </mesh>
    </group>
  );
}
