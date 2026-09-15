// Propositions sur l'échelle de dicibilité (E7, R9 Overton). Le moteur ne tranche jamais la vérité.
import { appliquerRelais, type EtatDicibilite } from "./rules/r9-overton.js";

export type StatutPreuve = "etabli" | "conteste" | "trompeur" | "faux";

export interface Proposition {
  id: string;
  texte: string;
  auteurId: string;
  dicibilite: Record<string, number>; // groupeId vers 0..1
  statutPreuve: StatutPreuve;
}

export function creerProposition(texte: string, auteurId: string, groupes: string[], id = "prop.joueur"): Proposition {
  const dicibilite: Record<string, number> = {};
  for (const g of groupes) dicibilite[g] = 0.15;
  return { id, texte, auteurId, dicibilite, statutPreuve: "conteste" };
}

export function dicibiliteMoyenne(p: Proposition): number {
  const valeurs = Object.values(p.dicibilite);
  return valeurs.reduce((s, v) => s + v, 0) / Math.max(1, valeurs.length);
}

export function pousserProposition(
  p: Proposition,
  groupeId: string,
  forceRelais: number,
  deniPlausible: number,
  rng: import("./rng.js").Rng,
  graine: number,
): { proposition: Proposition; delta: number } {
  const etat: EtatDicibilite = { id: p.id, dicibilite: p.dicibilite[groupeId] ?? 0.1, contreFeu: 0 };
  const r = appliquerRelais(etat, forceRelais, deniPlausible, rng, graine);
  return {
    proposition: { ...p, dicibilite: { ...p.dicibilite, [groupeId]: r.etat.dicibilite } },
    delta: r.delta,
  };
}

export function modifierStatutPreuve(p: Proposition, statut: StatutPreuve): Proposition {
  return { ...p, statutPreuve: statut };
}
