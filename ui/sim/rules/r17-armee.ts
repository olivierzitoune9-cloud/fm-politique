// R17. Neutralisation de l'armée en leviers (M15).
// Nominations, fragmentation, surveillance réciproque, intérêts matériels. Risque de putsch si misère ou humiliation.
import { clamp01, type Rng } from "../rng.js";
import type { JournalTirage } from "../types.js";

export interface EtatArmee {
  id: string;
  loyaute: number;
  misere: number;
  humiliation: number;
}

export interface ResultatArmee {
  etat: EtatArmee;
  risquePutsch: number;
  journal: JournalTirage[];
}

export function appliquerLevierArmee(
  etat: EtatArmee,
  nominations: number,
  fragmentation: number,
  enrichissement: number,
  rng: Rng,
  graine: number,
): ResultatArmee {
  const journal: JournalTirage[] = [];
  const tirage = rng.next();
  journal.push({ regle: "R17", graine, rang: rng.tirageRang, valeur: tirage });
  const bruit = (tirage - 0.5) * 0.03;
  const loyaute = clamp01(
    etat.loyaute + clamp01(nominations) * 0.1 + clamp01(enrichissement) * 0.08 - clamp01(fragmentation) * 0.04 + bruit * 0.5,
  );
  const risque = clamp01(clamp01(etat.misere) * 0.5 + clamp01(etat.humiliation) * 0.5 + (1 - loyaute) * 0.3 + bruit);
  return { etat: { ...etat, loyaute }, risquePutsch: risque, journal };
}
