import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { chakraFoilVertexShader, chakraFoilFragmentShader } from '../../shaders/chakraFoilShader';

interface ChakraStickersProps {
  progress: number; // 0 to 1
  onHoverCard?: (cardIndex: number) => void;
  onClickCard?: (cardIndex: number) => void;
}

export function ChakraStickers({ progress, onHoverCard, onClickCard }: ChakraStickersProps) {
  const groupRef = useRef<THREE.Group>(null);
  const cardRefs = [useRef<THREE.Group>(null), useRef<THREE.Group>(null), useRef<THREE.Group>(null)];
  const shaderMatRefs = [
    useRef<THREE.ShaderMaterial>(null),
    useRef<THREE.ShaderMaterial>(null),
    useRef<THREE.ShaderMaterial>(null),
  ];

  // Visibility calculation (visible in stage 2: ~0.60 to 1.0)
  const opacity = useMemo(() => {
    if (progress < 0.58) return 0;
    if (progress >= 0.70) return 1;
    return (progress - 0.58) / (0.70 - 0.58);
  }, [progress]);

  // Create customized shader material instances for each seal type
  const shaderMaterials = useMemo(() => {
    return [0, 1, 2].map((sealType) => {
      return new THREE.ShaderMaterial({
        vertexShader: chakraFoilVertexShader,
        fragmentShader: chakraFoilFragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uResolution: { value: new THREE.Vector2(1024, 1024) },
          uChakraColor: { value: new THREE.Color('#00e5ff') },
          uVermilionColor: { value: new THREE.Color('#ff2a14') },
          uGoldColor: { value: new THREE.Color('#f59e0b') },
          uSealType: { value: sealType },
          uSheenStrength: { value: 1.25 },
        },
        transparent: true,
        side: THREE.DoubleSide,
      });
    });
  }, []);

  // Dispose shader materials on unmount
  useEffect(() => {
    return () => {
      shaderMaterials.forEach((mat) => mat.dispose());
    };
  }, [shaderMaterials]);

  // Frame animations: floating levitation, tilt response, and shader time/mouse updates
  useFrame((state, delta) => {
    if (!groupRef.current || opacity <= 0.01) return;

    const time = state.clock.getElapsedTime();
    const pointer = state.pointer; // [-1, 1]
    const normPointer = new THREE.Vector2((pointer.x + 1) * 0.5, (pointer.y + 1) * 0.5);

    // Update shader uniforms
    shaderMaterials.forEach((mat) => {
      mat.uniforms.uTime.value = time;
      mat.uniforms.uMouse.value.lerp(normPointer, Math.min(delta * 8.0, 0.3));
    });

    // Animate each hovering card with staggered offsets
    cardRefs.forEach((ref, idx) => {
      if (!ref.current) return;
      const phase = idx * 1.8;
      ref.current.position.y = (idx === 1 ? 1.3 : 1.15) + Math.sin(time * 2.2 + phase) * 0.045;
      ref.current.rotation.z = Math.sin(time * 1.5 + phase) * 0.04;
      // Slight mouse interactive tilt on cards
      ref.current.rotation.x = 0.2 + pointer.y * 0.25;
      ref.current.rotation.y = (idx - 1) * 0.35 + pointer.x * 0.35;
    });
  });

  if (opacity <= 0.005) return null;

  // Cards layout configuration
  const cardsData = [
    {
      title: 'Eight Trigrams Seal',
      japanese: '八卦の封印式',
      posX: -1.2,
      rotY: 0.32,
    },
    {
      title: 'Flying Raijin Tag',
      japanese: '飛雷神の術式',
      posX: 0.0,
      rotY: 0.0,
    },
    {
      title: 'Cursed Heavens Seal',
      japanese: '天の呪印 / 巴',
      posX: 1.2,
      rotY: -0.32,
    },
  ];

  const cardWidth = 0.95;
  const cardHeight = 1.35;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {cardsData.map((card, idx) => (
        <group
          key={idx}
          ref={cardRefs[idx]}
          position={[card.posX, 1.2, 0.2]}
          rotation={[0.2, card.rotY, 0]}
          onPointerOver={() => onHoverCard && onHoverCard(idx)}
          onClick={() => onClickCard && onClickCard(idx)}
        >
          {/* Main Holographic Card Front Face */}
          <mesh>
            <planeGeometry args={[cardWidth, cardHeight, 16, 16]} />
            <primitive object={shaderMaterials[idx]} attach="material" />
          </mesh>

          {/* Card Back Face (Deep Obsidian with Gold Konoha Crest) */}
          <mesh position={[0, 0, -0.005]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[cardWidth, cardHeight]} />
            <meshStandardMaterial
              color="#090d16"
              roughness={0.4}
              metalness={0.6}
              transparent
              opacity={opacity}
            />
          </mesh>

          {/* Die-Cut Beveled Metallic Gold Frame Trim */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[cardWidth + 0.02, cardHeight + 0.02, 0.008]} />
            <meshStandardMaterial
              color="#f59e0b"
              metalness={0.9}
              roughness={0.2}
              transparent
              opacity={0.45 * opacity}
            />
          </mesh>

          {/* Ambient Glow Aura behind card */}
          <pointLight
            color={idx === 1 ? '#00e5ff' : idx === 0 ? '#f59e0b' : '#ff2a14'}
            intensity={1.2 * opacity}
            distance={2.5}
            position={[0, 0, -0.2]}
          />
        </group>
      ))}
    </group>
  );
}
