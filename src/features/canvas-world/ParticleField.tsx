import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
  count?: number;
}

export function ParticleField({ count = 280 }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const spd = new Float32Array(count);

    const cyan = new THREE.Color('#00e5ff');
    const vermilion = new THREE.Color('#ff2a14');
    const gold = new THREE.Color('#f59e0b');

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = Math.random() * 8 - 1.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;

      // Color distribution: 60% cyan, 25% vermilion, 15% gold
      const rand = Math.random();
      const c = rand < 0.6 ? cyan : rand < 0.85 ? vermilion : gold;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

      spd[i] = 0.15 + Math.random() * 0.25;
    }

    return { positions: pos, colors: col, speeds: spd };
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    const posAttr = pointsRef.current.geometry.attributes.position;
    const total = posAttr.count;

    for (let i = 0; i < total; i++) {
      let y = posAttr.getY(i);
      y += delta * speeds[i];
      if (y > 7.0) y = -1.5;
      posAttr.setY(i, y);

      const x = posAttr.getX(i);
      posAttr.setX(i, x + Math.sin(time * 0.8 + i) * 0.0018);
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
        size={0.038}
        vertexColors
        transparent
        opacity={0.55}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
