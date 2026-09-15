// R5. Masse critique et bascule de norme (M12 Centola 2018).
// Sous le seuil, la minorité intransigeante reste ignorée. Au delà, adoption rapide. Seuil non universel.
import { clamp01, type Rng } from "../rng.js";
import type { JournalTirage } from "../types.js";

export interface EtatNorme {
  id: string;
  partMinorite: number;
  adoption: number;
  seuil: number;
}

export interface ResultatNorme {
  etat: EtatNorme;
  delta: number;
  journal: JournalTirage[];
}

export function appliquerMasseCritique(
  etat: EtatNorme,
  rng: Rng,
  graine: number,
): ResultatNorme {
  const journal: JournalTirage[] = [];
  const tirage = rng.next();
  journal.push({ regle: "R5", graine, rang: rng.tirageRang, valeur: tirage });
  const bruit = (tirage - 0.5) * 0.02;
  const part = clamp01(etat.partMinorite);
  const seuil = Math.min(0.5, Math.max(0.1, etat.seuil));
  let cible: number;
  if (part < seuil) {
    // Sous le seuil : quasi rien, avec reflux.
    cible = part * 0.2;
  } else {
    // Au delà : bascule rapide vers la majorité.
    cible = Math.min(1, 0.5 + (part - seuil) * 4);
  }
  const deltaBrut = (cible - etat.adoption) * 0.5 + bruit;
  const delta = Math.max(-0.12, Math.min(0.15, deltaBrut));
  return { etat: { ...etat, adoption: clamp01(etat.adoption + delta) }, delta, journal };
}
