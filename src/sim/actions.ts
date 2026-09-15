// Catalogue des actions hebdo du joueur, mappées aux règles R1 à R22 quand ça a du sens.
// Une action coûte du temps (0..1) et parfois de l'argent. Le moteur continue de tourner chaque semaine.
import type { ActionJouable } from "./engine.js";

export type CategorieAction = "terrain" | "media" | "coalition" | "institution" | "preparation";

export interface EffetsAction {
  soutiens?: number;
  organisation?: number;
  audience?: number;
  militants?: number;
  notoriete?: number;
  legitime?: number;
  reputation?: number;
  exposition?: number;
  risque?: number;
  argent?: number;
}

export interface ActionJeu {
  id: string;
  libelle: string;
  categorie: CategorieAction;
  description: string;
  coutTemps: number; // 0..1
  coutArgent: number; // 0..1
  moteur?: ActionJouable; // passe dans la boucle du monde (adversaires réagissent)
  regle?: string; // règle du catalogue mobilisée, pour le texte et les tests
  effets: EffetsAction;
}

export const ACTIONS_JEU: ActionJeu[] = [
  {
    id: "tractage-marche",
    libelle: "Tracter au marché",
    categorie: "terrain",
    description: "Une table, des tracts, des visages. Le bouche à oreille de base.",
    coutTemps: 0.3,
    coutArgent: 0.02,
    effets: { soutiens: 0.04, militants: 0.04, notoriete: 0.02 },
  },
  {
    id: "porte-a-porte",
    libelle: "Faire du porte à porte",
    categorie: "terrain",
    description: "Long, usant, irremplaçable. Tu apprends ce que les gens pensent vraiment.",
    coutTemps: 0.4,
    coutArgent: 0,
    effets: { soutiens: 0.05, notoriete: 0.01, organisation: 0.01 },
  },
  {
    id: "reunion-publique",
    libelle: "Tenir une réunion publique",
    categorie: "terrain",
    description: "Salle des fêtes, quinze chaises, un projecteur. Le risque : la surexposition précoce.",
    coutTemps: 0.35,
    coutArgent: 0.05,
    effets: { notoriete: 0.06, soutiens: 0.04, exposition: 0.08, risque: 0.04 },
  },
  {
    id: "creer-cellule",
    libelle: "Créer une cellule locale",
    categorie: "terrain",
    description: "Un local, un cahier de responsabilités, des permanences. Ça tient tout seul après.",
    coutTemps: 0.35,
    coutArgent: 0.12,
    effets: { organisation: 0.08, militants: 0.05 },
  },
  {
    id: "soutenir-mouvement",
    libelle: "Soutenir un mouvement social",
    categorie: "terrain",
    description: "Marcher devant, parler peu, être vu juste. La légitimité de la rue.",
    coutTemps: 0.3,
    coutArgent: 0,
    effets: { legitime: 0.05, soutiens: 0.05, notoriete: 0.03, risque: 0.02 },
  },
  {
    id: "affiche-marque",
    libelle: "Coller ta marque",
    categorie: "media",
    description: "Nom simple, symbole dessinable, double lecture pour initiés (R12).",
    coutTemps: 0.25,
    coutArgent: 0.06,
    regle: "R12",
    effets: { notoriete: 0.05, militants: 0.03, exposition: 0.05, risque: 0.03 },
  },
  {
    id: "film-reseaux",
    libelle: "Publier en vidéo",
    categorie: "media",
    description: "Répétition et familiarité, rendements décroissants (R2). Trois passages utiles.",
    coutTemps: 0.3,
    coutArgent: 0.02,
    regle: "R2",
    effets: { audience: 0.1, notoriete: 0.04, exposition: 0.06 },
  },
  {
    id: "tribune-opinion",
    libelle: "Publier une tribune",
    categorie: "media",
    description: "Texte signé dans la presse. La crédibilité d'abord, le risque de réfutation ensuite (R13).",
    coutTemps: 0.35,
    coutArgent: 0,
    regle: "R13",
    effets: { notoriete: 0.05, legitime: 0.04, audience: 0.06, risque: 0.05 },
  },
  {
    id: "interview-radio",
    libelle: "Passer à la radio locale",
    categorie: "media",
    description: "Dix minutes en direct. Ça dépend de ta persuasion du jour.",
    coutTemps: 0.25,
    coutArgent: 0,
    effets: { notoriete: 0.05, audience: 0.08, risque: 0.04 },
  },
  {
    id: "etiquetage-modere",
    libelle: "Étiquetage modéré",
    categorie: "media",
    description: "Nommer un nous, sans brutalité. Favoritisme ingroup progressif (R1).",
    coutTemps: 0.3,
    coutArgent: 0,
    moteur: "etiquetage-modere",
    regle: "R1",
    effets: { notoriete: 0.03, exposition: 0.04, risque: 0.08 },
  },
  {
    id: "etiquetage-agressif",
    libelle: "Étiquetage agressif",
    categorie: "media",
    description: "Grossier, répété, efficace à court terme. Réactance et contre mobilisation possibles (R1).",
    coutTemps: 0.3,
    coutArgent: 0,
    moteur: "etiquetage-agressif",
    regle: "R1",
    effets: { notoriete: 0.05, exposition: 0.08, risque: 0.18, reputation: -0.04 },
  },
  {
    id: "chercher-coalition",
    libelle: "Chercher des alliés",
    categorie: "coalition",
    description: "Associer, fédérer, écrire à des gens qui te ressemblent presque.",
    coutTemps: 0.35,
    coutArgent: 0.02,
    moteur: "chercher-coalition",
    effets: { organisation: 0.04, legitime: 0.02 },
  },
  {
    id: "diner-notables",
    libelle: "Dîner de notables",
    categorie: "coalition",
    description: "Argent et carnet d'adresses, contre promesses et compromis.",
    coutTemps: 0.3,
    coutArgent: 0.08,
    effets: { argent: -0.05, organisation: 0.05, legitime: 0.03, reputation: -0.02 },
  },
  {
    id: "rencontrer-elus",
    libelle: "Rencontrer les élus",
    categorie: "institution",
    description: "Préfecture, mairie, sous-préfet. L'accès institutionnel se ménage, pas se force.",
    coutTemps: 0.3,
    coutArgent: 0.03,
    effets: { legitime: 0.04, organisation: 0.03 },
  },
  {
    id: "depot-association",
    libelle: "Déposer une association",
    categorie: "institution",
    description: "La voie légale d'abord (R15) : papier, statuts, compte en banque, légitimité.",
    coutTemps: 0.4,
    coutArgent: 0.06,
    regle: "R15",
    effets: { legitime: 0.06, organisation: 0.06, notoriete: 0.01 },
  },
  {
    id: "attaquer-institution",
    libelle: "Attaquer une institution",
    categorie: "institution",
    description: "Crier contre le système. Ça monte vite, ça se retourne vite (R16, R14).",
    coutTemps: 0.3,
    coutArgent: 0,
    moteur: "attaquer-institution",
    effets: { notoriete: 0.06, legitime: -0.05, risque: 0.2 },
  },
  {
    id: "preparer-silencieux",
    libelle: "Préparer en silence",
    categorie: "preparation",
    description: "Réseau, marque, corpus. Rien en apparence, tout en dessous (R22).",
    coutTemps: 0.35,
    coutArgent: 0.02,
    moteur: "preparer-silencieux",
    regle: "R22",
    effets: { organisation: 0.05, militants: 0.03, notoriete: -0.01 },
  },
  {
    id: "euphemiser-lexique",
    libelle: "Polir ton lexique",
    categorie: "preparation",
    description: "Remplacer les mots brutaux par des mots nets mais doux (R10).",
    coutTemps: 0.25,
    coutArgent: 0,
    regle: "R10",
    effets: { legitime: 0.04, reputation: 0.02, notoriete: -0.02 },
  },
];

export function actionParId(id: string): ActionJeu {
  const a = ACTIONS_JEU.find((x) => x.id === id);
  if (a === undefined) throw new Error(`Action inconnue : ${id}`);
  return a;
}