// R16. Capture par tranches fines (M14 salami, Rákosi, Pologne).
// Nominations et règles de carrière comme vecteurs discrets. Résistance selon cohésion et protections croisées.
import { clamp01, type Rng } from "../rng.js";
import type { JournalTirage } from "../types.js";

export interface EtatInstitution {
  id: string;
  autonomie: number;
  cohesion: number;
}

export interface ResultatTranche {
  etat: EtatInstitution;
  discret: boolean;
  journal: JournalTirage[];
}

export function appliquerTranche(
  etat: EtatInstitution,
  agressivite: number,
  protectionsCroisees: number,
  rng: Rng,
  graine: number,
): ResultatTranche {
  const journal: JournalTirage[] = [];
  const tirage = rng.next();
  journal.push({ regle: "R16", graine, rang: rng.tirageRang, valeur: tirage });
  const bruit = (tirage - 0.5) * 0.02;
  const agres = clamp01(agressivite);
  const prot = clamp01(protectionsCroisees);
  const cohesion = clamp01(etat.cohesion);
  // Tranche fine : effet petit mais discret si cohésion basse et protections faibles.
  const efficacite = agres * 0.12 * (1 - cohesion * 0.5) * (1 - prot * 0.6);
  const delta = Math.min(0.12, Math.max(0, efficacite + bruit * 0.5));
  const discret = agres < 0.5 && prot < 0.5;
  return {
    etat: { ...etat, autonomie: clamp01(etat.autonomie - delta) },
    discret,
    journal,
  };
}
