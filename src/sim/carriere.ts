// Carrière du joueur : statut FM par étapes, ressources hebdo, ambition choisie, progression.
// Le joueur est une instance d'Acteur au sens de l'ontologie, sans jauge unique de pouvoir.
import { nomJoueurAleatoire } from "./personnages.js";
import type { Rng } from "./rng.js";

export type Ambition = "elu" | "chef-parti" | "proposition" | "presidentiel";

export interface AmbitionDef {
  id: Ambition;
  libelle: string;
  description: string;
  echeanceId: string;
  seuil: number;
}

export const AMBITIONS: AmbitionDef[] = [
  {
    id: "elu",
    libelle: "Se faire élire député en 2027",
    description: "Passer de l'arrière-bureau au banc de l'Assemblée aux législatives de juin 2027.",
    echeanceId: "legislatives-2027-t1",
    seuil: 0.45,
  },
  {
    id: "chef-parti",
    libelle: "Prendre la tête d'un parti",
    description: "Devenir incontournable dans un parti existant d'ici juin 2027.",
    echeanceId: "legislatives-2027-t2",
    seuil: 0.5,
  },
  {
    id: "proposition",
    libelle: "Imposer ta proposition",
    description: "Faire de ton idée une chose dicible partout puis un texte discuté d'ici la fin 2027.",
    echeanceId: "legislatives-2027-t2",
    seuil: 0.65,
  },
  {
    id: "presidentiel",
    libelle: "Viser la présidentielle en outsider",
    description: "Le chemin le plus improbable : être en lice ou au pouvoir en avril 2027.",
    echeanceId: "presidentielle-2027-t2",
    seuil: 0.6,
  },
];


export type StatutCarriere = "employe" | "militant" | "responsable-local" | "conseiller" | "elu";

export const STATUTS: {
  id: StatutCarriere;
  libelle: string;
  seuilSoutiens: number;
  seuilOrganisation: number;
  seuilLegitime: number;
}[] = [
  { id: "employe", libelle: "Employé de bureau", seuilSoutiens: 0, seuilOrganisation: 0, seuilLegitime: 0 },
  { id: "militant", libelle: "Militant connu localement", seuilSoutiens: 0.1, seuilOrganisation: 0.05, seuilLegitime: 0 },
  { id: "responsable-local", libelle: "Responsable d'antenne locale", seuilSoutiens: 0.2, seuilOrganisation: 0.25, seuilLegitime: 0.1 },
  { id: "conseiller", libelle: "Conseiller de figure en place", seuilSoutiens: 0.3, seuilOrganisation: 0.35, seuilLegitime: 0.25 },
  { id: "elu", libelle: "Élu", seuilSoutiens: 0.4, seuilOrganisation: 0.4, seuilLegitime: 0.4 },
];

export interface Progression {
  soutiens: number; // 0..1, ressource mobilisable
  legitime: number; // 0..1, droit à commander (M13 M14)
  organisation: number; // 0..1
  notoriete: number; // 0..1, chaleur sondagière (M22)
  reputation: number; // 0..1, mémoire de fiabilité
}

export interface Carriere {
  nom: string;
  origine: string;
  traits: string[];
  ideologie: { gaucheDroite: number; ouvertFerme: number }; // -1..1
  ambition: Ambition;
  statut: StatutCarriere;
  ressources: { temps: number; argent: number; audience: number; militants: number }; // 0..1
  progression: Progression;
  risqueEnquete: number; // 0..1, cumul des coups risqués
  semainesMarginalise: number;
  bonusMedia: number; // micro ciblage experte IA, décroît chaque semaine
  infoPrecise: boolean; // fact-checker ou fonctionnaire, consommé au prochain regard
  contactsCroises: number; // atténuateur R1 via figure associative
}

export const AVERTISSEMENT_OUVERTURE =
  "Simulation émergente : trajectoires possibles, jamais de prédiction du réel ni de recommandation. " +
  "Certaines trajectoires d'accession au pouvoir, y compris autoritaires, sont simulées pour être comprises, jamais proposées comme des modèles.";

export const ORIGINES = ["bureau", "atelier", "quartier-populaire", "province", "enseignant"] as const;
export type Origine = (typeof ORIGINES)[number];

export const LIBELLES_ORIGINE: Record<Origine, string> = {
  bureau: "Employé de bureau en open space",
  atelier: "Ouvrier qualifié d'atelier",
  "quartier-populaire": "Vie de quartier populaire",
  province: "Vie de petite ville de province",
  enseignant: "Enseignant dans un collège",
};

export const TRAITS_JOUEUR = ["empathique", "travailleur", "bagoureux", "discret", "obstiné", "caméléon"] as const;

export interface ConfigCarriere {
  nom?: string;
  origine: Origine;
  traits: string[];
  ideologie: { gaucheDroite: number; ouvertFerme: number };
  ambition: Ambition;
  propositionTexte?: string;
}

export function creerCarriere(config: ConfigCarriere, rng: Rng): Carriere {
  return {
    nom: config.nom && config.nom.trim().length > 0 ? config.nom.trim() : nomJoueurAleatoire(rng),
    origine: config.origine,
    traits: config.traits.slice(0, 2),
    ideologie: {
      gaucheDroite: Math.max(-1, Math.min(1, config.ideologie.gaucheDroite)),
      ouvertFerme: Math.max(-1, Math.min(1, config.ideologie.ouvertFerme)),
    },
    ambition: config.ambition,
    statut: "employe",
    ressources: { temps: 1, argent: 0.2, audience: 0.05, militants: 0.05 },
    progression: { soutiens: 0.02, legitime: 0.02, organisation: 0.02, notoriete: 0.01, reputation: 0.5 },
    risqueEnquete: 0,
    semainesMarginalise: 0,
    bonusMedia: 0,
    infoPrecise: false,
    contactsCroises: 0,
  };
}

export function libelleStatut(statut: StatutCarriere): string {
  return STATUTS.find((s) => s.id === statut)!.libelle;
}

// Promotion quand les seuils du statut le plus haut atteint sont franchis.
export function statutCible(p: Progression): StatutCarriere {
  let cible: StatutCarriere = "employe";
  for (const s of STATUTS) {
    if (p.soutiens >= s.seuilSoutiens && p.organisation >= s.seuilOrganisation && p.legitime >= s.seuilLegitime) {
      cible = s.id;
    }
  }
  return cible;
}

// Persuasion du joueur : traits, notoriété et audience. Bornée, hypothèse de gameplay.
export function persuasionJoueur(c: Carriere): number {
  const bonusTrait = c.traits.includes("empathique") ? 0.1 : 0;
  const bonusBagou = c.traits.includes("bagoureux") ? 0.08 : 0;
  return Math.min(0.9, 0.15 + c.progression.notoriete * 0.3 + c.ressources.audience * 0.3 + bonusTrait + bonusBagou);
}

// Régénération hebdomadaire : le temps revient, l'audience et les militants s'usent.
export function regenererHebdo(c: Carriere): Carriere {
  return {
    ...c,
    ressources: {
      temps: 1,
      argent: Math.min(1, c.ressources.argent + 0.02),
      audience: c.ressources.audience * 0.9,
      militants: c.ressources.militants * 0.95,
    },
    bonusMedia: c.bonusMedia * 0.5,
    infoPrecise: false,
  };
}

export function clamp01b(x: number): number {
  if (Number.isNaN(x)) return 0;
  return x < 0 ? 0 : x > 1 ? 1 : x;
}
