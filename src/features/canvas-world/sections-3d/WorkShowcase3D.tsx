import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WorkShowcase3DProps {
  progress: number; // 0 to 1 overall portfolio progress
  onHoverItem?: (name: string) => void;
  onClickItem?: (name: string) => void;
}

export function WorkShowcase3D({ progress, onHoverItem, onClickItem }: WorkShowcase3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  // Map overall portfolio progress [0.36 to 0.68] to internal Work sub-progress [0.0 to 1.0]
  const internalProgress = useMemo(() => {
    if (progress < 0.36) return 0;
    if (progress > 0.68) return 1;
    return (progress - 0.36) / (0.68 - 0.36);
  }, [progress]);

  // Overall visibility
  const isVisible = progress >= 0.32 && progress <= 0.72;

  useFrame((state, delta) => {
    if (!groupRef.current || !isVisible) return;
    const time = state.clock.getElapsedTime();

    // Gentle levitation of the holographic hub
    groupRef.current.position.y = -0.4 + Math.sin(time * 1.5) * 0.06;
    groupRef.current.rotation.y += delta * 0.25;

    // Rotate core polyhedron
    if (coreRef.current) {
      coreRef.current.rotation.x += delta * 0.45;
      coreRef.current.rotation.y += delta * 0.65;
    }

    // Counter-rotate orbital data rings
    if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 0.6;
    if (ring2Ref.current) ring2Ref.current.rotation.x += delta * 0.4;
    if (ring3Ref.current) ring3Ref.current.rotation.y += delta * 0.5;
  });

  if (!isVisible) return null;

  return (
    <group
      ref={groupRef}
      position={[0, -0.4, 0]}
      onPointerOver={() => onHoverItem && onHoverItem('holographic-terminal')}
      onClick={() => onClickItem && onClickItem('holographic-terminal')}
    >
      {/* 1. Base Holographic Pedestal Platform */}
      <mesh position={[0, -1.2, 0]} receiveShadow>
        <cylinderGeometry args={[2.2, 2.5, 0.25, 32]} />
        <meshStandardMaterial
          color="#080c16"
          metalness={0.9}
          roughness={0.2}
          emissive="#00e5ff"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Cyber Stage Ring Accent */}
      <mesh position={[0, -1.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.9, 2.1, 32]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.6} />
      </mesh>

      {/* 2. Floating Holographic Crystal Core (Polyhedron) */}
      <mesh ref={coreRef} position={[0, 0.4, 0]}>
        <icosahedronGeometry args={[0.75, 0]} />
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={1.4}
          roughness={0.1}
          metalness={0.9}
          wireframe
        />
      </mesh>

      {/* Solid Inner Glowing Core */}
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.35, 24, 24]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.85} />
      </mesh>

      {/* 3. Concentric Holographic Orbital Rings */}
      <mesh ref={ring1Ref} position={[0, 0.4, 0]} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.2, 0.015, 16, 64]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.8} />
      </mesh>

      <mesh ref={ring2Ref} position={[0, 0.4, 0]} rotation={[0, Math.PI / 4, 0]}>
        <torusGeometry args={[1.5, 0.015, 16, 64]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.65} />
      </mesh>

      <mesh ref={ring3Ref} position={[0, 0.4, 0]} rotation={[Math.PI / 6, 0, Math.PI / 4]}>
        <torusGeometry args={[1.8, 0.015, 16, 64]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.5} />
      </mesh>

      {/* Dynamic Cyan Point Light */}
      <pointLight position={[0, 0.4, 0]} color="#00e5ff" intensity={3.0} distance={8} />
    </group>
  );
}
