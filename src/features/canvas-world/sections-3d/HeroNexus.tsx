import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HeroNexusProps {
  progress: number; // 0 to 1
  onHover?: () => void;
  onClick?: () => void;
}

export function HeroNexus({ progress, onHover, onClick }: HeroNexusProps) {
  const groupRef = useRef<THREE.Group>(null);
  const orbRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);

  // Visibility fade (0.0 to 0.26)
  const opacity = useMemo(() => {
    if (progress > 0.28) return 0;
    if (progress <= 0.18) return 1;
    return 1 - (progress - 0.18) / (0.28 - 0.18);
  }, [progress]);

  useFrame((state, delta) => {
    if (!groupRef.current || opacity <= 0.005) return;
    const time = state.clock.getElapsedTime();

    // Gentle floating breathing of the entire gateway
    groupRef.current.position.y = -0.65 + Math.sin(time * 1.4) * 0.05;
    groupRef.current.rotation.y = Math.sin(time * 0.4) * 0.04;

    // Pulse dimensional energy orb
    if (orbRef.current) {
      const scale = 1.0 + Math.sin(time * 3.5) * 0.05;
      orbRef.current.scale.set(scale, scale, scale);
    }

    // Counter-rotating concentric rings
    if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 0.75;
    if (ring2Ref.current) ring2Ref.current.rotation.x += delta * 0.55;
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y += delta * 0.65;
      ring3Ref.current.rotation.z -= delta * 0.35;
    }
  });

  if (opacity <= 0.005) return null;

  return (
    <group
      ref={groupRef}
      position={[0, -0.65, -2.2]}
      scale={[1.15, 1.15, 1.15]}
      onPointerOver={onHover}
      onClick={onClick}
    >
      {/* 1. Dimensional Energy Core Orb */}
      <mesh ref={orbRef} position={[0, 1.3, 0]}>
        <sphereGeometry args={[0.38, 32, 32]} />
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={1.2}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.85 * opacity}
        />
      </mesh>

      {/* Internal High-Energy White Core */}
      <mesh position={[0, 1.3, 0]}>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9 * opacity} />
      </mesh>

      {/* Core Point Light Casting Cyan Aura */}
      <pointLight
        position={[0, 1.3, 0]}
        color="#00e5ff"
        intensity={2.2 * opacity}
        distance={6.0}
      />

      {/* 2. Concentric Gyroscopic Chakra Rings */}
      <group ref={ring1Ref} position={[0, 1.3, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.75, 0.018, 16, 64]} />
          <meshStandardMaterial
            color="#00e5ff"
            emissive="#00e5ff"
            emissiveIntensity={1.2}
            metalness={0.9}
            roughness={0.2}
            transparent
            opacity={opacity}
          />
        </mesh>
      </group>

      <group ref={ring2Ref} position={[0, 1.3, 0]}>
        <mesh rotation={[0, Math.PI / 3, 0]}>
          <torusGeometry args={[0.95, 0.016, 16, 64]} />
          <meshStandardMaterial
            color="#ff2a14"
            emissive="#ff2a14"
            emissiveIntensity={1.0}
            metalness={0.9}
            roughness={0.2}
            transparent
            opacity={opacity}
          />
        </mesh>
      </group>

      <group ref={ring3Ref} position={[0, 1.3, 0]}>
        <mesh rotation={[Math.PI / 4, 0, Math.PI / 4]}>
          <torusGeometry args={[1.18, 0.015, 16, 64]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#f59e0b"
            emissiveIntensity={0.9}
            metalness={0.9}
            roughness={0.2}
            transparent
            opacity={opacity}
          />
        </mesh>
      </group>

      {/* 3. Grand Geometric Torii Portal Frame */}
      {/* Left Pillar (Hashira) */}
      <mesh position={[-1.75, 1.2, 0]}>
        <cylinderGeometry args={[0.1, 0.13, 2.9, 20]} />
        <meshStandardMaterial
          color="#ff2a14"
          roughness={0.35}
          metalness={0.2}
          transparent
          opacity={opacity}
        />
      </mesh>
      {/* Left Pillar Base Pedestal */}
      <mesh position={[-1.75, -0.22, 0]}>
        <cylinderGeometry args={[0.22, 0.26, 0.16, 20]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} transparent opacity={opacity} />
      </mesh>
      {/* Left Gold Collar Trim */}
      <mesh position={[-1.75, 2.35, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.08, 20]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} transparent opacity={opacity} />
      </mesh>

      {/* Right Pillar (Hashira) */}
      <mesh position={[1.75, 1.2, 0]}>
        <cylinderGeometry args={[0.1, 0.13, 2.9, 20]} />
        <meshStandardMaterial
          color="#ff2a14"
          roughness={0.35}
          metalness={0.2}
          transparent
          opacity={opacity}
        />
      </mesh>
      {/* Right Pillar Base Pedestal */}
      <mesh position={[1.75, -0.22, 0]}>
        <cylinderGeometry args={[0.22, 0.26, 0.16, 20]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} transparent opacity={opacity} />
      </mesh>
      {/* Right Gold Collar Trim */}
      <mesh position={[1.75, 2.35, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.08, 20]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} transparent opacity={opacity} />
      </mesh>

      {/* Lower Crossbeam (Nuki) */}
      <mesh position={[0, 2.2, 0]}>
        <boxGeometry args={[3.8, 0.12, 0.14]} />
        <meshStandardMaterial color="#ff2a14" roughness={0.35} transparent opacity={opacity} />
      </mesh>

      {/* Upper Main Lintel (Kasagi & Shimaki with curved ends) */}
      <mesh position={[0, 2.7, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[4.4, 0.18, 0.24]} />
        <meshStandardMaterial color="#0a0e17" roughness={0.25} metalness={0.6} transparent opacity={opacity} />
      </mesh>

      {/* Gold Roof Ridge Trim */}
      <mesh position={[0, 2.82, 0]}>
        <boxGeometry args={[4.45, 0.04, 0.12]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} transparent opacity={opacity} />
      </mesh>

      {/* Central Plaque (Gakuzuka) */}
      <mesh position={[0, 2.45, 0]}>
        <boxGeometry args={[0.35, 0.42, 0.06]} />
        <meshStandardMaterial color="#0a0e17" roughness={0.4} metalness={0.4} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, 2.45, 0.035]}>
        <planeGeometry args={[0.26, 0.32]} />
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={1.4}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Octagonal Foundation Dais */}
      <mesh position={[0, -0.32, 0]}>
        <cylinderGeometry args={[2.5, 2.8, 0.14, 8]} />
        <meshStandardMaterial
          color="#070a12"
          roughness={0.85}
          metalness={0.2}
          transparent
          opacity={opacity}
        />
      </mesh>
      <mesh position={[0, -0.24, 0]} rotation={[0, Math.PI / 8, 0]}>
        <cylinderGeometry args={[2.3, 2.5, 0.08, 8]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.7}
          metalness={0.3}
          transparent
          opacity={opacity}
        />
      </mesh>
    </group>
  );
}
