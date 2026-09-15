// R12. Marque portable et double lecture (M6).
// Simplicité, reproductibilité, respectabilité pour modérés, lecture cachée pour initiés. Risque de décodage.
import { clamp01, type Rng } from "../rng.js";
import type { JournalTirage } from "../types.js";

export interface Marque {
  simplicite: number;
  reproductibilite: number;
  respectabilite: number;
  lectureCachee: number;
}

export interface ResultatMarque {
  recrutement: number;
  risqueDecodage: number;
  journal: JournalTirage[];
}

export function evaluerMarque(marque: Marque, vigilanceAdverse: number, rng: Rng, graine: number): ResultatMarque {
  const journal: JournalTirage[] = [];
  const tirage = rng.next();
  journal.push({ regle: "R12", graine, rang: rng.tirageRang, valeur: tirage });
  const bruit = (tirage - 0.5) * 0.03;
  const recrutement = clamp01(
    clamp01(marque.simplicite) * 0.3 +
      clamp01(marque.reproductibilite) * 0.3 +
      clamp01(marque.respectabilite) * 0.25 +
      clamp01(marque.lectureCachee) * 0.15 +
      bruit,
  );
  const risque = clamp01(clamp01(marque.lectureCachee) * clamp01(vigilanceAdverse) * 0.9 + bruit * 0.5);
  return { recrutement, risqueDecodage: risque, journal };
}
