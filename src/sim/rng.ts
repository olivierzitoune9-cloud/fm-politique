// RNG seedé et reproductible, mulberry32. Le moteur ne tire jamais au hasard sauvage.
export interface Rng {
  next(): number;
  readonly tirageRang: number;
}

export function creerRng(graine: number): Rng {
  let etat = graine >>> 0;
  let rang = 0;
  return {
    get tirageRang() {
      return rang;
    },
    next() {
      rang += 1;
      etat |= 0;
      etat = (etat + 0x6d2b79f5) | 0;
      let t = Math.imul(etat ^ (etat >>> 15), 1 | etat);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
  };
}

export function clamp01(x: number): number {
  if (Number.isNaN(x)) return 0;
  return x < 0 ? 0 : x > 1 ? 1 : x;
}
