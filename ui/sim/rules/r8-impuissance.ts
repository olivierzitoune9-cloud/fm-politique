// R8. Impuissance apprise et terreur imprévisible (M20 Seligman 1967).
// La prévisibilité de la sanction compte autant que son intensité. Démobilisation si l'action semble sans effet.
import { clamp01, type Rng } from "../rng.js";
import type { JournalTirage } from "../types.js";

export interface EtatMobilisation {
  id: string;
  efficacitePercue: number;
  peur: number;
  mobilisation: number;
}

export interface ResultatMobilisation {
  etat: EtatMobilisation;
  delta: number;
  journal: JournalTirage[];
}

export function appliquerSanction(
  etat: EtatMobilisation,
  imprevisibilite: number,
  echecRecent: number,
  rng: Rng,
  graine: number,
): ResultatMobilisation {
  const journal: JournalTirage[] = [];
  const tirage = rng.next();
  journal.push({ regle: "R8", graine, rang: rng.tirageRang, valeur: tirage });
  const bruit = (tirage - 0.5) * 0.02;
  const imp = clamp01(imprevisibilite);
  const echec = clamp01(echecRecent);
  const efficacite = clamp01(etat.efficacitePercue - echec * 0.2);
  const peur = clamp01(etat.peur + imp * 0.15);
  // Mobilisation = efficacité perçue moins peur paralysante, avec poches de résistance (jamais zéro forcé).
  const cible = clamp01(efficacite * (1 - peur * 0.7) + 0.05);
  const deltaBrut = (cible - etat.mobilisation) * 0.5 + bruit * 0.5;
  const delta = Math.max(-0.12, Math.min(0.12, deltaBrut));
  return {
    etat: { ...etat, efficacitePercue: efficacite, peur, mobilisation: clamp01(etat.mobilisation + delta) },
    delta,
    journal,
  };
}
