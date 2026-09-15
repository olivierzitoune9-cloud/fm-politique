// R19. Soupapes et opposition systémique (M21).
// Votes sans enjeu, causes locales et boucs intermédiaires réduisent la rue à court terme
// au prix d'une délégitimation lente. Répression ciblée des coordinateurs avec onde de choc puis oubli.
import { clamp01, type Rng } from "../rng.js";
import type { JournalTirage } from "../types.js";

export interface EtatColere {
  id: string;
  rue: number;
  delegitimation: number;
}

export interface ResultatColere {
  etat: EtatColere;
  journal: JournalTirage[];
}

export function appliquerSoupape(
  etat: EtatColere,
  debitSoupape: number,
  repressionCiblee: number,
  rng: Rng,
  graine: number,
): ResultatColere {
  const journal: JournalTirage[] = [];
  const tirage = rng.next();
  journal.push({ regle: "R19", graine, rang: rng.tirageRang, valeur: tirage });
  const bruit = (tirage - 0.5) * 0.02;
  const soupape = clamp01(debitSoupape);
  const repres = clamp01(repressionCiblee);
  const rue = clamp01(etat.rue - soupape * 0.2 - repres * 0.15 + bruit * 0.5);
  const delegitimation = clamp01(etat.delegitimation + soupape * 0.05 + repres * 0.08);
  return { etat: { ...etat, rue, delegitimation }, journal };
}
