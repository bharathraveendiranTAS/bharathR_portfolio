import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AboutSanctuaryProps {
  progress: number; // 0 to 1
  onHover?: () => void;
  onClick?: () => void;
}

export function AboutSanctuary({ progress, onHover, onClick }: AboutSanctuaryProps) {
  const groupRef = useRef<THREE.Group>(null);
  const islandRef = useRef<THREE.Group>(null);
  const mistRef = useRef<THREE.Mesh>(null);
  const lanternLightRef = useRef<THREE.PointLight>(null);

  // Visibility fade (0.16 to 0.44)
  const opacity = useMemo(() => {
    if (progress < 0.16 || progress > 0.44) return 0;
    if (progress >= 0.24 && progress <= 0.36) return 1;
    if (progress < 0.24) return (progress - 0.16) / (0.24 - 0.16);
    return 1 - (progress - 0.36) / (0.44 - 0.36);
  }, [progress]);

  useFrame((state) => {
    if (!groupRef.current || opacity <= 0.005) return;
    const time = state.clock.getElapsedTime();
    const pointer = state.pointer; // [-1, 1]

    // Mouse tilt on the stone sanctuary island (subtle zen parallax)
    if (islandRef.current) {
      islandRef.current.rotation.x = THREE.MathUtils.lerp(
        islandRef.current.rotation.x,
        0.15 - pointer.y * 0.12,
        0.08
      );
      islandRef.current.rotation.y = THREE.MathUtils.lerp(
        islandRef.current.rotation.y,
        -0.2 + pointer.x * 0.15,
        0.08
      );
      islandRef.current.position.y = Math.sin(time * 1.2) * 0.035;
    }

    // Slowly rotate volumetric mist plane
    if (mistRef.current) {
      mistRef.current.rotation.z = time * 0.08;
    }

    // Flicker warm lantern light
    if (lanternLightRef.current) {
      lanternLightRef.current.intensity = (1.5 + Math.sin(time * 6.0) * 0.25) * opacity;
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
      <group ref={islandRef}>
        {/* 1. Main Moss-Covered Stone Island Dais */}
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[2.8, 3.4, 0.6, 32]} />
          <meshStandardMaterial
            color="#14211a"
            roughness={0.88}
            metalness={0.1}
            transparent
            opacity={opacity}
          />
        </mesh>

        {/* Moss Top Surface Ring */}
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2.75, 32]} />
          <meshStandardMaterial
            color="#1b382b"
            roughness={0.92}
            metalness={0.05}
            transparent
            opacity={opacity}
          />
        </mesh>

        {/* Raked Zen Sand Ring Pattern */}
        {[1.2, 1.8, 2.4].map((radius, i) => (
          <mesh key={i} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[radius - 0.04, radius + 0.04, 48]} />
            <meshStandardMaterial
              color="#334155"
              roughness={0.9}
              transparent
              opacity={0.6 * opacity}
            />
          </mesh>
        ))}

        {/* 2. Natural Monolith Stones & Stepping Rocks */}
        {/* Primary Standing Stone Monolith (tilt-reactive) */}
        <mesh position={[-0.8, 0.7, -0.4]} rotation={[0.08, 0.25, -0.05]}>
          <dodecahedronGeometry args={[0.75, 1]} />
          <meshStandardMaterial
            color="#27272a"
            roughness={0.8}
            metalness={0.2}
            transparent
            opacity={opacity}
          />
        </mesh>

        {/* Supporting Secondary Boulder */}
        <mesh position={[-1.4, 0.35, -0.1]} rotation={[-0.1, 0.4, 0.1]}>
          <dodecahedronGeometry args={[0.48, 1]} />
          <meshStandardMaterial
            color="#1e293b"
            roughness={0.85}
            transparent
            opacity={opacity}
          />
        </mesh>

        {/* Floating Stepping Stones */}
        {[
          [0.6, 0.05, 0.8, 0.35],
          [1.3, 0.08, 0.3, 0.42],
          [1.7, 0.03, -0.6, 0.32],
          [-0.2, 0.04, 1.2, 0.28],
        ].map(([x, y, z, r], idx) => (
          <mesh key={idx} position={[x, y, z]}>
            <cylinderGeometry args={[r, r + 0.05, 0.12, 16]} />
            <meshStandardMaterial
              color="#334155"
              roughness={0.8}
              metalness={0.15}
              transparent
              opacity={opacity}
            />
          </mesh>
        ))}

        {/* 3. Traditional Japanese Stone Lantern (Tōrō) */}
        <group position={[1.1, 0.6, -0.5]}>
          {/* Base Pedestal */}
          <mesh position={[0, -0.4, 0]}>
            <boxGeometry args={[0.4, 0.15, 0.4]} />
            <meshStandardMaterial color="#1e293b" roughness={0.7} transparent opacity={opacity} />
          </mesh>
          {/* Stem Post */}
          <mesh position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.1, 0.14, 0.4, 8]} />
            <meshStandardMaterial color="#334155" roughness={0.8} transparent opacity={opacity} />
          </mesh>
          {/* Light Chamber Frame */}
          <mesh position={[0, 0.15, 0]}>
            <boxGeometry args={[0.34, 0.26, 0.34]} />
            <meshStandardMaterial color="#0f172a" roughness={0.6} transparent opacity={opacity} />
          </mesh>
          {/* Inner Glowing Candle / Lantern Core */}
          <mesh position={[0, 0.15, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#f59e0b"
              emissiveIntensity={2.5}
              transparent
              opacity={opacity}
            />
          </mesh>
          {/* Hexagonal Roof Cap (Kasa) */}
          <mesh position={[0, 0.35, 0]}>
            <coneGeometry args={[0.38, 0.18, 6]} />
            <meshStandardMaterial color="#1e293b" roughness={0.7} transparent opacity={opacity} />
          </mesh>
          {/* Top Jewel (Hoju) */}
          <mesh position={[0, 0.48, 0]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.9} transparent opacity={opacity} />
          </mesh>

          {/* Lantern Warm Amber Light Source */}
          <pointLight
            ref={lanternLightRef}
            position={[0, 0.15, 0]}
            color="#fbbf24"
            distance={4.5}
            intensity={1.8 * opacity}
          />
        </group>

        {/* 4. Cyan Chakra Energy Spring Well */}
        <group position={[-0.4, 0.05, 0.4]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.2, 0.38, 32]} />
            <meshStandardMaterial color="#0f172a" roughness={0.6} transparent opacity={opacity} />
          </mesh>
          {/* Glowing Spring Pool */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
            <circleGeometry args={[0.22, 32]} />
            <meshStandardMaterial
              color="#00e5ff"
              emissive="#00e5ff"
              emissiveIntensity={1.8}
              transparent
              opacity={0.8 * opacity}
            />
          </mesh>
          <pointLight
            position={[0, 0.2, 0]}
            color="#00e5ff"
            distance={3.0}
            intensity={1.6 * opacity}
          />
        </group>
      </group>

      {/* 5. Volumetric Soft Mist Disk */}
      <mesh ref={mistRef} position={[0, -0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7.0, 7.0]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.08 * opacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
