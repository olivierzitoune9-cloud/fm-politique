// R21. Culte de la personnalité (M23).
// Resserre la coalition à court terme, fragilise succession et parti.
import { clamp01, type Rng } from "../rng.js";
import type { JournalTirage } from "../types.js";

export interface EtatCulte {
  id: string;
  concentrationImage: number;
  fragiliteSuccession: number;
}

export interface ResultatCulte {
  etat: EtatCulte;
  journal: JournalTirage[];
}

export function appliquerCulte(etat: EtatCulte, intensite: number, rng: Rng, graine: number): ResultatCulte {
  const journal: JournalTirage[] = [];
  const tirage = rng.next();
  journal.push({ regle: "R21", graine, rang: rng.tirageRang, valeur: tirage });
  const bruit = (tirage - 0.5) * 0.02;
  const inten = clamp01(intensite);
  return {
    etat: {
      ...etat,
      concentrationImage: clamp01(etat.concentrationImage + inten * 0.12 + bruit * 0.5),
      fragiliteSuccession: clamp01(etat.fragiliteSuccession + inten * 0.1),
    },
    journal,
  };
}
