// R6. Escalade des engagements (M19 Freedman Fraser 1966).
// Un petit oui redéfinit l'image de soi et augmente l'acceptation suivante. Saturation et réactance possibles.
import { clamp01, type Rng } from "../rng.js";
import type { JournalTirage } from "../types.js";

export interface EtatEngagement {
  id: string;
  imageDeSoi: number;
  lassitude: number;
}

export interface ResultatEngagement {
  etat: EtatEngagement;
  accepte: boolean;
  journal: JournalTirage[];
}

export function appliquerPetitOui(
  etat: EtatEngagement,
  tailleDemande: number,
  rng: Rng,
  graine: number,
): ResultatEngagement {
  const journal: JournalTirage[] = [];
  const tirage = rng.next();
  journal.push({ regle: "R6", graine, rang: rng.tirageRang, valeur: tirage });
  const demande = clamp01(tailleDemande);
  const image = clamp01(etat.imageDeSoi);
  const lassitude = clamp01(etat.lassitude);
  // Probabilité d'accepter : image de soi moins coût de la demande moins lassitude.
  const proba = clamp01(0.2 + image * 0.7 - demande * 0.5 - lassitude * 0.4);
  const accepte = tirage < proba;
  const nouvelEtat = accepte
    ? { ...etat, imageDeSoi: clamp01(image + 0.08 * (1 - demande)), lassitude: clamp01(lassitude + demande * 0.15) }
    : { ...etat, lassitude: clamp01(lassitude + 0.05) };
  return { etat: nouvelEtat, accepte, journal };
}
