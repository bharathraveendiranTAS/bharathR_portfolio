import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraRigProps {
  progress: number; // 0 to 1 overall scroll progress
}

export function CameraRig({ progress }: CameraRigProps) {
  // Temporary vectors to prevent garbage collection allocation in useFrame
  const targetCamPos = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3(0, 0.9, 0));

  useFrame((state, delta) => {
    const p = Math.min(Math.max(progress, 0), 1);
    const pointer = state.pointer; // normalized [-1, 1]

    // Multi-stage spline keypoints:
    // Anchor 1 (0.00 - 0.33): Low-angle pedestal hero view
    // Anchor 2 (0.34 - 0.66): Dolly-in top-angled book viewing
    // Anchor 3 (0.67 - 1.00): Isometric holographic card angle

    let basePos: THREE.Vector3;
    let baseTarget: THREE.Vector3;

    if (p <= 0.333) {
      // Stage 0: Figure
      const t = p / 0.333;
      const smoothT = THREE.MathUtils.smoothstep(t, 0, 1);
      basePos = new THREE.Vector3(
        THREE.MathUtils.lerp(0.0, -0.3, smoothT),
        THREE.MathUtils.lerp(1.1, 1.3, smoothT),
        THREE.MathUtils.lerp(5.4, 4.8, smoothT)
      );
      baseTarget = new THREE.Vector3(0, 0.95, 0);
    } else if (p <= 0.666) {
      // Stage 1: Art Book
      const t = (p - 0.333) / 0.333;
      const smoothT = THREE.MathUtils.smoothstep(t, 0, 1);
      basePos = new THREE.Vector3(
        THREE.MathUtils.lerp(-0.3, 0.0, smoothT),
        THREE.MathUtils.lerp(1.3, 2.1, smoothT),
        THREE.MathUtils.lerp(4.8, 3.6, smoothT)
      );
      baseTarget = new THREE.Vector3(0, 1.15, 0);
    } else {
      // Stage 2: Holographic Seals
      const t = (p - 0.666) / 0.334;
      const smoothT = THREE.MathUtils.smoothstep(t, 0, 1);
      basePos = new THREE.Vector3(
        THREE.MathUtils.lerp(0.0, 0.4, smoothT),
        THREE.MathUtils.lerp(2.1, 1.4, smoothT),
        THREE.MathUtils.lerp(3.6, 4.5, smoothT)
      );
      baseTarget = new THREE.Vector3(0, 1.05, 0);
    }

    // Add subtle responsive pointer parallax
    targetCamPos.current.copy(basePos);
    targetCamPos.current.x += pointer.x * 0.45;
    targetCamPos.current.y += pointer.y * 0.35;

    targetLookAt.current.copy(baseTarget);
    targetLookAt.current.x += pointer.x * 0.12;

    // Smoothly damp camera position and lookAt
    const dampFactor = Math.min(delta * 4.5, 0.25);
    state.camera.position.lerp(targetCamPos.current, dampFactor);
    currentLookAt.current.lerp(targetLookAt.current, dampFactor);
    state.camera.lookAt(currentLookAt.current);
  });

  return null;
}
