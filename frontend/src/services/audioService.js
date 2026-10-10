/**
 * ON-DEVICE THREAT GUARD - AUDIO SYNTHESIZER SERVICE
 * 100% client-side synthesized cyber sound effects using the standard Web Audio API.
 * Zero external audio files, zero network downloads, works completely offline.
 */

class AudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.isEnabled = true;
  }

  getContext() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  toggleSound(enabled) {
    this.isEnabled = enabled !== undefined ? enabled : !this.isEnabled;
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('tg_sound_enabled', String(this.isEnabled));
    }
    return this.isEnabled;
  }

  isSoundEnabled() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem('tg_sound_enabled');
      if (saved !== null) {
        this.isEnabled = saved === 'true';
      }
    }
    return this.isEnabled;
  }

  /**
   * Cyber Threat Warning Alarm: Dual-tone dissonant alert (high-low square pulse)
   */
  playWarningAlarm() {
    if (!this.isSoundEnabled()) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'square';

      // Pitch sweep
      osc1.frequency.setValueAtTime(880, now);
      osc1.frequency.exponentialRampToValueAtTime(440, now + 0.15);
      osc1.frequency.setValueAtTime(880, now + 0.18);
      osc1.frequency.exponentialRampToValueAtTime(330, now + 0.35);

      osc2.frequency.setValueAtTime(440, now);
      osc2.frequency.exponentialRampToValueAtTime(220, now + 0.35);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.38);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.4);
      osc2.stop(now + 0.4);
    } catch {}
  }

  /**
   * Victory / Remediation Harmonic Chime: Ascending major triad (C-E-G-C)
   */
  playResolutionChime() {
    if (!this.isSoundEnabled()) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.4);
      });
    } catch {}
  }

  /**
   * Subtle Cyber Blip for UI interactions
   */
  playClickBlip() {
    if (!this.isSoundEnabled()) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.06);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {}
  }
}

export const audioService = new AudioSynthesizer();
