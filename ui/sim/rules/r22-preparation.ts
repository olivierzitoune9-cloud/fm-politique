// R22. Préparation silencieuse avant la fenêtre (M2).
// Construire ressources, relations, marque et corpus avec coûts d'entretien et risque de surexposition précoce.
import { clamp01, type Rng } from "../rng.js";
import type { JournalTirage } from "../types.js";

export interface EtatPreparation {
  id: string;
  ressources: number;
  visibilite: number;
}

export interface ResultatPreparation {
  etat: EtatPreparation;
  journal: JournalTirage[];
}

export function appliquerPreparation(
  etat: EtatPreparation,
  effort: number,
  rng: Rng,
  graine: number,
): ResultatPreparation {
  const journal: JournalTirage[] = [];
  const tirage = rng.next();
  journal.push({ regle: "R22", graine, rang: rng.tirageRang, valeur: tirage });
  const bruit = (tirage - 0.5) * 0.02;
  const eff = clamp01(effort);
  // Rendement avec coût d'entretien : au delà d'un effort soutenu, la visibilité expose.
  const gain = eff * 0.1 - etat.ressources * 0.05 + bruit * 0.5;
  const ressources = clamp01(etat.ressources + Math.max(-0.05, Math.min(0.1, gain)));
  const visibilite = clamp01(etat.visibilite + eff * 0.06 - 0.02);
  return { etat: { ...etat, ressources, visibilite }, journal };
}
