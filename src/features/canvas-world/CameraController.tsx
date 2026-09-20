import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraControllerProps {
  progress: number; // 0.0 to 1.0
  isReducedMotion?: boolean;
}

export function CameraController({ progress, isReducedMotion = false }: CameraControllerProps) {
  const { camera } = useThree();
  const currentLookAtRef = useRef(new THREE.Vector3(0, 1.2, 0));

  // Multi-point camera position spline track through the 5 stages
  const { posSpline, lookSpline } = useMemo(() => {
    // 5 Stages Keypoints:
    // 0: Hero (Aerial gaze through volumetric fog onto glowing Torii nexus)
    // 1: About (Swoop down into rock sanctuary island)
    // 2: Work (Curved lateral track around merchandise)
    // 3: Skills (High-angle isometric perspective above runes ring)
    // 4: Contact (Low-angle dramatic hero perspective looking up at monolith terminal)
    const posPoints = [
      new THREE.Vector3(0.0, 3.8, 8.5),   // 0.0: Hero
      new THREE.Vector3(-0.6, 1.4, 5.4),  // 0.25: About
      new THREE.Vector3(0.0, 1.35, 5.2),  // 0.52: Work
      new THREE.Vector3(0.0, 4.6, 6.8),   // 0.75: Skills (isometric)
      new THREE.Vector3(0.0, 0.35, 4.6),  // 1.0: Contact (dramatic low angle)
    ];

    const lookPoints = [
      new THREE.Vector3(0.0, 1.2, 0.0),   // 0.0: Hero Torii core
      new THREE.Vector3(0.0, 0.5, 0.0),   // 0.25: About sanctuary stones
      new THREE.Vector3(0.0, 1.05, 0.0),  // 0.52: Work pedestal/codex
      new THREE.Vector3(0.0, 0.4, 0.0),   // 0.75: Skills constellation center
      new THREE.Vector3(0.0, 2.2, 0.0),   // 1.0: Contact monolith upper stele
    ];

    return {
      posSpline: new THREE.CatmullRomCurve3(posPoints, false, 'centripetal'),
      lookSpline: new THREE.CatmullRomCurve3(lookPoints, false, 'centripetal'),
    };
  }, []);

  useFrame((state) => {
    const clampedProgress = Math.max(0, Math.min(1, progress));

    // Sample target position and lookAt on the spline curves
    const targetPos = posSpline.getPointAt(clampedProgress);
    const targetLookAt = lookSpline.getPointAt(clampedProgress);

    if (isReducedMotion) {
      // Direct positioning without aggressive parallax
      camera.position.lerp(targetPos, 0.12);
      currentLookAtRef.current.lerp(targetLookAt, 0.12);
      camera.lookAt(currentLookAtRef.current);
      return;
    }

    // Interactive mouse pointer parallax
    const pointer = state.pointer; // [-1, 1]
    const parallaxX = pointer.x * 0.45;
    const parallaxY = pointer.y * 0.25;

    const adjustedPos = new THREE.Vector3(
      targetPos.x + parallaxX,
      targetPos.y + parallaxY,
      targetPos.z
    );

    // Smooth camera interpolation
    camera.position.lerp(adjustedPos, 0.08);
    currentLookAtRef.current.lerp(targetLookAt, 0.08);
    camera.lookAt(currentLookAtRef.current);
  });

  return null;
}
