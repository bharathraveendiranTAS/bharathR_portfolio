import React from 'react';
import { ProductItem, ShowcaseAudioEngine } from '../../types';
import { SoundToggle } from './SoundToggle';
import { ProductCard } from './ProductCard';
import styles from '../../styles/NarutoShowcase.module.scss';

interface SectionHUDProps {
  activeStage: number;
  progress: number;
  products: ProductItem[];
  audio: ShowcaseAudioEngine;
  onSelectStage: (stageIndex: number) => void;
  onClaimProduct: (product: ProductItem) => void;
  onInspectProduct: (product: ProductItem) => void;
}

export function SectionHUD({
  activeStage,
  progress,
  products,
  audio,
  onSelectStage,
  onClaimProduct,
  onInspectProduct,
}: SectionHUDProps) {
  const currentProduct = products[activeStage] || products[0];

  const stagesList = [
    { label: '01', kanji: '壱', name: 'SAGE FIGURE' },
    { label: '02', kanji: '弐', name: 'LORE CODEX' },
    { label: '03', kanji: '参', name: 'HOLO SEALS' },
  ];

  return (
    <div className={styles['naruto-showcase__overlay-layer']}>
      {/* 1. Top Bar */}
      <div className={styles['naruto-showcase__top-bar']}>
        {/* Kicker badge */}
        <div className={styles['naruto-showcase__kicker']}>
          <span className={styles['naruto-showcase__kicker-tag']}>SHINOBI VAULT</span>
          <span className={styles['naruto-showcase__kicker-kanji']}>{currentProduct.kanjiCategory}</span>
          <span style={{ opacity: 0.7 }}>// {currentProduct.category}</span>
        </div>

        {/* Center: Stage Stepper Pagination */}
        <nav
          className={styles['naruto-showcase__stage-stepper']}
          aria-label="Merchandise showcase stages"
        >
          {stagesList.map((st, idx) => (
            <button
              key={st.label}
              type="button"
              id={`stage-step-btn-${idx}`}
              className={`${styles['naruto-showcase__step-dot']} ${
                activeStage === idx ? styles['naruto-showcase__step-dot--active'] : ''
              }`}
              onClick={() => {
                audio.playKunaiTap();
                onSelectStage(idx);
              }}
              onMouseEnter={audio.playKunaiTap}
              aria-label={`Jump to ${st.name} showcase`}
            >
              {st.label}
            </button>
          ))}
        </nav>

        {/* Right: Accessible Sound Toggle */}
        <SoundToggle
          soundEnabled={audio.soundEnabled}
          onToggle={audio.toggleSound}
          onHover={audio.playKunaiTap}
        />
      </div>

      {/* 2. Kinetic Hero Title Banner */}
      <div className={styles['naruto-showcase__title-banner']}>
        <div className={styles['naruto-showcase__japanese-title']}>
          {currentProduct.subtitle}
        </div>
        <h2 className={styles['naruto-showcase__main-heading']}>
          {activeStage === 0 && (
            <>
              SAGE MODE <span>COLLECTIBLE</span>
            </>
          )}
          {activeStage === 1 && (
            <>
              SHINOBI <span>LORE ARCHIVE</span>
            </>
          )}
          {activeStage === 2 && (
            <>
              HOLOGRAPHIC <span>CHAKRA FOIL</span>
            </>
          )}
        </h2>
        <p className={styles['naruto-showcase__subtext']}>
          {activeStage === 0 &&
            'Museum-grade 1:6 scale poly-stone sculpture with levitating Rasengan core, dual forged kunai, and interactive swirling chakra vortex.'}
          {activeStage === 1 &&
            'Hand-bound crimson accordion codex featuring Japanese sumi-e ink washes, scroll schematics, and confidential jutsu formulas.'}
          {activeStage === 2 &&
            'Precision die-cut prismatic talisman cards with real-time thin-film wave interference and view-reactive optical iridescence.'}
        </p>
      </div>

      {/* 3. Bottom Glassmorphic Spec Card */}
      <div className={styles['naruto-showcase__spec-card-container']}>
        <ProductCard
          product={currentProduct}
          onClaim={onClaimProduct}
          onInspect={onInspectProduct}
          onHover={audio.playKunaiTap}
        />
      </div>

      {/* 4. Bottom Kinetic Scroll Progress & Scrub Guide */}
      <div className={styles['naruto-showcase__scrub-guide']}>
        <span>01 FIGURE</span>
        <div className={styles['naruto-showcase__scrub-track']} aria-hidden="true">
          <div
            className={styles['naruto-showcase__scrub-fill']}
            style={{ width: `${Math.round(progress * 100)}%` }}
          ></div>
        </div>
        <span>03 SEALS</span>
      </div>
    </div>
  );
}
