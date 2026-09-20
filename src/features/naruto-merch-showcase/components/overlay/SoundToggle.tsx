import React from 'react';
import styles from '../../styles/NarutoShowcase.module.scss';

interface SoundToggleProps {
  soundEnabled: boolean;
  onToggle: () => void;
  onHover?: () => void;
}

export function SoundToggle({ soundEnabled, onToggle, onHover }: SoundToggleProps) {
  return (
    <button
      type="button"
      id="naruto-sound-toggle"
      role="switch"
      aria-checked={soundEnabled}
      aria-label="Toggle shinobi spatial ambient audio"
      className={`${styles['naruto-showcase__sound-btn']} ${
        soundEnabled ? styles['naruto-showcase__sound-btn--active'] : ''
      }`}
      onClick={onToggle}
      onMouseEnter={onHover}
    >
      {soundEnabled ? (
        <span className={styles['naruto-showcase__sound-wave']} aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </span>
      ) : (
        <span style={{ opacity: 0.6 }} aria-hidden="true">✕</span>
      )}
      <span>{soundEnabled ? 'Audio [ON]' : 'Audio [MUTED]'}</span>
    </button>
  );
}
