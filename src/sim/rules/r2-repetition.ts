// R2. Répétition et familiarité (M11 Hasher 1977).
// L'exposition répétée augmente la familiarité donc la crédulité, jamais en conversion garantie.
import { clamp01, type Rng } from "../rng.js";
import type { JournalTirage } from "../types.js";

export interface CibleFamiliarite {
  id: string;
  familiarite: number;
  connaissancePrealable: number;
  confianceSource: number;
}

export interface ResultatFamiliarite {
  cible: CibleFamiliarite;
  delta: number;
  journal: JournalTirage[];
}

const DELTA_MAX = 0.12;

export function appliquerRepetition(
  cible: CibleFamiliarite,
  expositions: number,
  rng: Rng,
  graine: number,
): ResultatFamiliarite {
  const journal: JournalTirage[] = [];
  if (expositions <= 0) {
    return { cible: { ...cible }, delta: 0, journal };
  }
  const tirage = rng.next();
  journal.push({ regle: "R2", graine, rang: rng.tirageRang, valeur: tirage });
  const bruit = (tirage - 0.5) * 0.02;
  const connaissance = clamp01(cible.connaissancePrealable);
  const confiance = clamp01(cible.confianceSource);
  // Rendements décroissants : chaque exposition compte, de moins en moins.
  const dose = Math.min(3, expositions) / 3;
  const base = 0.05 * dose * (0.4 + 0.6 * confiance) * (1 - 0.7 * connaissance);
  const delta = Math.min(DELTA_MAX, Math.max(0, base + bruit));
  return {
    cible: { ...cible, familiarite: clamp01(cible.familiarite + delta) },
    delta,
    journal,
  };
}
