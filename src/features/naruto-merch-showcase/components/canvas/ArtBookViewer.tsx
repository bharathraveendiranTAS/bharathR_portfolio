import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ArtBookViewerProps {
  progress: number; // 0 to 1 overall scroll
  bookOpenProgress: number; // 0 to 1 open interpolation
  onHover?: () => void;
  onClick?: () => void;
}

export function ArtBookViewer({ progress, bookOpenProgress, onHover, onClick }: ArtBookViewerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const frontCoverHingeRef = useRef<THREE.Group>(null);
  const page1HingeRef = useRef<THREE.Group>(null);
  const page2HingeRef = useRef<THREE.Group>(null);

  // Visibility calculation (visible in stage 1: ~0.25 to 0.75)
  const opacity = useMemo(() => {
    if (progress < 0.22 || progress > 0.76) return 0;
    if (progress >= 0.32 && progress <= 0.65) return 1;
    if (progress < 0.32) return (progress - 0.22) / (0.32 - 0.22);
    return 1 - (progress - 0.65) / (0.76 - 0.65);
  }, [progress]);

  // Generate Procedural Sumi-e & Shinobi Blueprint Canvas Textures
  const { coverTexture, pageTextureLeft, pageTextureRight } = useMemo(() => {
    // 1. Cover Texture (Crimson Leather + Gold Embossed Konoha & Kanji)
    const coverCanvas = document.createElement('canvas');
    coverCanvas.width = 1024;
    coverCanvas.height = 1024;
    const ctx = coverCanvas.getContext('2d')!;

    // Background crimson leather grain
    ctx.fillStyle = '#6b1115';
    ctx.fillRect(0, 0, 1024, 1024);

    // Subtle dark gradient & border
    const grad = ctx.createRadialGradient(512, 512, 100, 512, 512, 700);
    grad.addColorStop(0, '#88131b');
    grad.addColorStop(1, '#3b0609');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Gold foil border
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 14;
    ctx.strokeRect(60, 60, 904, 904);

    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 4;
    ctx.strokeRect(84, 84, 856, 856);

    // Embossed Konoha Leaf Symbol
    ctx.save();
    ctx.translate(512, 420);
    ctx.fillStyle = '#f59e0b';
    ctx.shadowColor = '#d97706';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(0, 0, 110, 0, Math.PI * 2);
    ctx.fill();

    // Inner leaf spiral cutout
    ctx.fillStyle = '#3b0609';
    ctx.beginPath();
    ctx.arc(0, 0, 85, 0, Math.PI * 2);
    ctx.fill();

    // Leaf point & swirl
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(0, -10, 50, 0.4 * Math.PI, 1.8 * Math.PI);
    ctx.lineTo(40, -120);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Japanese Title Typography: 木ノ葉 忍伝
    ctx.fillStyle = '#fef3c7';
    ctx.font = 'bold 56px "JetBrains Mono", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('木ノ葉 秘伝忍絵巻', 512, 680);

    ctx.font = '28px "JetBrains Mono", monospace';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('SHINOBI ARCHIVE // CODEX VOL. 01', 512, 740);

    ctx.font = '20px "JetBrains Mono", monospace';
    ctx.fillStyle = '#991b1b';
    ctx.fillText('LIMITED JUTSU BLUEPRINTS & CONCEPT ART', 512, 790);

    const cTex = new THREE.CanvasTexture(coverCanvas);

    // 2. Left Page (Sumi-e Nine-Tails & Sage Mode Anatomy)
    const pageLeftCanvas = document.createElement('canvas');
    pageLeftCanvas.width = 1024;
    pageLeftCanvas.height = 1024;
    const lCtx = pageLeftCanvas.getContext('2d')!;

    lCtx.fillStyle = '#f5efe6'; // Warm parchment
    lCtx.fillRect(0, 0, 1024, 1024);

    // Aged paper margins & ink wash
    lCtx.strokeStyle = '#c8bda9';
    lCtx.lineWidth = 2;
    lCtx.strokeRect(40, 40, 944, 944);

    // Calligraphy / Kanji ink header
    lCtx.fillStyle = '#1c1917';
    lCtx.font = 'bold 44px "JetBrains Mono", serif';
    lCtx.textAlign = 'left';
    lCtx.fillText('巻之壱：仙術と螺旋の極意', 80, 120);

    lCtx.font = '22px "JetBrains Mono", monospace';
    lCtx.fillStyle = '#78716c';
    lCtx.fillText('SENJUTSU CHAKRA KINETICS & MATRIX', 80, 165);

    // Diagram of chakra flow
    lCtx.strokeStyle = '#0284c7';
    lCtx.lineWidth = 3;
    lCtx.beginPath();
    lCtx.arc(512, 450, 160, 0, Math.PI * 2);
    lCtx.stroke();

    lCtx.strokeStyle = '#ef4444';
    lCtx.lineWidth = 2;
    lCtx.beginPath();
    lCtx.arc(512, 450, 110, 0, Math.PI * 2);
    lCtx.stroke();

    // Directional arrows
    lCtx.fillStyle = '#0284c7';
    for (let a = 0; a < 8; a++) {
      const angle = (a * Math.PI) / 4;
      const x = 512 + Math.cos(angle) * 160;
      const y = 450 + Math.sin(angle) * 160;
      lCtx.beginPath();
      lCtx.arc(x, y, 6, 0, Math.PI * 2);
      lCtx.fill();
    }

    // Seal red stamp (Hanko)
    lCtx.strokeStyle = '#dc2626';
    lCtx.lineWidth = 5;
    lCtx.strokeRect(760, 800, 140, 140);
    lCtx.fillStyle = '#dc2626';
    lCtx.font = 'bold 36px serif';
    lCtx.textAlign = 'center';
    lCtx.fillText('木ノ葉', 830, 860);
    lCtx.fillText('検印', 830, 910);

    // Sumi-e ink stroke illustration
    lCtx.fillStyle = '#292524';
    lCtx.font = '18px "JetBrains Mono", monospace';
    lCtx.textAlign = 'left';
    lCtx.fillText('1. Natural Energy blending ratio: 1/3 Physical, 1/3 Spiritual, 1/3 Nature', 80, 720);
    lCtx.fillText('2. Form change rotation: High-speed vortex confinement', 80, 760);
    lCtx.fillText('3. Danger: Imbalance causes petrification into stone toad', 80, 800);

    const lTex = new THREE.CanvasTexture(pageLeftCanvas);

    // 3. Right Page (Character Line-Art & Flying Raijin Formula)
    const pageRightCanvas = document.createElement('canvas');
    pageRightCanvas.width = 1024;
    pageRightCanvas.height = 1024;
    const rCtx = pageRightCanvas.getContext('2d')!;

    rCtx.fillStyle = '#f5efe6';
    rCtx.fillRect(0, 0, 1024, 1024);

    rCtx.strokeStyle = '#c8bda9';
    rCtx.lineWidth = 2;
    rCtx.strokeRect(40, 40, 944, 944);

    rCtx.fillStyle = '#1c1917';
    rCtx.font = 'bold 44px "JetBrains Mono", serif';
    rCtx.textAlign = 'left';
    rCtx.fillText('巻之弐：飛雷神之術 構想図', 80, 120);

    rCtx.font = '22px "JetBrains Mono", monospace';
    rCtx.fillStyle = '#78716c';
    rCtx.fillText('SPACE-TIME FORMULA & JUTSU FORM', 80, 165);

    // Central Kunai Schematic
    rCtx.save();
    rCtx.translate(512, 460);
    rCtx.strokeStyle = '#1e293b';
    rCtx.lineWidth = 4;
    // Kunai blade outline
    rCtx.beginPath();
    rCtx.moveTo(0, -180);
    rCtx.lineTo(40, 30);
    rCtx.lineTo(15, 30);
    rCtx.lineTo(15, 140);
    rCtx.arc(0, 165, 25, 0, Math.PI * 2);
    rCtx.lineTo(-15, 140);
    rCtx.lineTo(-15, 30);
    rCtx.lineTo(-40, 30);
    rCtx.closePath();
    rCtx.stroke();

    // Jutsu formula inscription text along blade
    rCtx.fillStyle = '#dc2626';
    rCtx.font = 'bold 24px monospace';
    rCtx.textAlign = 'center';
    rCtx.fillText('忍 術 飛 雷 神', 0, -30);
    rCtx.restore();

    // Notes
    rCtx.fillStyle = '#292524';
    rCtx.font = '18px "JetBrains Mono", monospace';
    rCtx.textAlign = 'left';
    rCtx.fillText('Formula Marker: Instantaneous dimensional shift beacon', 80, 750);
    rCtx.fillText('Tri-pronged blade allows multi-angle kinetic redirection', 80, 790);
    rCtx.fillText('Special alloy composition: 98% Chakra conductive steel', 80, 830);

    const rTex = new THREE.CanvasTexture(pageRightCanvas);

    return {
      coverTexture: cTex,
      pageTextureLeft: lTex,
      pageTextureRight: rTex,
    };
  }, []);

  // Dispose textures safely on unmount
  useEffect(() => {
    return () => {
      coverTexture.dispose();
      pageTextureLeft.dispose();
      pageTextureRight.dispose();
    };
  }, [coverTexture, pageTextureLeft, pageTextureRight]);

  // Frame animations: floating levitation and smooth scroll-driven cover/page opening
  useFrame((state) => {
    if (!groupRef.current || opacity <= 0.01) return;

    const time = state.clock.getElapsedTime();

    // Gentle desk float
    groupRef.current.position.y = 1.05 + Math.sin(time * 1.8) * 0.025;
    groupRef.current.rotation.y = -0.15 + Math.sin(time * 0.6) * 0.04;

    // Open front cover smoothly based on bookOpenProgress (0 to ~165 degrees)
    if (frontCoverHingeRef.current) {
      const targetAngle = -bookOpenProgress * (Math.PI * 0.92);
      frontCoverHingeRef.current.rotation.y = THREE.MathUtils.lerp(
        frontCoverHingeRef.current.rotation.y,
        targetAngle,
        0.15
      );
    }

    // Flip internal page 1 when book is > 40% open
    if (page1HingeRef.current) {
      const pageProg = Math.max(0, (bookOpenProgress - 0.4) / 0.6);
      const targetPageAngle = -pageProg * (Math.PI * 0.85);
      page1HingeRef.current.rotation.y = THREE.MathUtils.lerp(
        page1HingeRef.current.rotation.y,
        targetPageAngle,
        0.15
      );
    }
  });

  if (opacity <= 0.005) return null;

  const bookWidth = 1.6;
  const bookHeight = 1.25;
  const bookThickness = 0.16;

  return (
    <group
      ref={groupRef}
      position={[0, 1.05, 0]}
      rotation={[0.35, -0.15, 0]}
      onPointerOver={onHover}
      onClick={onClick}
    >
      {/* 1. Book Spine & Back Cover Base */}
      <mesh position={[0, 0, -bookThickness / 2]}>
        <boxGeometry args={[bookWidth, bookHeight, 0.03]} />
        <meshStandardMaterial
          map={coverTexture}
          roughness={0.45}
          metalness={0.2}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Book Spine (Left rounded edge) */}
      <mesh position={[-bookWidth / 2, 0, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[bookThickness / 2, bookThickness / 2, bookHeight, 16, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#3b0609" roughness={0.5} transparent opacity={opacity} />
      </mesh>

      {/* Gold foil decorative spine ridges */}
      {[-0.45, -0.2, 0.0, 0.2, 0.45].map((yOffset, i) => (
        <mesh key={i} position={[-bookWidth / 2, yOffset, 0]}>
          <torusGeometry args={[bookThickness / 2 + 0.005, 0.008, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} transparent opacity={opacity} />
        </mesh>
      ))}

      {/* Gold Gilded Page Block (Right page interior) */}
      <mesh position={[0.01, 0, 0]}>
        <boxGeometry args={[bookWidth - 0.05, bookHeight - 0.04, bookThickness - 0.04]} />
        <meshStandardMaterial
          map={pageTextureRight}
          roughness={0.8}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Gold gilded edges on pages */}
      <mesh position={[bookWidth / 2 - 0.02, 0, 0]}>
        <boxGeometry args={[0.01, bookHeight - 0.04, bookThickness - 0.04]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.85} roughness={0.3} transparent opacity={opacity} />
      </mesh>

      {/* 2. Turnable Internal Page Hinge */}
      <group ref={page1HingeRef} position={[-bookWidth / 2 + 0.04, 0, 0.02]}>
        <mesh position={[bookWidth / 2 - 0.04, 0, 0]}>
          <planeGeometry args={[bookWidth - 0.08, bookHeight - 0.06]} />
          <meshStandardMaterial
            map={pageTextureLeft}
            roughness={0.85}
            side={THREE.DoubleSide}
            transparent
            opacity={opacity}
          />
        </mesh>
      </group>

      {/* 3. Front Cover Hinge (Rotates around left spine) */}
      <group ref={frontCoverHingeRef} position={[-bookWidth / 2, 0, bookThickness / 2]}>
        <mesh position={[bookWidth / 2, 0, 0]}>
          <boxGeometry args={[bookWidth, bookHeight, 0.025]} />
          <meshStandardMaterial
            map={coverTexture}
            roughness={0.4}
            metalness={0.25}
            transparent
            opacity={opacity}
          />
        </mesh>

        {/* Embossed gold corner protectors on front cover */}
        {[
          [bookWidth - 0.06, bookHeight / 2 - 0.06],
          [bookWidth - 0.06, -bookHeight / 2 + 0.06],
        ].map(([cx, cy], idx) => (
          <mesh key={idx} position={[cx, cy, 0.015]}>
            <boxGeometry args={[0.12, 0.12, 0.008]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} transparent opacity={opacity} />
          </mesh>
        ))}
      </group>

      {/* Floating Gold Shinobi Bookmark Ribbon */}
      <mesh position={[0.2, -bookHeight / 2 - 0.18, 0.01]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.08, 0.45, 0.004]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={0.6} transparent opacity={opacity} />
      </mesh>
    </group>
  );
}
