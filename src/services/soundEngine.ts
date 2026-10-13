// Enhanced Audio Engine supporting both Real Audio Assets (via HTML5/WebAudio file loader)
// and high-fidelity procedural Web Audio synthesis fallback for 100% offline, zero-latency reliability.

export type SoundAssetKey =
  | 'crunch_tanghulu'
  | 'slurp_spicy'
  | 'slurp_mild'
  | 'slurp_brown'
  | 'crunch_chips'
  | 'crunch_crispy'
  | 'crunch_chicken'
  | 'chew_burger'
  | 'squish_jelly'
  | 'melt_icecream'
  | 'sip_drink'
  | 'boil_water'
  | 'fry_sizzle'
  | 'chop_knife'
  | 'stir_noodles'
  | 'packet_tear'
  | 'blender_whirr'
  | 'coin_collect'
  | 'girl_giggle'
  | 'girl_yum';

const AUDIO_ASSET_PATHS: Record<SoundAssetKey, string> = {
  crunch_tanghulu: '/audio/asmr_crunch_tanghulu.mp3',
  slurp_spicy: '/audio/asmr_slurp_spicy.mp3',
  slurp_mild: '/audio/asmr_slurp_mild.mp3',
  slurp_brown: '/audio/asmr_slurp_brown.mp3',
  crunch_chips: '/audio/asmr_crunch_chips.mp3',
  crunch_crispy: '/audio/asmr_crunch_crispy.mp3',
  crunch_chicken: '/audio/asmr_crunch_chicken.mp3',
  chew_burger: '/audio/asmr_chew_burger.mp3',
  squish_jelly: '/audio/asmr_squish_jelly.mp3',
  melt_icecream: '/audio/asmr_melt_icecream.mp3',
  sip_drink: '/audio/asmr_sip_drink.mp3',
  boil_water: '/audio/cook_boil_water.mp3',
  fry_sizzle: '/audio/cook_fry_sizzle.mp3',
  chop_knife: '/audio/cook_chop_knife.mp3',
  stir_noodles: '/audio/cook_stir_noodles.mp3',
  packet_tear: '/audio/cook_packet_tear.mp3',
  blender_whirr: '/audio/cook_blender_whirr.mp3',
  coin_collect: '/audio/ui_coin_collect.mp3',
  girl_giggle: '/audio/voice_girl_giggle.mp3',
  girl_yum: '/audio/voice_girl_yum.mp3',
};

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private asmrVol: number = 0.9;
  private cookingVol: number = 0.85;
  private musicVol: number = 0.45;
  private musicInterval: number | null = null;
  private isMusicPlaying: boolean = false;

  // Cached HTML5 audio elements for file playback
  private audioElements: Map<SoundAssetKey, HTMLAudioElement> = new Map();
  private availableAssets: Set<SoundAssetKey> = new Set();

  constructor() {
    this.probeAudioAssets();
  }

  // Pre-probe external audio files if available
  private probeAudioAssets() {
    if (typeof window === 'undefined') return;
    Object.entries(AUDIO_ASSET_PATHS).forEach(([key, path]) => {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.src = path;
      audio.addEventListener('canplaythrough', () => {
        this.availableAssets.add(key as SoundAssetKey);
      });
      audio.addEventListener('error', () => {
        // Safe fallback: mark as unavailable so procedural synthesis handles it seamlessly
        this.availableAssets.delete(key as SoundAssetKey);
      });
      this.audioElements.set(key as SoundAssetKey, audio);
    });
  }

  public initContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolumes(settings: {
    masterMute: boolean;
    asmrVolume: number;
    cookingVolume: number;
    musicVolume: number;
  }) {
    this.isMuted = settings.masterMute;
    this.asmrVol = settings.asmrVolume;
    this.cookingVol = settings.cookingVolume;
    this.musicVol = settings.musicVolume;
  }

  // Try real audio asset first; fallback cleanly to procedural synth
  private playAudioAssetOrFallback(key: SoundAssetKey, volume: number, fallbackFn: () => void) {
    if (this.isMuted || volume <= 0) return;

    if (this.availableAssets.has(key)) {
      const audio = this.audioElements.get(key);
      if (audio) {
        audio.volume = Math.max(0, Math.min(1, volume));
        audio.currentTime = 0;
        audio.play().catch(() => {
          // If browser blocked or file failed, fallback to synthesis immediately
          fallbackFn();
        });
        return;
      }
    }
    fallbackFn();
  }

  // --- UI Sound Effects ---
  public playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(560, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);

    gain.gain.setValueAtTime(0.2 * this.asmrVolMultiplier(), now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  public playCoin() {
    this.playAudioAssetOrFallback('coin_collect', this.asmrVolMultiplier(), () => {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [987.77, 1318.51, 1567.98]; // B5, E6, G6
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        const t = now + idx * 0.07;
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.22 * this.asmrVolMultiplier(), t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(t);
        osc.stop(t + 0.22);
      });
    });
  }

  public playFanfare() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const melody = [
      { f: 523.25, t: 0.0, d: 0.12 },
      { f: 659.25, t: 0.12, d: 0.12 },
      { f: 783.99, t: 0.24, d: 0.12 },
      { f: 1046.5, t: 0.36, d: 0.4 },
    ];

    melody.forEach((note) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, now + note.t);

      gain.gain.setValueAtTime(0.28 * this.asmrVolMultiplier(), now + note.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + note.d);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now + note.t);
      osc.stop(now + note.t + note.d);
    });
  }

  public playGirlGiggle() {
    this.playAudioAssetOrFallback('girl_giggle', this.asmrVolMultiplier(), () => {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [680, 850, 1020, 890].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        const t = now + idx * 0.09;
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.15, t + 0.08);

        gain.gain.setValueAtTime(0.18 * this.asmrVolMultiplier(), t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(t);
        osc.stop(t + 0.1);
      });
    });
  }

  public playGirlYum() {
    this.playAudioAssetOrFallback('girl_yum', this.asmrVolMultiplier(), () => {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Satisfied soft "Mmm~" hum
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(380, now + 0.25);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.55);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.2 * this.asmrVolMultiplier(), now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.55);
    });
  }

  // --- Cooking Sound Synthesizers ---
  public playBoilingWater(durationSec = 1.3) {
    this.playAudioAssetOrFallback('boil_water', this.cookingVolMultiplier(), () => {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const bufferSize = Math.floor(this.ctx.sampleRate * durationSec);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.35;
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, now);
      filter.Q.setValueAtTime(3.8, now);

      for (let i = 0; i < 8; i++) {
        filter.frequency.exponentialRampToValueAtTime(
          320 + Math.random() * 420,
          now + (i * durationSec) / 8
        );
      }

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35 * this.cookingVolMultiplier(), now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + durationSec);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noiseSource.start(now);
      noiseSource.stop(now + durationSec);
    });
  }

  public playFryingSizzle(durationSec = 1.5) {
    this.playAudioAssetOrFallback('fry_sizzle', this.cookingVolMultiplier(), () => {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const bufferSize = Math.floor(this.ctx.sampleRate * durationSec);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (0.35 + Math.random() * 0.55);
      }

      const source = this.ctx.createBufferSource();
      source.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1600, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.38 * this.cookingVolMultiplier(), now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + durationSec);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      source.start(now);
      source.stop(now + durationSec);
    });
  }

  public playChop() {
    this.playAudioAssetOrFallback('chop_knife', this.cookingVolMultiplier(), () => {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Woody board thud
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.07);

      gain.gain.setValueAtTime(0.55 * this.cookingVolMultiplier(), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      // Knife blade click
      const snapOsc = this.ctx.createOscillator();
      const snapGain = this.ctx.createGain();
      snapOsc.type = 'sine';
      snapOsc.frequency.setValueAtTime(1400, now);
      snapOsc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
      snapGain.gain.setValueAtTime(0.3 * this.cookingVolMultiplier(), now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      snapOsc.connect(snapGain);
      snapGain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
      snapOsc.start(now);
      snapOsc.stop(now + 0.04);
    });
  }

  public playStir() {
    this.playAudioAssetOrFallback('stir_noodles', this.cookingVolMultiplier(), () => {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(190, now);
      osc.frequency.linearRampToValueAtTime(280, now + 0.15);
      osc.frequency.linearRampToValueAtTime(170, now + 0.3);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);

      gain.gain.setValueAtTime(0.32 * this.cookingVolMultiplier(), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.32);
    });
  }

  public playPacketTear() {
    this.playAudioAssetOrFallback('packet_tear', this.cookingVolMultiplier(), () => {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const duration = 0.28;
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.75;
      }

      const source = this.ctx.createBufferSource();
      source.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400, now);
      filter.frequency.exponentialRampToValueAtTime(800, now + duration);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.42 * this.cookingVolMultiplier(), now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      source.start(now);
      source.stop(now + duration);
    });
  }

  public playBlender(durationSec = 1.6) {
    this.playAudioAssetOrFallback('blender_whirr', this.cookingVolMultiplier(), () => {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.5);
      osc.frequency.exponentialRampToValueAtTime(360, now + durationSec);

      gain.gain.setValueAtTime(0.26 * this.cookingVolMultiplier(), now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + durationSec);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + durationSec);
    });
  }

  // --- Real / Synthesized ASMR Food Audio ---

  // 1. Noodle Slurp (Spicy vs Mild vs Brown)
  public playNoodleSlurp(type: 'spicy' | 'mild' | 'brown' = 'mild') {
    const assetKey: SoundAssetKey =
      type === 'spicy' ? 'slurp_spicy' : type === 'brown' ? 'slurp_brown' : 'slurp_mild';

    this.playAudioAssetOrFallback(assetKey, this.asmrVolMultiplier(), () => {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const duration = type === 'spicy' ? 0.75 : 0.65;

      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(270, now + duration * 0.4);
      osc.frequency.exponentialRampToValueAtTime(170, now + duration);

      filter.type = 'bandpass';
      filter.Q.setValueAtTime(type === 'spicy' ? 6.5 : 4.5, now);
      filter.frequency.setValueAtTime(type === 'spicy' ? 650 : 480, now);
      filter.frequency.exponentialRampToValueAtTime(
        type === 'spicy' ? 1800 : 1250,
        now + duration * 0.5
      );
      filter.frequency.exponentialRampToValueAtTime(320, now + duration);

      gain.gain.setValueAtTime(0.42 * this.asmrVolMultiplier(), now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);

      setTimeout(() => {
        this.playChewBursts(3, 0.08);
      }, duration * 600);
    });
  }

  // 0. SIGNATURE TANGHULU CRUNCH (Iconic Glass Sugar Shell Shatter + Juicy Fruit Squish)
  public playTanghuluCrunch(hasPopping = false) {
    this.playAudioAssetOrFallback('crunch_tanghulu', this.asmrVolMultiplier(), () => {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Part 1: Glassy Sugar Shell Snap (Sharp High Transient)
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.08);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = buffer;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.setValueAtTime(3600, now);
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.7 * this.asmrVolMultiplier(), now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noiseSource.start(now);
      noiseSource.stop(now + 0.08);

      // Part 2: Sugar Crystal Resonance (Dual High Pings)
      [1920, 2450].forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.7, now + 0.1);
        gain.gain.setValueAtTime(0.3 * this.asmrVolMultiplier(), now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now);
        osc.stop(now + 0.1);
      });

      // Part 3: Juicy Fruit Bite (Warm Resonant Transient)
      const fruitOsc = this.ctx.createOscillator();
      const fruitGain = this.ctx.createGain();
      fruitOsc.type = 'sine';
      fruitOsc.frequency.setValueAtTime(340, now);
      fruitOsc.frequency.exponentialRampToValueAtTime(110, now + 0.12);
      fruitGain.gain.setValueAtTime(0.35 * this.asmrVolMultiplier(), now);
      fruitGain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
      fruitOsc.connect(fruitGain);
      fruitGain.connect(this.ctx.destination);
      fruitOsc.start(now);
      fruitOsc.stop(now + 0.13);

      // Part 4: Delicious Crunchy Chewing Follow-up
      setTimeout(() => {
        this.playChewBursts(3, 0.07);
      }, 140);

      // Optional Part 5: Popping Candy Fizzle
      if (hasPopping) {
        setTimeout(() => {
          this.playPoppingFizzle();
        }, 220);
      }
    });
  }

  // Popping Candy Micro Clicks
  public playPoppingFizzle() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    for (let i = 0; i < 7; i++) {
      const t = now + i * 0.05 + Math.random() * 0.02;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(2600 + Math.random() * 1400, t);
      gain.gain.setValueAtTime(0.12 * this.asmrVolMultiplier(), t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.02);
    }
  }

  // Live Stream Heart Pop
  public playHeartPop() {
    if (!this.ctx || this.isMuted) return;
    this.initContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);
    gain.gain.setValueAtTime(0.15 * this.asmrVolMultiplier(), now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  // Superchat Donation Bell
  public playSuperchatDonation() {
    if (!this.ctx || this.isMuted) return;
    this.initContext();
    const now = this.ctx.currentTime;
    [1046.5, 1318.5, 1567.98, 2093.0].forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      const t = now + idx * 0.08;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.28 * this.asmrVolMultiplier(), t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(t);
      osc.stop(t + 0.3);
    });
  }

  // --- Real-time Hand-to-Mouth ASMR Interactions ---

  // 1. Skewer Wood Handling & Food Movement Sound
  public playSkewerHandling() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Soft tactile woody click / friction
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.06);

    gain.gain.setValueAtTime(0.18 * this.asmrVolMultiplier(), now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  // 2. High-Precision "sharp-crack" variant for the initial bite (Hard brittle sugar shell fracture & snap)
  public playSharpCrack(variation = 0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Pitch shift variations based on bite index
    const baseFreq = [4000, 4400, 3700, 4250][variation % 4];
    const pingA = [2250, 2580, 2080, 2700][variation % 4];
    const pingB = [3100, 3450, 2900, 3600][variation % 4];

    // Layer 1: High-frequency brittle crack noise transient (immediate at exact millisecond)
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.085);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2.2);
    }
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(baseFreq, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.95 * this.asmrVolMultiplier(), now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noiseSource.start(now);
    noiseSource.stop(now + 0.085);

    // Layer 2: Crystal Glassy Ringing Pings
    [pingA, pingB].forEach((freq) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.65, now + 0.12);
      gain.gain.setValueAtTime(0.38 * this.asmrVolMultiplier(), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    });

    // Layer 3: Solid Tooth Snap Impact (Low-Mid transient body)
    const snapOsc = this.ctx.createOscillator();
    const snapGain = this.ctx.createGain();
    snapOsc.type = 'sine';
    snapOsc.frequency.setValueAtTime(460, now);
    snapOsc.frequency.exponentialRampToValueAtTime(80, now + 0.08);
    snapGain.gain.setValueAtTime(0.44 * this.asmrVolMultiplier(), now);
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    snapOsc.connect(snapGain);
    snapGain.connect(this.ctx.destination);
    snapOsc.start(now);
    snapOsc.stop(now + 0.08);
  }

  // Alias for backward compatibility
  public playTanghuluGlassSnap(variation = 0) {
    this.playSharpCrack(variation);
  }

  // 3. Realistic "juicy-mush" variant for subsequent chews and pulp mastication
  public playJuicyMush(variation = 0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const baseTones = [190, 220, 170, 240];
    const tone = baseTones[variation % baseTones.length];

    // Layer 1: Resonant jaw mastication compression
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(tone, now);
    osc.frequency.exponentialRampToValueAtTime(75, now + 0.1);

    gain.gain.setValueAtTime(0.36 * this.asmrVolMultiplier(), now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);

    // Layer 2: Saliva squelch & wet texture micro-clicks
    const squelchCount = 2 + (variation % 2);
    for (let i = 0; i < squelchCount; i++) {
      const t = now + 0.02 + i * 0.035;
      const squelchOsc = this.ctx.createOscillator();
      const squelchGain = this.ctx.createGain();
      squelchOsc.type = 'sine';
      squelchOsc.frequency.setValueAtTime(1100 + (variation * 180) + Math.random() * 300, t);
      squelchOsc.frequency.exponentialRampToValueAtTime(280, t + 0.04);
      squelchGain.gain.setValueAtTime(0.16 * this.asmrVolMultiplier(), t);
      squelchGain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);
      squelchOsc.connect(squelchGain);
      squelchGain.connect(this.ctx.destination);
      squelchOsc.start(t);
      squelchOsc.stop(t + 0.05);
    }

    // Layer 3: Warm juicy fruit flesh / noodle pulp body
    const fruitBody = this.ctx.createOscillator();
    const fruitGain = this.ctx.createGain();
    fruitBody.type = 'sine';
    fruitBody.frequency.setValueAtTime(140, now + 0.01);
    fruitBody.frequency.exponentialRampToValueAtTime(65, now + 0.1);
    fruitGain.gain.setValueAtTime(0.24 * this.asmrVolMultiplier(), now + 0.01);
    fruitGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    fruitBody.connect(fruitGain);
    fruitGain.connect(this.ctx.destination);
    fruitBody.start(now + 0.01);
    fruitBody.stop(now + 0.1);
  }

  // Alias for backward compatibility
  public playJuicyChewCycle(variation = 0) {
    this.playJuicyMush(variation);
  }

  // Master dispatcher for specific ASMR sound variants ('sharp-crack', 'juicy-mush', etc.)
  public playAsmrVariant(variant: 'sharp-crack' | 'juicy-mush' | string, variation = 0) {
    if (variant === 'sharp-crack') {
      this.playSharpCrack(variation);
    } else if (variant === 'juicy-mush') {
      this.playJuicyMush(variation);
    } else {
      this.playAsmrSound(variant);
    }
  }

  // 4. Throat Swallow & Gulp Sound
  public playSwallow() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Resonant throat swallow
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.16);

    gain.gain.setValueAtTime(0.35 * this.asmrVolMultiplier(), now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  // 2. Chip / Cracker Crunch
  public playCrunchChips() {
    this.playAudioAssetOrFallback('crunch_chips', this.asmrVolMultiplier(), () => {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const duration = 0.35;
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() > 0.28 ? (Math.random() * 2 - 1) * 0.95 : 0;
      }

      const source = this.ctx.createBufferSource();
      source.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(2200, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.58 * this.asmrVolMultiplier(), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      source.start(now);
      source.stop(now + duration);

      setTimeout(() => {
        this.playChewBursts(2, 0.07);
      }, 200);
    });
  }

  // 3. Fried Chicken Bite
  public playFriedChickenBite() {
    this.playAudioAssetOrFallback('crunch_chicken', this.asmrVolMultiplier(), () => {
      this.playCrunchChips();
      setTimeout(() => {
        this.playChewBursts(4, 0.09);
      }, 160);
    });
  }

  // 4. Burger / Pizza Chew
  public playBurgerChew() {
    this.playAudioAssetOrFallback('chew_burger', this.asmrVolMultiplier(), () => {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.12);

      gain.gain.setValueAtTime(0.4 * this.asmrVolMultiplier(), now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.13);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.13);

      setTimeout(() => {
        this.playChewBursts(3, 0.1);
      }, 120);
    });
  }

  // 5. Jelly Squish
  public playJellySquish() {
    this.playAudioAssetOrFallback('squish_jelly', this.asmrVolMultiplier(), () => {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(650, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.18);

      gain.gain.setValueAtTime(0.42 * this.asmrVolMultiplier(), now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);

      setTimeout(() => {
        this.playChewBursts(2, 0.06);
      }, 140);
    });
  }

  // 6. Drink Sip & Boba Straw
  public playDrinkSip() {
    this.playAudioAssetOrFallback('sip_drink', this.asmrVolMultiplier(), () => {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const duration = 0.55;

      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + duration);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(850, now);
      filter.Q.setValueAtTime(5, now);

      gain.gain.setValueAtTime(0.38 * this.asmrVolMultiplier(), now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);

      setTimeout(() => {
        this.playIceClink();
      }, 360);
    });
  }

  // 7. Ice Cream Lick
  public playIceCreamLick() {
    this.playAudioAssetOrFallback('melt_icecream', this.asmrVolMultiplier(), () => {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.linearRampToValueAtTime(390, now + 0.12);
      osc.frequency.linearRampToValueAtTime(190, now + 0.22);

      gain.gain.setValueAtTime(0.35 * this.asmrVolMultiplier(), now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.24);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.24);
    });
  }

  private playIceClink() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1800, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);

    gain.gain.setValueAtTime(0.18 * this.asmrVolMultiplier(), now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  private playChewBursts(count: number, intervalSec: number) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    for (let i = 0; i < count; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + i * intervalSec;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160 + Math.random() * 40, t);
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.05);

      gain.gain.setValueAtTime(0.24 * this.asmrVolMultiplier(), t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.06);
    }
  }

  // --- Master ASMR Dispatcher by Sound Type ---
  public playAsmrSound(type: string) {
    switch (type) {
      case 'sharp-crack':
        this.playSharpCrack();
        break;
      case 'juicy-mush':
        this.playJuicyMush();
        break;
      case 'crunch_tanghulu':
        this.playTanghuluCrunch();
        break;
      case 'slurp_spicy':
        this.playNoodleSlurp('spicy');
        break;
      case 'slurp_brown':
        this.playNoodleSlurp('brown');
        break;
      case 'slurp_mild':
        this.playNoodleSlurp('mild');
        break;
      case 'crunch_chips':
      case 'crunch_crispy':
        this.playCrunchChips();
        break;
      case 'crunch_chicken':
        this.playFriedChickenBite();
        break;
      case 'chew_burger':
        this.playBurgerChew();
        break;
      case 'squish_jelly':
        this.playJellySquish();
        break;
      case 'melt_icecream':
        this.playIceCreamLick();
        break;
      case 'sip_drink':
        this.playDrinkSip();
        break;
      case 'crunch_candy':
        this.playCrunchChips();
        break;
      case 'soft_cake':
        this.playBurgerChew();
        break;
      default:
        this.playCrunchChips();
        break;
    }
  }

  // --- Background Pastel Ambient Lofi Music ---
  public startMusic() {
    if (this.isMusicPlaying || this.isMuted || this.musicVol <= 0) return;
    this.initContext();
    this.isMusicPlaying = true;

    const scale = [349.23, 392.0, 440.0, 523.25, 587.33, 698.46]; // F Major Pentatonic
    let step = 0;

    const playNote = () => {
      if (!this.isMusicPlaying || this.isMuted || this.musicVol <= 0 || !this.ctx) return;
      const freq = scale[step % scale.length];
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.08 * this.musicVol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.3);

      step = (step + (Math.random() > 0.4 ? 1 : 2)) % scale.length;
    };

    playNote();
    this.musicInterval = window.setInterval(playNote, 950);
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval !== null) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  private asmrVolMultiplier() {
    return this.isMuted ? 0 : this.asmrVol;
  }

  private cookingVolMultiplier() {
    return this.isMuted ? 0 : this.cookingVol;
  }
}

export const soundEngine = new SoundEngine();
