// R10. Langage adoucissant et déshumanisation (M8 Klemperer, M17 Bandura).
// L'euphémisme baisse le coût moral perçu de l'adhésion. La déshumanisation baisse le coût de la violence.
// Traité avec gravité, sans glorification, sans récompense ludique de l'atrocité.
import { clamp01, type Rng } from "../rng.js";
import type { JournalTirage } from "../types.js";

export interface EtatCoutMoral {
  id: string;
  coutMoralPercu: number;
}

export interface ResultatCoutMoral {
  etat: EtatCoutMoral;
  delta: number;
  journal: JournalTirage[];
}

export function appliquerEuphemisme(
  etat: EtatCoutMoral,
  intensiteLexique: number,
  devoilement: number,
  rng: Rng,
  graine: number,
): ResultatCoutMoral {
  const journal: JournalTirage[] = [];
  const tirage = rng.next();
  journal.push({ regle: "R10", graine, rang: rng.tirageRang, valeur: tirage });
  const bruit = (tirage - 0.5) * 0.02;
  const lexique = clamp01(intensiteLexique);
  const voile = clamp01(devoilement);
  // L'euphémisme fait baisser le coût perçu, le dévoilement et la moquerie le remontent.
  const deltaBrut = -lexique * 0.1 * (1 - voile * 0.8) + voile * 0.06 + bruit * 0.5;
  const delta = Math.max(-0.1, Math.min(0.08, deltaBrut));
  return { etat: { ...etat, coutMoralPercu: clamp01(etat.coutMoralPercu + delta) }, delta, journal };
}
