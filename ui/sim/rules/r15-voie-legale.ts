// R15. Arbitrage voie légale contre force brute (M13).
// Coût et bénéfice selon surveillance, information et réactions internationales. Trajectoires mixtes.
import { clamp01, type Rng } from "../rng.js";
import type { JournalTirage } from "../types.js";

export interface ContexteVoie {
  surveillance: number;
  legitimiteBonus: number;
  coutRepression: number;
  soutienInternational: number;
}

export interface ResultatVoie {
  choixLegal: boolean;
  journal: JournalTirage[];
}

export function arbitrerVoie(contexte: ContexteVoie, rng: Rng, graine: number): ResultatVoie {
  const journal: JournalTirage[] = [];
  const tirage = rng.next();
  journal.push({ regle: "R15", graine, rang: rng.tirageRang, valeur: tirage });
  const probaLegale = clamp01(
    0.5 +
      clamp01(contexte.surveillance) * 0.2 +
      clamp01(contexte.legitimiteBonus) * 0.3 -
      clamp01(contexte.soutienInternational) * 0.1 -
      (1 - clamp01(contexte.coutRepression)) * 0.2,
  );
  return { choixLegal: tirage < probaLegale, journal };
}
