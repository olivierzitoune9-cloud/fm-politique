// R3. Menace normative et bascule autoritaire (M3 Stenner 2005).
// Prédisposition x menace perçue, bascule non linéaire avec hystérésis. Sans bord fixe.
import { clamp01, type Rng } from "../rng.js";
import type { JournalTirage } from "../types.js";

export interface EtatMenace {
  id: string;
  predispo: number;
  menace: number;
  bascule: number;
}

export interface ResultatMenace {
  etat: EtatMenace;
  delta: number;
  journal: JournalTirage[];
}

export function appliquerMenace(
  etat: EtatMenace,
  chocMenace: number,
  rng: Rng,
  graine: number,
): ResultatMenace {
  const journal: JournalTirage[] = [];
  const tirage = rng.next();
  journal.push({ regle: "R3", graine, rang: rng.tirageRang, valeur: tirage });
  const bruit = (tirage - 0.5) * 0.02;
  const predispo = clamp01(etat.predispo);
  const menace = clamp01(etat.menace + clamp01(chocMenace) * 0.5);
  // Seuil : sous 0.4 peu d'effet, au delà bascule rapide puis saturation. Hystérésis : on ne redescend qu'à moitié.
  const activation = menace < 0.4 ? menace * 0.3 : 0.12 + (menace - 0.4) * 1.1;
  const cible = clamp01(predispo * clamp01(activation));
  const cibleAvecHysteresis = Math.max(cible, etat.bascule * 0.5);
  const deltaBrut = (cibleAvecHysteresis - etat.bascule) * 0.6 + bruit * 0.5;
  const delta = Math.max(-0.12, Math.min(0.12, deltaBrut));
  const nouvelEtat = { ...etat, menace, bascule: clamp01(etat.bascule + delta) };
  return { etat: nouvelEtat, delta, journal };
}
