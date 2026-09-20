import { useState, useRef, useEffect, useCallback } from 'react';
import { ShowcaseAudioEngine } from '../types';

/**
 * Headless Spatial Audio Engine powered by the native Web Audio API.
 * Synthesizes ambient mountain wind, bamboo flute micro-harmonics,
 * and tactical shinobi micro-SFX with zero external audio assets.
 */
export function useSpatialSFX(): ShowcaseAudioEngine {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  
  // Ambient Sound Nodes
  const masterGainRef = useRef<GainNode | null>(null);
  const windGainRef = useRef<GainNode | null>(null);
  const windFilterRef = useRef<BiquadFilterNode | null>(null);
  const fluteGainRef = useRef<GainNode | null>(null);
  const fluteOscRef = useRef<OscillatorNode | null>(null);
  const fluteSubOscRef = useRef<OscillatorNode | null>(null);

  // Lazy Initialization on User Consent (Autoplay compliant)
  const initAudio = useCallback(() => {
    if (audioCtxRef.current) {
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      return;
    }

    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtxClass();
      audioCtxRef.current = ctx;

      // Master Output with subtle soft-limiter saturation
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.35, ctx.currentTime);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // 1. Synthesize Ambient Mountain Wind (Noise Buffer + Bandpass Filter)
      const bufferSize = ctx.sampleRate * 3;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }

      const whiteNoiseSource = ctx.createBufferSource();
      whiteNoiseSource.buffer = noiseBuffer;
      whiteNoiseSource.loop = true;

      const windFilter = ctx.createBiquadFilter();
      windFilter.type = 'bandpass';
      windFilter.frequency.setValueAtTime(420, ctx.currentTime);
      windFilter.Q.setValueAtTime(1.8, ctx.currentTime);
      windFilterRef.current = windFilter;

      const windGain = ctx.createGain();
      windGain.gain.setValueAtTime(0.08, ctx.currentTime);
      windGainRef.current = windGain;

      whiteNoiseSource.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(masterGain);
      whiteNoiseSource.start();

      // 2. Synthesize Subtle Bamboo Flute Harmonic (Shakuhachi / D-minor pentatonic tone)
      const fluteOsc = ctx.createOscillator();
      fluteOsc.type = 'sine';
      fluteOsc.frequency.setValueAtTime(293.66, ctx.currentTime); // D4 note

      const fluteSubOsc = ctx.createOscillator();
      fluteSubOsc.type = 'triangle';
      fluteSubOsc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 harmonic

      const fluteGain = ctx.createGain();
      fluteGain.gain.setValueAtTime(0.015, ctx.currentTime);
      fluteGainRef.current = fluteGain;

      fluteOsc.connect(fluteGain);
      fluteSubOsc.connect(fluteGain);
      fluteGain.connect(masterGain);

      fluteOsc.start();
      fluteSubOsc.start();
      fluteOscRef.current = fluteOsc;
      fluteSubOscRef.current = fluteSubOsc;

    } catch (e) {
      console.warn('Web Audio API not supported or blocked:', e);
    }
  }, []);

  const toggleSound = useCallback(() => {
    if (!soundEnabled) {
      initAudio();
      setSoundEnabled(true);
      if (masterGainRef.current && audioCtxRef.current) {
        masterGainRef.current.gain.setTargetAtTime(0.35, audioCtxRef.current.currentTime, 0.15);
      }
    } else {
      setSoundEnabled(false);
      if (masterGainRef.current && audioCtxRef.current) {
        masterGainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.15);
      }
    }
  }, [soundEnabled, initAudio]);

  // Modulate wind whoosh based on ScrollTrigger velocity
  const onScrollVelocity = useCallback((velocity: number) => {
    if (!soundEnabled || !audioCtxRef.current || !windFilterRef.current || !windGainRef.current) return;
    const ctx = audioCtxRef.current;
    const speed = Math.min(Math.abs(velocity), 3000);
    const targetFreq = 420 + (speed / 3000) * 1200;
    const targetGain = 0.08 + (speed / 3000) * 0.22;

    windFilterRef.current.frequency.setTargetAtTime(targetFreq, ctx.currentTime, 0.08);
    windGainRef.current.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.08);
  }, [soundEnabled]);

  // Micro-SFX 1: Tactical Kunai Tap on UI Hover
  const playKunaiTap = useCallback(() => {
    if (!soundEnabled || !audioCtxRef.current || !masterGainRef.current) return;
    const ctx = audioCtxRef.current;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(2400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);

    osc.connect(gain);
    gain.connect(masterGainRef.current);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  }, [soundEnabled]);

  // Micro-SFX 2: Gentle Scroll / Paper Rustle
  const playPaperRustle = useCallback(() => {
    if (!soundEnabled || !audioCtxRef.current || !masterGainRef.current) return;
    const ctx = audioCtxRef.current;

    const bufferSize = ctx.sampleRate * 0.15;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.04));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1400, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGainRef.current);

    noise.start();
  }, [soundEnabled]);

  // Micro-SFX 3: Resonant Chakra Hum
  const playChakraHum = useCallback(() => {
    if (!soundEnabled || !audioCtxRef.current || !masterGainRef.current) return;
    const ctx = audioCtxRef.current;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(432, ctx.currentTime); // Chakra fundamental
    osc2.frequency.setValueAtTime(436, ctx.currentTime); // 4Hz beat frequency

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.14, ctx.currentTime + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(masterGainRef.current);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.48);
    osc2.stop(ctx.currentTime + 0.48);
  }, [soundEnabled]);

  // Micro-SFX 4: Jutsu Seal Activation Chime
  const playSealActivate = useCallback(() => {
    if (!soundEnabled || !audioCtxRef.current || !masterGainRef.current) return;
    const ctx = audioCtxRef.current;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + idx * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.12, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);

      osc.connect(gain);
      gain.connect(masterGainRef.current!);

      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }, [soundEnabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return {
    isSupported: typeof window !== 'undefined' && ('AudioContext' in window || 'webkitAudioContext' in window),
    soundEnabled,
    toggleSound,
    playKunaiTap,
    playPaperRustle,
    playChakraHum,
    playSealActivate,
    onScrollVelocity,
  };
}
