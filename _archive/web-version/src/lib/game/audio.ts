/** Procedural Web Audio SFX. Unlocks on first gesture. */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let sfx: GainNode | null = null;
let music: GainNode | null = null;
let musicTimer: number | null = null;
let unlocked = false;

type Vol = { master: number; sfx: number; music: number; sfxOn: boolean; musicOn: boolean };
const vol: Vol = { master: 0.8, sfx: 0.7, music: 0.45, sfxOn: true, musicOn: true };

function curve(v: number) {
  return v * v;
}

export function applyVolumes(next: Partial<Vol>) {
  Object.assign(vol, next);
  if (master) master.gain.setTargetAtTime(curve(vol.master), ctx!.currentTime, 0.03);
  if (sfx) sfx.gain.setTargetAtTime(vol.sfxOn ? curve(vol.sfx) : 0, ctx!.currentTime, 0.03);
  if (music) music.gain.setTargetAtTime(vol.musicOn ? curve(vol.music) : 0, ctx!.currentTime, 0.05);
}

export function unlockAudio() {
  if (typeof window === "undefined") return;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  if (!ctx) {
    ctx = new AC({ latencyHint: "interactive" });
    master = ctx.createGain();
    sfx = ctx.createGain();
    music = ctx.createGain();
    sfx.connect(master);
    music.connect(master);
    master.connect(ctx.destination);
    applyVolumes({});
  }
  if (ctx.state === "suspended") void ctx.resume();
  unlocked = true;
}

function beep(freq: number, dur: number, type: OscillatorType, gain = 0.08, slide = 0) {
  if (!ctx || !sfx || !vol.sfxOn) return;
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g);
  g.connect(sfx);
  o.start(t);
  o.stop(t + dur + 0.02);
}

export const sfxPlay = {
  tap: () => beep(620, 0.05, "triangle", 0.04),
  select: () => beep(480, 0.07, "sine", 0.05),
  found: (combo = 1) => {
    const base = combo >= 5 ? 660 : combo >= 3 ? 587 : 523;
    beep(base, 0.09, "triangle", 0.07);
    setTimeout(() => beep(base * 1.5, 0.12, "triangle", 0.06), 70);
  },
  miss: () => beep(180, 0.16, "sawtooth", 0.04, -80),
  win: () => {
    [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => beep(f, 0.16, "triangle", 0.07), i * 90));
  },
  coin: () => beep(980, 0.1, "square", 0.035, 200),
  hint: () => beep(440, 0.14, "sine", 0.05, 120),
  spin: () => beep(360, 0.08, "square", 0.04),
};

export function startMusic(worldIndex = 0) {
  if (!ctx || !music || !vol.musicOn) return;
  stopMusic();
  const worlds = [[196,247,294,330,392,330,294,247],[220,277,330,370,440,370,330,277],[146,185,220,277,330,277,220,185],[174,220,261,329,392,329,261,220],[196,233,293,349,440,349,293,233],[247,294,370,440,554,440,370,294]];
  const notes = worlds[Math.max(0, Math.min(5, worldIndex))]!;
  let i = 0;
  const step = () => {
    if (!ctx || !music || !vol.musicOn) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = notes[i % notes.length]!;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.035, t + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
    o.connect(g);
    g.connect(music);
    o.start(t);
    o.stop(t + 0.75);
    i++;
    musicTimer = window.setTimeout(step, 780);
  };
  step();
}

export function stopMusic() {
  if (musicTimer != null) {
    clearTimeout(musicTimer);
    musicTimer = null;
  }
}

export function isAudioUnlocked() {
  return unlocked;
}
