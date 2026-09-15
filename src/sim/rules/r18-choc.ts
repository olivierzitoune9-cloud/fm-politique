// R18. Choc et pouvoirs d'exception (M16).
// Une crise ouvre brièvement la fenêtre. Acceptabilité selon peur, confiance et cadrage. Cliquet ou reflux.
// L'origine réelle ou instrumentalisée est une variable d'enquête, jamais une vérité donnée.
import { clamp01, type Rng } from "../rng.js";
import type { JournalTirage } from "../types.js";

export interface EtatException {
  id: string;
  acceptation: number;
  institutionsRestantes: number;
}

export interface ResultatException {
  etat: EtatException;
  cliquet: boolean;
  journal: JournalTirage[];
}

export function appliquerChoc(
  etat: EtatException,
  peur: number,
  confianceChef: number,
  rng: Rng,
  graine: number,
): ResultatException {
  const journal: JournalTirage[] = [];
  const tirage = rng.next();
  journal.push({ regle: "R18", graine, rang: rng.tirageRang, valeur: tirage });
  const bruit = (tirage - 0.5) * 0.04;
  const cible = clamp01(clamp01(peur) * 0.6 + clamp01(confianceChef) * 0.3 + bruit);
  const delta = clamp01(cible - etat.acceptation) * 0.7;
  const acceptation = clamp01(etat.acceptation + Math.max(-0.1, Math.min(0.2, delta)));
  // Cliquet si institutions faibles et acceptation haute.
  const cliquet = acceptation > 0.7 && etat.institutionsRestantes < 0.4;
  const institutions = cliquet ? clamp01(etat.institutionsRestantes - 0.1) : etat.institutionsRestantes;
  return { etat: { ...etat, acceptation, institutionsRestantes: institutions }, cliquet, journal };
}
