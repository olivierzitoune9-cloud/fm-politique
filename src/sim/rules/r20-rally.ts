// R20. Ralliement au drapeau et frappe punitive (M22 Mueller).
// Pic de soutien avec décroissance. Issue incertaine : gagnée portant des années, perdue emportant en semaines.
import { clamp01, type Rng } from "../rng.js";
import type { JournalTirage } from "../types.js";

export interface EtatSoutien {
  id: string;
  soutien: number;
}

export interface ResultatSoutien {
  etat: EtatSoutien;
  journal: JournalTirage[];
}

export function appliquerRally(
  etat: EtatSoutien,
  spectaculaire: number,
  dureeSemaines: number,
  issue: number,
  rng: Rng,
  graine: number,
): ResultatSoutien {
  const journal: JournalTirage[] = [];
  const tirage = rng.next();
  journal.push({ regle: "R20", graine, rang: rng.tirageRang, valeur: tirage });
  const bruit = (tirage - 0.5) * 0.03;
  // Pic initial selon caractère spectaculaire, puis décroissance hebdomadaire, modulée par l'issue.
  const pic = clamp01(spectaculaire) * 0.25;
  const decroissance = Math.min(0.3, dureeSemaines * 0.02);
  const bonusIssue = (clamp01(issue) - 0.5) * 0.2;
  const delta = Math.max(-0.2, Math.min(0.25, pic - decroissance + bonusIssue + bruit));
  return { etat: { ...etat, soutien: clamp01(etat.soutien + delta) }, journal };
}
