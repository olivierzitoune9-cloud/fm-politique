// R9. Fenêtre d'Overton case par case (M7).
// Chaque proposition a une dicibilité par groupe. Déplacements marginaux via relais à déni. Contre feu possible.
import { clamp01, type Rng } from "../rng.js";
import type { JournalTirage } from "../types.js";

export interface EtatDicibilite {
  id: string;
  dicibilite: number;
  contreFeu: number;
}

export interface ResultatDicibilite {
  etat: EtatDicibilite;
  delta: number;
  journal: JournalTirage[];
}

export function appliquerRelais(
  etat: EtatDicibilite,
  forceRelais: number,
  deniPlausible: number,
  rng: Rng,
  graine: number,
): ResultatDicibilite {
  const journal: JournalTirage[] = [];
  const tirage = rng.next();
  journal.push({ regle: "R9", graine, rang: rng.tirageRang, valeur: tirage });
  const bruit = (tirage - 0.5) * 0.02;
  const relais = clamp01(forceRelais);
  const deni = clamp01(deniPlausible);
  const feu = clamp01(etat.contreFeu);
  // Jamais de saut frontal : déplacement marginal, réduit par le contre feu et le manque de déni.
  const brut = relais * 0.1 * (0.4 + 0.6 * deni) * (1 - feu * 0.7) + bruit * 0.5;
  const delta = Math.max(-0.06, Math.min(0.08, brut));
  return { etat: { ...etat, dicibilite: clamp01(etat.dicibilite + delta) }, delta, journal };
}
