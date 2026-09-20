import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CollectiblePedestalProps {
  progress: number; // 0 to 1
  onHover?: () => void;
  onClick?: () => void;
}

export function CollectiblePedestal({ progress, onHover, onClick }: CollectiblePedestalProps) {
  const groupRef = useRef<THREE.Group>(null);
  const rasenganCoreRef = useRef<THREE.Mesh>(null);
  const rasenganRing1Ref = useRef<THREE.Mesh>(null);
  const rasenganRing2Ref = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const cloakRef = useRef<THREE.Group>(null);

  // Visibility calculation based on progress (visible in stage 0: 0.0 to 0.40)
  const opacity = useMemo(() => {
    if (progress <= 0.28) return 1;
    if (progress > 0.42) return 0;
    return 1 - (progress - 0.28) / (0.42 - 0.28);
  }, [progress]);

  // Generate Spiraling Chakra Vortex Particles
  const { particlePositions, particleColors, particlePhases } = useMemo(() => {
    const count = 550;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const phases = new Float32Array(count);

    const cyan = new THREE.Color('#00e5ff');
    const vermilion = new THREE.Color('#ff2a14');
    const gold = new THREE.Color('#f59e0b');

    for (let i = 0; i < count; i++) {
      const radius = 0.4 + Math.random() * 0.95;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.2) * 2.4;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      phases[i] = Math.random() * Math.PI * 2;

      // Color distribution: 75% chakra cyan, 15% gold, 10% vermilion
      const rand = Math.random();
      const col = rand > 0.85 ? vermilion : rand > 0.70 ? gold : cyan;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    return {
      particlePositions: positions,
      particleColors: colors,
      particlePhases: phases,
    };
  }, []);

  // Frame animation for Chakra vortex, Rasengan pulsing, and wind sway
  useFrame((state, delta) => {
    if (!groupRef.current || opacity <= 0.01) return;

    const time = state.clock.getElapsedTime();

    // Subtle breathing/levitation on the ninja figure
    groupRef.current.position.y = Math.sin(time * 1.5) * 0.03;
    groupRef.current.rotation.y = Math.sin(time * 0.4) * 0.08;

    // Wind sway on ninja cloak
    if (cloakRef.current) {
      cloakRef.current.rotation.z = Math.sin(time * 2.5) * 0.04;
      cloakRef.current.rotation.x = Math.cos(time * 2.0) * 0.03;
    }

    // Rasengan plasma rotation
    if (rasenganCoreRef.current) {
      const scale = 1 + Math.sin(time * 12) * 0.08;
      rasenganCoreRef.current.scale.set(scale, scale, scale);
    }
    if (rasenganRing1Ref.current) {
      rasenganRing1Ref.current.rotation.x += delta * 6.5;
      rasenganRing1Ref.current.rotation.y += delta * 4.2;
    }
    if (rasenganRing2Ref.current) {
      rasenganRing2Ref.current.rotation.y -= delta * 5.8;
      rasenganRing2Ref.current.rotation.z += delta * 4.9;
    }

    // Orbit and rise chakra particles
    if (particlesRef.current) {
      const geo = particlesRef.current.geometry;
      const posAttr = geo.attributes.position;
      const count = posAttr.count;

      for (let i = 0; i < count; i++) {
        let x = posAttr.getX(i);
        let y = posAttr.getY(i);
        let z = posAttr.getZ(i);

        const currentRadius = Math.sqrt(x * x + z * z);
        let currentAngle = Math.atan2(z, x);

        // Spin along helix
        currentAngle += delta * (2.2 + currentRadius * 0.8);
        y += delta * 0.75;

        // Reset if particle rises too high
        if (y > 2.2) {
          y = -0.3;
        }

        posAttr.setX(i, Math.cos(currentAngle) * currentRadius);
        posAttr.setY(i, y);
        posAttr.setZ(i, Math.sin(currentAngle) * currentRadius);
      }
      posAttr.needsUpdate = true;
    }
  });

  // Explicit Three.js disposal
  useEffect(() => {
    return () => {
      // Automatic cleanup handled by React Three Fiber tree
    };
  }, []);

  if (opacity <= 0.005) return null;

  return (
    <group
      ref={groupRef}
      position={[0, 0, 0]}
      onPointerOver={onHover}
      onClick={onClick}
    >
      {/* 1. Stone Tiered Pedestal */}
      <group position={[0, -0.35, 0]}>
        {/* Base stone tier */}
        <mesh receiveShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[1.35, 1.45, 0.2, 8]} />
          <meshStandardMaterial
            color="#0f172a"
            roughness={0.7}
            metalness={0.2}
            transparent
            opacity={opacity}
          />
        </mesh>

        {/* Mid stone tier with beveled step */}
        <mesh receiveShadow position={[0, 0.16, 0]}>
          <cylinderGeometry args={[1.15, 1.25, 0.16, 8]} />
          <meshStandardMaterial
            color="#1e293b"
            roughness={0.65}
            metalness={0.25}
            transparent
            opacity={opacity}
          />
        </mesh>

        {/* Top platform with glowing Uzumaki rune ring */}
        <mesh receiveShadow position={[0, 0.28, 0]}>
          <cylinderGeometry args={[0.95, 1.05, 0.1, 8]} />
          <meshStandardMaterial
            color="#0a0f1d"
            roughness={0.5}
            metalness={0.4}
            transparent
            opacity={opacity}
          />
        </mesh>

        {/* Emissive Uzumaki Seal Ring on Pedestal */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.335, 0]}>
          <ringGeometry args={[0.62, 0.72, 36]} />
          <meshBasicMaterial
            color="#00e5ff"
            transparent
            opacity={0.75 * opacity}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* 2. Shinobi Collectible Figure (1:6 Scale Sage Silhouette) */}
      <group position={[0, 0.05, 0]}>
        {/* Legs & Ninja Greaves */}
        <mesh position={[-0.14, 0.35, 0]}>
          <cylinderGeometry args={[0.07, 0.08, 0.7, 12]} />
          <meshStandardMaterial color="#1e2430" roughness={0.7} transparent opacity={opacity} />
        </mesh>
        <mesh position={[0.14, 0.35, 0]}>
          <cylinderGeometry args={[0.07, 0.08, 0.7, 12]} />
          <meshStandardMaterial color="#1e2430" roughness={0.7} transparent opacity={opacity} />
        </mesh>

        {/* Wrapped ninja bandages around ankles */}
        <mesh position={[-0.14, 0.18, 0]}>
          <cylinderGeometry args={[0.082, 0.082, 0.22, 12]} />
          <meshStandardMaterial color="#e8e0cf" roughness={0.8} transparent opacity={opacity} />
        </mesh>
        <mesh position={[0.14, 0.18, 0]}>
          <cylinderGeometry args={[0.082, 0.082, 0.22, 12]} />
          <meshStandardMaterial color="#e8e0cf" roughness={0.8} transparent opacity={opacity} />
        </mesh>

        {/* Ninja Sandals */}
        <mesh position={[-0.14, 0.05, 0.04]}>
          <boxGeometry args={[0.14, 0.08, 0.22]} />
          <meshStandardMaterial color="#0c1017" roughness={0.6} transparent opacity={opacity} />
        </mesh>
        <mesh position={[0.14, 0.05, 0.04]}>
          <boxGeometry args={[0.14, 0.08, 0.22]} />
          <meshStandardMaterial color="#0c1017" roughness={0.6} transparent opacity={opacity} />
        </mesh>

        {/* Torso & Jonin Flak Vest */}
        <mesh position={[0, 0.95, 0]}>
          <boxGeometry args={[0.38, 0.52, 0.24]} />
          <meshStandardMaterial color="#2d3748" roughness={0.6} transparent opacity={opacity} />
        </mesh>

        {/* Flak vest collar & tactical pouches */}
        <mesh position={[0, 1.15, 0]}>
          <cylinderGeometry args={[0.15, 0.2, 0.12, 12]} />
          <meshStandardMaterial color="#1a202c" roughness={0.5} transparent opacity={opacity} />
        </mesh>
        <mesh position={[-0.16, 0.88, 0.13]}>
          <boxGeometry args={[0.08, 0.1, 0.05]} />
          <meshStandardMaterial color="#1a202c" roughness={0.6} transparent opacity={opacity} />
        </mesh>
        <mesh position={[0.16, 0.88, 0.13]}>
          <boxGeometry args={[0.08, 0.1, 0.05]} />
          <meshStandardMaterial color="#1a202c" roughness={0.6} transparent opacity={opacity} />
        </mesh>

        {/* Sage Mode Cloak (Vermilion & Black Flame Hem) */}
        <group ref={cloakRef} position={[0, 1.0, -0.08]}>
          <mesh position={[0, -0.28, -0.06]}>
            <coneGeometry args={[0.38, 0.82, 16, 1, true]} />
            <meshStandardMaterial
              color="#ff2a14"
              roughness={0.4}
              side={THREE.DoubleSide}
              transparent
              opacity={opacity}
            />
          </mesh>
          {/* Black flame hem trim */}
          <mesh position={[0, -0.68, -0.06]}>
            <torusGeometry args={[0.37, 0.03, 8, 24]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.3} transparent opacity={opacity} />
          </mesh>
        </group>

        {/* Head & Spiky Shinobi Hair */}
        <mesh position={[0, 1.34, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#f0d5b7" roughness={0.7} transparent opacity={opacity} />
        </mesh>

        {/* Golden Spiky Hair Tuft */}
        <mesh position={[0, 1.45, -0.02]}>
          <coneGeometry args={[0.19, 0.28, 7]} />
          <meshStandardMaterial color="#fbbf24" roughness={0.5} transparent opacity={opacity} />
        </mesh>
        <mesh position={[0.08, 1.42, 0.04]} rotation={[0.2, 0.4, -0.3]}>
          <coneGeometry args={[0.1, 0.22, 6]} />
          <meshStandardMaterial color="#fbbf24" roughness={0.5} transparent opacity={opacity} />
        </mesh>
        <mesh position={[-0.08, 1.42, 0.04]} rotation={[0.2, -0.4, 0.3]}>
          <coneGeometry args={[0.1, 0.22, 6]} />
          <meshStandardMaterial color="#fbbf24" roughness={0.5} transparent opacity={opacity} />
        </mesh>

        {/* Leaf Headband (Hitai-ate) Plate */}
        <mesh position={[0, 1.37, 0.14]}>
          <boxGeometry args={[0.18, 0.07, 0.03]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} transparent opacity={opacity} />
        </mesh>
        {/* Headband cloth band */}
        <mesh position={[0, 1.37, 0]}>
          <cylinderGeometry args={[0.155, 0.155, 0.06, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} transparent opacity={opacity} />
        </mesh>

        {/* Right Arm Extended Holding Rasengan */}
        <mesh position={[0.28, 1.05, 0.18]} rotation={[0.6, 0.2, -0.5]}>
          <cylinderGeometry args={[0.055, 0.06, 0.42, 12]} />
          <meshStandardMaterial color="#2d3748" roughness={0.6} transparent opacity={opacity} />
        </mesh>

        {/* 3. The Rasengan Sphere (High Energy Swirling Core) */}
        <group position={[0.42, 1.22, 0.42]}>
          {/* Intense point light illuminating figure and floor */}
          <pointLight color="#00e5ff" intensity={2.5 * opacity} distance={4} />

          {/* Inner core */}
          <mesh ref={rasenganCoreRef}>
            <sphereGeometry args={[0.11, 24, 24]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.95 * opacity} />
          </mesh>

          {/* Cyan Chakra Shell */}
          <mesh>
            <sphereGeometry args={[0.15, 24, 24]} />
            <meshStandardMaterial
              color="#00e5ff"
              emissive="#00e5ff"
              emissiveIntensity={2.5}
              roughness={0.1}
              transparent
              opacity={0.6 * opacity}
            />
          </mesh>

          {/* Swirling Plasma Ring 1 */}
          <mesh ref={rasenganRing1Ref}>
            <torusGeometry args={[0.18, 0.012, 12, 36]} />
            <meshBasicMaterial color="#38d9ff" transparent opacity={0.85 * opacity} />
          </mesh>

          {/* Swirling Plasma Ring 2 */}
          <mesh ref={rasenganRing2Ref}>
            <torusGeometry args={[0.21, 0.014, 12, 36]} />
            <meshBasicMaterial color="#00f0ff" transparent opacity={0.75 * opacity} />
          </mesh>
        </group>

        {/* Left Arm with Tactical Crossed Kunai */}
        <mesh position={[-0.26, 0.95, 0.08]} rotation={[-0.4, 0, 0.3]}>
          <cylinderGeometry args={[0.055, 0.06, 0.38, 12]} />
          <meshStandardMaterial color="#2d3748" roughness={0.6} transparent opacity={opacity} />
        </mesh>

        {/* Steel Kunai Dagger */}
        <group position={[-0.32, 0.82, 0.22]} rotation={[0.4, 0.8, -0.2]}>
          {/* Blade */}
          <mesh>
            <coneGeometry args={[0.045, 0.22, 4]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.15} transparent opacity={opacity} />
          </mesh>
          {/* Wrapped hilt */}
          <mesh position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.12, 8]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.8} transparent opacity={opacity} />
          </mesh>
          {/* Ring pommel */}
          <mesh position={[0, -0.23, 0]}>
            <torusGeometry args={[0.028, 0.008, 8, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} transparent opacity={opacity} />
          </mesh>
        </group>
      </group>

      {/* 4. Swirling Chakra Particle Vortex */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlePositions.length / 3}
            array={particlePositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleColors.length / 3}
            array={particleColors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          vertexColors
          transparent
          opacity={0.85 * opacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
