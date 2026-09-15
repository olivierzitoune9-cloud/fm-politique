// R7. Obéissance à l'autorité (M18 Milgram, Burger 2009).
// Probabilité d'exécuter un ordre discutable selon légitimité perçue et surveillance. Refus et fuites possibles.
import { clamp01, type Rng } from "../rng.js";
import type { JournalTirage } from "../types.js";

export interface ContexteOrdre {
  legitimitePercue: number;
  surveillance: number;
  responsabiliteDiluee: number;
  graviteOrdre: number;
}

export interface ResultatOrdre {
  obeit: boolean;
  journal: JournalTirage[];
}

export function appliquerOrdre(contexte: ContexteOrdre, rng: Rng, graine: number): ResultatOrdre {
  const journal: JournalTirage[] = [];
  const tirage = rng.next();
  journal.push({ regle: "R7", graine, rang: rng.tirageRang, valeur: tirage });
  const proba = clamp01(
    0.15 +
      clamp01(contexte.legitimitePercue) * 0.5 +
      clamp01(contexte.surveillance) * 0.2 +
      clamp01(contexte.responsabiliteDiluee) * 0.25 -
      clamp01(contexte.graviteOrdre) * 0.45,
  );
  return { obeit: tirage < proba, journal };
}
