// Web Audio API Synthesizer for 100% offline, zero-latency, realistic ASMR & Cooking sounds
class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private asmrVol: number = 0.85;
  private cookingVol: number = 0.8;
  private musicVol: number = 0.4;
  private musicInterval: number | null = null;
  private isMusicPlaying: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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

  // --- UI Sound Effects ---
  public playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);

    gain.gain.setValueAtTime(0.25 * this.asmVolMultiplier(), now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  public playCoin() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [987.77, 1318.51, 1567.98]; // B5, E6, G6
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      const startTime = now + idx * 0.07;
      gain.gain.setValueAtTime(0.25 * this.asmVolMultiplier(), startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.22);
    });
  }

  public playFanfare() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const melody = [
      { f: 523.25, t: 0.0, d: 0.12 }, // C5
      { f: 659.25, t: 0.12, d: 0.12 }, // E5
      { f: 783.99, t: 0.24, d: 0.12 }, // G5
      { f: 1046.5, t: 0.36, d: 0.4 },  // C6
    ];

    melody.forEach((note) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, now + note.t);

      gain.gain.setValueAtTime(0.3 * this.asmVolMultiplier(), now + note.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + note.d);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now + note.t);
      osc.stop(now + note.t + note.d);
    });
  }

  public playGirlGiggle() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Cute high-pitched playful vocal-like chirp
    [680, 850, 1020, 890].forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      const t = now + idx * 0.09;
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.15, t + 0.08);

      gain.gain.setValueAtTime(0.2 * this.asmVolMultiplier(), t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(t);
      osc.stop(t + 0.1);
    });
  }

  // --- Cooking Sound Synthesizers ---
  public playBoilingWater(durationSec = 1.2) {
    if (this.isMuted || this.cookingVol <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * durationSec;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Filtered bubble bursts
    for (let i = 0; i < bufferSize; i++) {
      const noise = (Math.random() * 2 - 1) * 0.3;
      data[i] = noise;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, now);
    filter.Q.setValueAtTime(3.5, now);

    // Random pitch flutter for bubbling
    for (let i = 0; i < 8; i++) {
      filter.frequency.exponentialRampToValueAtTime(
        350 + Math.random() * 400,
        now + (i * durationSec) / 8
      );
    }

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35 * this.cookingVol, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + durationSec);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noiseSource.start(now);
    noiseSource.stop(now + durationSec);
  }

  public playFryingSizzle(durationSec = 1.5) {
    if (this.isMuted || this.cookingVol <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * durationSec;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Crackly white/pink noise
      data[i] = (Math.random() * 2 - 1) * (0.4 + Math.random() * 0.5);
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1400, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4 * this.cookingVol, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + durationSec);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    source.start(now);
    source.stop(now + durationSec);
  }

  public playChop() {
    if (this.isMuted || this.cookingVol <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Woody thud
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.07);

    gain.gain.setValueAtTime(0.6 * this.cookingVol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    // Knife snap
    const snapOsc = this.ctx.createOscillator();
    const snapGain = this.ctx.createGain();
    snapOsc.type = 'sine';
    snapOsc.frequency.setValueAtTime(1200, now);
    snapOsc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
    snapGain.gain.setValueAtTime(0.3 * this.cookingVol, now);
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    snapOsc.connect(snapGain);
    snapGain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
    snapOsc.start(now);
    snapOsc.stop(now + 0.04);
  }

  public playStir() {
    if (this.isMuted || this.cookingVol <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(260, now + 0.15);
    osc.frequency.linearRampToValueAtTime(160, now + 0.3);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, now);

    gain.gain.setValueAtTime(0.3 * this.cookingVol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.32);
  }

  public playBlender(durationSec = 1.6) {
    if (this.isMuted || this.cookingVol <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.5);
    osc.frequency.exponentialRampToValueAtTime(360, now + durationSec);

    gain.gain.setValueAtTime(0.25 * this.cookingVol, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + durationSec);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + durationSec);
  }

  public playPacketTear() {
    if (this.isMuted || this.cookingVol <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.25;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.7;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2200, now);
    filter.frequency.exponentialRampToValueAtTime(900, now + 0.25);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4 * this.cookingVol, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    source.start(now);
    source.stop(now + 0.25);
  }

  // --- ASMR Food-Specific Eating Sounds ---

  // 1. Noodle Slurp (Spicy, Mild, Brown)
  public playNoodleSlurp(isSpicy = false) {
    if (this.isMuted || this.asmrVol <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const duration = isSpicy ? 0.75 : 0.65;

    // Resonant wet suction
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(260, now + duration * 0.4);
    osc.frequency.exponentialRampToValueAtTime(180, now + duration);

    filter.type = 'bandpass';
    filter.Q.setValueAtTime(isSpicy ? 6 : 4, now);
    filter.frequency.setValueAtTime(isSpicy ? 600 : 450, now);
    filter.frequency.exponentialRampToValueAtTime(isSpicy ? 1600 : 1200, now + duration * 0.5);
    filter.frequency.exponentialRampToValueAtTime(300, now + duration);

    gain.gain.setValueAtTime(0.4 * this.asmVolMultiplier(), now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration);

    // Follow-up chewing smacks
    setTimeout(() => {
      this.playChewBursts(3, 0.08);
    }, duration * 600);
  }

  // 2. Chip & Cracker Crisp Crunch
  public playCrunchChips() {
    if (this.isMuted || this.asmrVol <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const duration = 0.35;

    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Crackle bursts
      const burst = Math.random() > 0.3 ? (Math.random() * 2 - 1) * 0.9 : 0;
      data[i] = burst;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(2200, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.6 * this.asmVolMultiplier(), now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    source.start(now);
    source.stop(now + duration);

    setTimeout(() => {
      this.playChewBursts(2, 0.07);
    }, 220);
  }

  // 3. Fried Chicken crispy bite + deep chew
  public playFriedChickenBite() {
    if (this.isMuted || this.asmrVol <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    // Hard initial crunch + juicy chew
    this.playCrunchChips();
    setTimeout(() => {
      this.playChewBursts(4, 0.09);
    }, 180);
  }

  // 4. Burger / Pizza soft chew & cheese pull
  public playBurgerChew() {
    if (this.isMuted || this.asmrVol <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Low satisfying thud bite
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(75, now + 0.12);

    gain.gain.setValueAtTime(0.4 * this.asmVolMultiplier(), now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.13);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.13);

    setTimeout(() => {
      this.playChewBursts(3, 0.1);
    }, 120);
  }

  // 5. Jelly / Marshmallow Squish
  public playJellySquish() {
    if (this.isMuted || this.asmrVol <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(650, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.18);

    gain.gain.setValueAtTime(0.4 * this.asmVolMultiplier(), now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);

    setTimeout(() => {
      this.playChewBursts(2, 0.06);
    }, 150);
  }

  // 6. Drink Sip & Straw slurping
  public playDrinkSip() {
    if (this.isMuted || this.asmrVol <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const duration = 0.55;

    // Resonant liquid straw suction
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(380, now);
    osc.frequency.exponentialRampToValueAtTime(720, now + duration);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, now);
    filter.Q.setValueAtTime(5, now);

    gain.gain.setValueAtTime(0.35 * this.asmVolMultiplier(), now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration);

    // Ice cube clink
    setTimeout(() => {
      this.playIceClink();
    }, 380);
  }

  // 7. Ice cream lick / spoon
  public playIceCreamLick() {
    if (this.isMuted || this.asmrVol <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.linearRampToValueAtTime(380, now + 0.12);
    osc.frequency.linearRampToValueAtTime(190, now + 0.22);

    gain.gain.setValueAtTime(0.35 * this.asmVolMultiplier(), now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  private playIceClink() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1800, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);

    gain.gain.setValueAtTime(0.18 * this.asmVolMultiplier(), now);
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

      gain.gain.setValueAtTime(0.25 * this.asmVolMultiplier(), t);
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
      case 'slurp_spicy':
        this.playNoodleSlurp(true);
        break;
      case 'slurp_mild':
      case 'slurp_brown':
        this.playNoodleSlurp(false);
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

  // --- Background Pastel Ambient Lofi Chime Music ---
  public startMusic() {
    if (this.isMusicPlaying || this.isMuted || this.musicVol <= 0) return;
    this.initContext();
    this.isMusicPlaying = true;

    // Pastel pentatonic arpeggio sequence in F Major (dreamy, relaxing)
    const scale = [349.23, 392.0, 440.0, 523.25, 587.33, 698.46]; // F4, G4, A4, C5, D5, F5
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

  private asmVolMultiplier() {
    return this.isMuted ? 0 : this.asmrVol;
  }
}

export const soundEngine = new SoundEngine();
