import { useState, useRef, useEffect, useCallback } from 'react';

export interface PortfolioAudioEngine {
  soundEnabled: boolean;
  toggleSound: () => void;
  audioLevel: number;
  onScrollVelocity: (velocity: number) => void;
  playBambooClick: () => void;
  playMetallicSheen: () => void;
  playChakraPulse: () => void;
  playTempleBell: () => void;
  playKunaiTap: () => void;
}

export function usePortfolioAudio(): PortfolioAudioEngine {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const whooshFilterRef = useRef<BiquadFilterNode | null>(null);
  const whooshGainRef = useRef<GainNode | null>(null);
  const droneNodesRef = useRef<{ osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode } | null>(null);
  const lastVelocityTimeRef = useRef<number>(0);

  // Initialize Web Audio graph strictly on explicit user activation
  const initAudio = useCallback(() => {
    if (ctxRef.current) {
      if (ctxRef.current.state === 'suspended') {
        ctxRef.current.resume();
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      ctxRef.current = ctx;

      const master = ctx.createGain();
      master.gain.setValueAtTime(0.5, ctx.currentTime);
      master.connect(ctx.destination);
      masterGainRef.current = master;

      // 1. Ambient Background Sub Drone (Calm meditative mountain air)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const droneFilter = ctx.createBiquadFilter();
      const droneGain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, ctx.currentTime); // Low A1

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(110.3, ctx.currentTime); // A2 slight detune for slow beating

      droneFilter.type = 'lowpass';
      droneFilter.frequency.setValueAtTime(220, ctx.currentTime);

      droneGain.gain.setValueAtTime(0.04, ctx.currentTime);

      osc1.connect(droneFilter);
      osc2.connect(droneFilter);
      droneFilter.connect(droneGain);
      droneGain.connect(master);

      osc1.start();
      osc2.start();
      droneNodesRef.current = { osc1, osc2, gain: droneGain };

      // 2. Continuous Aerodynamic Scroll Whoosh Synthesizer
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const whooshFilter = ctx.createBiquadFilter();
      whooshFilter.type = 'bandpass';
      whooshFilter.frequency.setValueAtTime(320, ctx.currentTime);
      whooshFilter.Q.setValueAtTime(3.0, ctx.currentTime);
      whooshFilterRef.current = whooshFilter;

      const whooshGain = ctx.createGain();
      whooshGain.gain.setValueAtTime(0.0, ctx.currentTime);
      whooshGainRef.current = whooshGain;

      whiteNoise.connect(whooshFilter);
      whooshFilter.connect(whooshGain);
      whooshGain.connect(master);

      whiteNoise.start();
    } catch {
      // Audio context may be restricted in non-user-gesture environments
    }
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      if (next) {
        initAudio();
        if (masterGainRef.current && ctxRef.current) {
          masterGainRef.current.gain.setTargetAtTime(0.5, ctxRef.current.currentTime, 0.1);
        }
      } else {
        if (masterGainRef.current && ctxRef.current) {
          masterGainRef.current.gain.setTargetAtTime(0.0, ctxRef.current.currentTime, 0.1);
        }
      }
      return next;
    });
  }, [initAudio]);

  // Scroll Velocity Modulation: maps velocity to whoosh filter cutoff and volume
  const onScrollVelocity = useCallback(
    (velocity: number) => {
      if (!soundEnabled || !ctxRef.current || !whooshFilterRef.current || !whooshGainRef.current) return;
      const now = ctxRef.current.currentTime;
      if (now - lastVelocityTimeRef.current < 0.03) return;
      lastVelocityTimeRef.current = now;

      const absVel = Math.min(Math.abs(velocity), 3500);
      const intensity = Math.min(absVel / 1800, 1.0);

      // Modulate bandpass frequency between 350Hz (idle) to 2400Hz (rapid whoosh)
      const targetFreq = 350 + intensity * 2050;
      const targetGain = intensity > 0.05 ? Math.min(intensity * 0.28, 0.28) : 0.0;

      whooshFilterRef.current.frequency.setTargetAtTime(targetFreq, now, 0.08);
      whooshGainRef.current.gain.setTargetAtTime(targetGain, now, 0.08);

      setAudioLevel(intensity);
    },
    [soundEnabled]
  );

  // Synthesized Wooden / Bamboo Click on Nav Links
  const playBambooClick = useCallback(() => {
    if (!soundEnabled || !ctxRef.current || !masterGainRef.current) return;
    const ctx = ctxRef.current;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(540, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.045);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGainRef.current);

    osc.start(now);
    osc.stop(now + 0.05);
  }, [soundEnabled]);

  // High-Frequency Metallic Sheen Click when hovering cards/badges
  const playMetallicSheen = useCallback(() => {
    if (!soundEnabled || !ctxRef.current || !masterGainRef.current) return;
    const ctx = ctxRef.current;
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(2600, now);
    osc1.frequency.exponentialRampToValueAtTime(3200, now + 0.06);

    osc2.type = 'square';
    osc2.frequency.setValueAtTime(4400, now);
    osc2.frequency.exponentialRampToValueAtTime(5200, now + 0.06);

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(2200, now);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(masterGainRef.current);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.08);
    osc2.stop(now + 0.08);
  }, [soundEnabled]);

  // Low-Pass Chakra Pulse when scrubbing into Work zone or clicking Rasengan
  const playChakraPulse = useCallback(() => {
    if (!soundEnabled || !ctxRef.current || !masterGainRef.current) return;
    const ctx = ctxRef.current;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.4);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(420, now);
    filter.frequency.exponentialRampToValueAtTime(160, now + 0.4);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGainRef.current);

    osc.start(now);
    osc.stop(now + 0.46);
  }, [soundEnabled]);

  // Resonant Temple Bell Harmonic when hitting the bottom monolith
  const playTempleBell = useCallback(() => {
    if (!soundEnabled || !ctxRef.current || !masterGainRef.current) return;
    const ctx = ctxRef.current;
    const now = ctx.currentTime;

    // Harmonic partials for oriental singing bowl / bell
    const partials = [440, 880 * 1.02, 1320 * 0.98, 1760 * 1.01];
    const amplitudes = [0.18, 0.09, 0.04, 0.02];

    partials.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(amplitudes[idx], now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(gain);
      gain.connect(masterGainRef.current!);

      osc.start(now);
      osc.stop(now + 1.9);
    });
  }, [soundEnabled]);

  // Sharp Kunai Tap (Secondary tactile UI confirmation)
  const playKunaiTap = useCallback(() => {
    if (!soundEnabled || !ctxRef.current || !masterGainRef.current) return;
    const ctx = ctxRef.current;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1450, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.03);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(gain);
    gain.connect(masterGainRef.current);

    osc.start(now);
    osc.stop(now + 0.04);
  }, [soundEnabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (ctxRef.current && ctxRef.current.state !== 'closed') {
        ctxRef.current.close();
      }
    };
  }, []);

  return {
    soundEnabled,
    toggleSound,
    audioLevel,
    onScrollVelocity,
    playBambooClick,
    playMetallicSheen,
    playChakraPulse,
    playTempleBell,
    playKunaiTap,
  };
}
