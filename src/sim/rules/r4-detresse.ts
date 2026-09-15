// R4. Détresse et demande de sauveur (M1).
// Chômage, faillites, insécurité ressentie augmentent la réceptivité aux discours d'ordre. Retard et mémoire.
import { clamp01, type Rng } from "../rng.js";
import type { JournalTirage } from "../types.js";

export interface EtatDetresse {
  id: string;
  satisfactionEco: number;
  perteControle: number;
  receptiviteOrdre: number;
}

export interface ResultatDetresse {
  etat: EtatDetresse;
  delta: number;
  journal: JournalTirage[];
}

export function appliquerDetresse(
  etat: EtatDetresse,
  chocEco: number,
  rng: Rng,
  graine: number,
): ResultatDetresse {
  const journal: JournalTirage[] = [];
  const tirage = rng.next();
  journal.push({ regle: "R4", graine, rang: rng.tirageRang, valeur: tirage });
  const bruit = (tirage - 0.5) * 0.02;
  const choc = Math.max(-1, Math.min(1, chocEco));
  const satisfaction = clamp01(etat.satisfactionEco - choc * 0.2);
  const perte = clamp01(etat.perteControle + choc * 0.15);
  // Prospérité rend inaudible : si satisfaction haute, effet quasi nul.
  const detresse = (1 - satisfaction) * 0.6 + perte * 0.4;
  const cible = clamp01(detresse * 0.8);
  // Mémoire : on monte vite, on redescend lentement.
  const vitesse = cible > etat.receptiviteOrdre ? 0.5 : 0.2;
  const deltaBrut = (cible - etat.receptiviteOrdre) * vitesse + bruit * 0.5;
  const delta = Math.max(-0.1, Math.min(0.12, deltaBrut));
  return {
    etat: { ...etat, satisfactionEco: satisfaction, perteControle: perte, receptiviteOrdre: clamp01(etat.receptiviteOrdre + delta) },
    delta,
    journal,
  };
}
