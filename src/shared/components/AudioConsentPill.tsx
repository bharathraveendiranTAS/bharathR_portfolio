import styles from './SharedComponents.module.scss';

interface AudioConsentPillProps {
  soundEnabled: boolean;
  onToggle: () => void;
  onHover?: () => void;
}

export function AudioConsentPill({ soundEnabled, onToggle, onHover }: AudioConsentPillProps) {
  return (
    <button
      type="button"
      id="audio-consent-pill"
      role="switch"
      aria-checked={soundEnabled}
      aria-label="Toggle 3D spatial atmospheric soundscape"
      className={`${styles['audio-pill']} ${soundEnabled ? styles['audio-pill--active'] : ''}`}
      onClick={onToggle}
      onMouseEnter={onHover}
    >
      <div
        className={`${styles['visualizer-bars']} ${soundEnabled ? styles['visualizer-bars--playing'] : ''}`}
        aria-hidden="true"
      >
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <span>{soundEnabled ? 'SOUND [ON]' : 'SOUND [OFF]'}</span>
    </button>
  );
}
