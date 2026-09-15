// R14. Caution savante (M10).
// Rendre inquiétant plutôt que détestable. Multiplie la portée si institutions perméables. Risque de débunkage.
import { clamp01, type Rng } from "../rng.js";
import type { JournalTirage } from "../types.js";

export interface ContexteCaution {
  permeabiliteInstitutions: number;
  soliditeCaution: number;
  vigilanceMedias: number;
}

export interface ResultatCaution {
  multiplicateur: number;
  risqueDebunk: number;
  journal: JournalTirage[];
}

export function appliquerCaution(contexte: ContexteCaution, rng: Rng, graine: number): ResultatCaution {
  const journal: JournalTirage[] = [];
  const tirage = rng.next();
  journal.push({ regle: "R14", graine, rang: rng.tirageRang, valeur: tirage });
  const bruit = (tirage - 0.5) * 0.1;
  const multiplicateur = 1 + clamp01(contexte.permeabiliteInstitutions) * clamp01(contexte.soliditeCaution) * 1.5 + bruit;
  const risque = clamp01(clamp01(contexte.vigilanceMedias) * (1 - clamp01(contexte.soliditeCaution) * 0.5) + bruit * 0.5);
  return { multiplicateur: Math.max(1, Math.min(2.6, multiplicateur)), risqueDebunk: risque, journal };
}
