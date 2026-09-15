// R1. Étiquetage activant le favoritisme ingroup (M4 Tajfel 1971).
// Pur sans React. Même action, résultats différents selon contexte. Bornes anti explosion.
import { clamp01, type Rng } from "../rng.js";
import type {
  Emetteur,
  EtiquetageParams,
  GroupePopulation,
  JournalTirage,
} from "../types.js";

export interface ResultatEtiquetage {
  groupe: GroupePopulation;
  emetteur: Emetteur;
  deltaIdentite: number;
  coutEmetteur: number;
  journal: JournalTirage[];
}

const DELTA_MAX = 0.15;
const BRUIT_MAX = 0.02;

export function appliquerEtiquetage(
  groupe: GroupePopulation,
  emetteur: Emetteur,
  params: EtiquetageParams,
  rng: Rng,
  graine: number,
): ResultatEtiquetage {
  const journal: JournalTirage[] = [];

  const exposition = clamp01(groupe.exposition);
  if (exposition <= 0) {
    return { groupe: { ...groupe }, emetteur: { ...emetteur }, deltaIdentite: 0, coutEmetteur: 0, journal };
  }

  const tirage = rng.next();
  journal.push({ regle: "R1", graine, rang: rng.tirageRang, valeur: tirage });
  const bruit = (tirage - 0.5) * 2 * BRUIT_MAX;

  const credibilite = clamp01(emetteur.credibilite);
  const grossierete = clamp01(params.grossierete);
  const repetition = clamp01(params.repetition);
  const menace = clamp01(groupe.menacePercue);
  const contacts = clamp01(groupe.contactsCroises);
  const interets = clamp01(groupe.interetsPartages);
  const marque = clamp01(params.marqueForce);

  // Réactance : étiquetage grossier porté par une source peu crédible.
  const react = grossierete * (1 - credibilite);
  if (react > 0.5) {
    const baisse = clamp01(0.08 + react * 0.1);
    const cout = clamp01(0.05 + react * 0.1);
    return {
      groupe: { ...groupe, identiteActive: clamp01(groupe.identiteActive - baisse) },
      emetteur: {
        ...emetteur,
        reputation: clamp01(emetteur.reputation - cout),
        credibilite: clamp01(emetteur.credibilite - cout * 0.5),
      },
      deltaIdentite: -baisse,
      coutEmetteur: cout,
      journal,
    };
  }

  const base = 0.06 * exposition;
  const renfort = base * (1 + 0.6 * repetition + 0.5 * menace + 0.4 * marque + 0.5 * credibilite);
  const attenuation = 1 - 0.5 * contacts - 0.4 * interets;
  const delta = Math.min(DELTA_MAX, Math.max(0, renfort * attenuation + bruit * exposition));

  return {
    groupe: { ...groupe, identiteActive: clamp01(groupe.identiteActive + delta) },
    emetteur: { ...emetteur },
    deltaIdentite: delta,
    coutEmetteur: 0,
    journal,
  };
}

// Biais d'allocation : part favorisant l'ingroup lors d'un arbitrage.
// Prime à la différence : même à gain joint égal, l'écart ingroup prime.
export function biaisAllocation(groupe: GroupePopulation, contactsCroises: number): number {
  const identite = clamp01(groupe.identiteActive);
  const contacts = clamp01(contactsCroises);
  return clamp01(0.5 + 0.45 * identite - 0.25 * contacts);
}
