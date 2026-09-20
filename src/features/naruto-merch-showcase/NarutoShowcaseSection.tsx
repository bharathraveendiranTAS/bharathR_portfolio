import React, { useRef, useState, useEffect } from 'react';
import { useShowcaseScroll } from './hooks/useShowcaseScroll';
import { useSpatialSFX } from './hooks/useSpatialSFX';
import { SceneCanvas } from './components/canvas/SceneCanvas';
import { SectionHUD } from './components/overlay/SectionHUD';
import { ProductItem } from './types';
import styles from './styles/NarutoShowcase.module.scss';

// Product Catalog Data strictly themed around Naruto aesthetics
const NARUTO_PRODUCTS: ProductItem[] = [
  {
    id: 'uzumaki-sage-figure',
    stageIndex: 0,
    category: '1:6 SCALE STATUE',
    kanjiCategory: '壱・仙人造形',
    title: 'Sage Mode Uzumaki: Rasengan Surge',
    subtitle: '木ノ葉 仙術発動 // SENJUTSU ASCENSION',
    description:
      'Polystone masterwork depicting the Sennin Mode awakening. Includes magnetic dual kunai, embroidered vermilion sage cloak with flame trim, and an internally lit swirling Rasengan core with dynamic vortex particles.',
    specs: {
      scaleOrFormat: '1:6 Scale (34cm)',
      material: 'Cold-Cast Resin & Poly-Stone',
      editionLimit: 'Limited to 500 Worldwide',
      chakraAffinity: 'Wind Release (風遁)',
      price: '$380 USD',
      dimensions: '340mm × 260mm × 240mm',
    },
    rarityBadge: 'MYTHIC // S-RANK',
    primaryActionLabel: 'Claim into Vault',
    secondaryActionLabel: 'Inspect 360°',
  },
  {
    id: 'shinobi-lore-codex',
    stageIndex: 1,
    category: 'ART BOOK & CODEX',
    kanjiCategory: '弐・秘伝絵巻',
    title: 'Shinobi Chronicles: Jutsu & Ink Codex',
    subtitle: '木ノ葉 秘伝忍絵巻 // SUMI-E ARCHIVE',
    description:
      'Collector hardbound codex bound in crimson textured leather with embossed gold leaf crest. Over 280 pages of Japanese sumi-e ink washes, anatomical chakra network diagrams, and authentic jutsu formula scrolls.',
    specs: {
      scaleOrFormat: 'A4 Deluxe Hardbound (280p)',
      material: 'Warm Parchment & Gold Foil Leaf',
      editionLimit: 'First Print // 1,200 Copies',
      chakraAffinity: 'Universal (全属性)',
      price: '$120 USD',
      dimensions: '297mm × 210mm × 32mm',
    },
    rarityBadge: 'LEGENDARY // A-RANK',
    primaryActionLabel: 'Acquire Codex',
    secondaryActionLabel: 'Preview Folio',
  },
  {
    id: 'holographic-chakra-seals',
    stageIndex: 2,
    category: 'PRISMATIC SEALS',
    kanjiCategory: '参・封印札',
    title: 'Holographic Chakra Talisman 6-Pack',
    subtitle: '八卦封印・飛雷神 // FOIL EMBOSSED',
    description:
      'Set of 6 die-cut holographic seal cards featuring the Eight Trigrams Sealing Style, Minato Flying Raijin formula, and Heaven Cursed Seal. Reacts with authentic spectral rainbow diffraction and metallic sheen.',
    specs: {
      scaleOrFormat: 'Collector Pack (6 Talismans)',
      material: '350gsm Optical Rainbow Foil',
      editionLimit: '2,500 Sets Distributed',
      chakraAffinity: 'Space-Time (時空間)',
      price: '$45 USD',
      dimensions: '148mm × 105mm × 0.8mm',
    },
    rarityBadge: 'SPECIAL EDITION',
    primaryActionLabel: 'Collect Seal Pack',
    secondaryActionLabel: 'View Grating',
  },
];

export function NarutoShowcaseSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize Spatial Web Audio Engine
  const audio = useSpatialSFX();

  // Initialize GSAP ScrollTrigger timeline and scrub controller
  const {
    progress,
    activeStage,
    bookOpenProgress,
    isReducedMotion,
    scrollToStage,
  } = useShowcaseScroll({
    containerRef,
    onVelocityChange: audio.onScrollVelocity,
    onPageTurnSFX: audio.playPaperRustle,
    onChakraSFX: audio.playChakraHum,
  });

  // IntersectionObserver to pause R3F rendering loop when outside viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: '100px 0px 100px 0px', threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Show temporary toast feedback on user interactions
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const handleClaim = (product: ProductItem) => {
    audio.playSealActivate();
    triggerToast(`⚡ Added "${product.title}" to your Shinobi Vault!`);
  };

  const handleInspect = (product: ProductItem) => {
    audio.playKunaiTap();
    triggerToast(`🔍 Inspecting 3D details for ${product.title}`);
  };

  return (
    <section
      id="naruto-showcase"
      ref={containerRef}
      className={styles['naruto-showcase']}
      aria-label="Interactive 3D Naruto Shinobi Merchandise Showcase"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className={styles['naruto-showcase__toast']} role="status" aria-live="polite">
          <span aria-hidden="true">巻</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Reduced Motion Accessible Alternative */}
      {isReducedMotion ? (
        <div className={styles['naruto-showcase__reduced-motion-grid']}>
          {NARUTO_PRODUCTS.map((p) => (
            <div key={p.id} className={styles['naruto-showcase__reduced-card']}>
              <div>
                <div style={{ color: 'var(--vermilion)', fontFamily: 'JetBrains Mono', fontSize: '0.8rem' }}>
                  {p.kanjiCategory}
                </div>
                <h3 style={{ fontSize: '1.4rem', margin: '0.4rem 0' }}>{p.title}</h3>
                <p style={{ color: 'var(--parchment-muted)', fontSize: '0.85rem' }}>{p.description}</p>
                <div style={{ margin: '1rem 0', fontFamily: 'JetBrains Mono', fontSize: '0.8rem' }}>
                  <div><strong>Scale:</strong> {p.specs.scaleOrFormat}</div>
                  <div><strong>Materials:</strong> {p.specs.material}</div>
                  <div><strong>Price:</strong> {p.specs.price}</div>
                </div>
              </div>
              <button
                type="button"
                className={styles['naruto-showcase__btn-primary']}
                onClick={() => handleClaim(p)}
              >
                {p.primaryActionLabel}
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* Pinned Interactive 3D Showcase Viewport */
        <div className={styles['naruto-showcase__viewport-container']}>
          {/* R3F 3D Canvas Layer */}
          <div className={styles['naruto-showcase__canvas-wrapper']}>
            <SceneCanvas
              progress={progress}
              bookOpenProgress={bookOpenProgress}
              isVisible={isVisible}
              onFigureHover={audio.playKunaiTap}
              onFigureClick={() => {
                audio.playChakraHum();
                triggerToast('🌀 Rasengan vortex resonates with your chakra!');
              }}
              onBookHover={audio.playPaperRustle}
              onBookClick={() => {
                audio.playPaperRustle();
                triggerToast('📖 Sumi-e Ninjutsu Codex unrolls ancient secrets.');
              }}
              onCardHover={() => audio.playChakraHum()}
              onCardClick={(idx) => {
                audio.playSealActivate();
                triggerToast(`✨ Sealing Formula #0${idx + 1} activated!`);
              }}
            />
          </div>

          {/* Accessible Kinetic HUD & Overlay Elements */}
          <SectionHUD
            activeStage={activeStage}
            progress={progress}
            products={NARUTO_PRODUCTS}
            audio={audio}
            onSelectStage={scrollToStage}
            onClaimProduct={handleClaim}
            onInspectProduct={handleInspect}
          />
        </div>
      )}
    </section>
  );
}

export default NarutoShowcaseSection;
