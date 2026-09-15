// Médias du monde : orientation, vigilance (fact checking), audiences par groupe.
// Les actions média passent par un média, qui module la portée et fait peser un risque de réfutation.
import type { CategorieAction } from "./actions.js";

export interface Media {
  id: string;
  nom: string;
  orientation: string;
  vigilance: number; // 0..1, probabilité de débunkage selon la solidité du propos
  audiences: Record<string, number>; // groupeId vers 0..1
  amplification: number; // 0..1, effet réseau numérique
}

export const MEDIAS: Media[] = [
  {
    id: "med.quotidien-regional",
    nom: "Le Quotidien régional",
    orientation: "centriste",
    vigilance: 0.55,
    audiences: { "grp.centre": 0.6, "grp.peripherie": 0.45 },
    amplification: 0.2,
  },
  {
    id: "med.radio-matin",
    nom: "Radio Matin locale",
    orientation: "populaire",
    vigilance: 0.25,
    audiences: { "grp.centre": 0.4, "grp.peripherie": 0.75 },
    amplification: 0.3,
  },
  {
    id: "med.flux-numerique",
    nom: "Flux numérique fragmenté",
    orientation: "algorithme",
    vigilance: 0.1,
    audiences: { "grp.centre": 0.5, "grp.peripherie": 0.6 },
    amplification: 0.7,
  },
];

export function mediaParId(id: string): Media {
  const m = MEDIAS.find((x) => x.id === id);
  if (m === undefined) throw new Error(`Média inconnu : ${id}`);
  return m;
}

export type StatutPreuve = "etabli" | "conteste" | "trompeur" | "faux";

export interface EffetMedia {
  multiplicateur: number; // appliqué aux deltas de portée de l'action
  risqueFactCheck: number; // 0..1, ajouté au risque d'enquête et de réputation
  detail: string;
}

// R2 amplification, R13 réfutation : la portée dépend de l'audience, le risque de la vigilance.
export function routerMedia(
  m: Media,
  categorie: CategorieAction,
  bonusMedia: number,
  statutPreuve: StatutPreuve = "conteste",
): EffetMedia {
  if (categorie !== "media") {
    return { multiplicateur: 1, risqueFactCheck: 0, detail: "action hors média, pas de routage" };
  }
  const audiences = Object.values(m.audiences);
  const audienceMoyenne = audiences.reduce((s, a) => s + a, 0) / Math.max(1, audiences.length);
  const multiplicateur = Math.max(
    0.4,
    Math.min(2.2, 0.5 + audienceMoyenne * 0.8 + m.amplification * 0.4 + bonusMedia * 0.8),
  );
  const baseStatut = statutPreuve === "faux" ? 0.9 : statutPreuve === "trompeur" ? 0.6 : statutPreuve === "conteste" ? 0.3 : 0.1;
  const risqueFactCheck = Math.min(1, m.vigilance * baseStatut + (statutPreuve === "faux" ? 0.2 : 0));
  return {
    multiplicateur,
    risqueFactCheck,
    detail: `${m.nom} (${m.orientation}, vigilance ${m.vigilance.toFixed(2)}, amplification ${m.amplification.toFixed(2)})`,
  };
}
