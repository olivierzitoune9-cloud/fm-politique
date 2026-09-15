// R11. Bouc émissaire minoritaire et réutilisable (M5).
// Rendement de cohésion contre coût de réputation et coalition adverse. Usure possible. Jamais automatique.
import { clamp01, type Rng } from "../rng.js";
import type { JournalTirage } from "../types.js";

export interface CibleBouc {
  id: string;
  taille: number;
  visibilite: number;
  protections: number;
  usure: number;
}

export interface ResultatBouc {
  cohesion: number;
  coutReputation: number;
  journal: JournalTirage[];
}

export function appliquerBoucEmissaire(
  cible: CibleBouc,
  violenceDiscours: number,
  rng: Rng,
  graine: number,
): ResultatBouc {
  const journal: JournalTirage[] = [];
  const tirage = rng.next();
  journal.push({ regle: "R11", graine, rang: rng.tirageRang, valeur: tirage });
  const bruit = (tirage - 0.5) * 0.03;
  const taille = clamp01(cible.taille);
  const visi = clamp01(cible.visibilite);
  const prot = clamp01(cible.protections);
  const usure = clamp01(cible.usure);
  const violence = clamp01(violenceDiscours);
  // Plus la cible est petite et visible, plus le nous est massif. Protégée ou usée, rendement chute.
  const cohesion = clamp01((1 - taille) * 0.5 * visi * violence * (1 - prot * 0.6) * (1 - usure * 0.5) + 0.1 * violence + bruit);
  const cout = clamp01(violence * (0.2 + prot * 0.5 + usure * 0.2) + bruit * 0.5);
  return { cohesion, coutReputation: cout, journal };
}
