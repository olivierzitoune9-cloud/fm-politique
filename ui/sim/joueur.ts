// Joueur jouable : vue filtrée par info imparfaite.
// Le moteur connaît l'état exact, le joueur découvre par sondages, rapports et médias,
// avec sources exactes, approximatives, retardées, biaisées, contradictoires, incomplètes.
// Ici : valeurs arrondies à la dizaine, sources nommées, décisions adverses masquées.
import type { DecisionIA, EvenementCausal, GroupeMonde, Monde } from "./engine.js";
import { raconterChronologie, type TexteNarre } from "./narrative/raconteur.js";

export interface GroupeVu {
  id: string;
  libelle: string;
  identiteAffichee: number;
  basculeAffichee: number;
  receptiviteAffichee: number;
  source: string;
}

export interface VueJoueur {
  tick: number;
  groupes: GroupeVu[];
  mesDecisions: DecisionIA[];
  chronologie: TexteNarre[];
  avertissement: string;
}

function arrondirDizaine(x: number): number {
  return Math.round(x * 10) / 10;
}

// Libellés français des groupes à l'écran, jamais les ids techniques.
export function libelleGroupe(id: string): string {
  if (id === "grp.centre") return "Centre-ville et quartiers installés";
  if (id === "grp.peripherie") return "Périphérie et quartiers populaires";
  return id;
}

export function filtrerVueJoueur(monde: Monde): VueJoueur {
  const groupes: GroupeVu[] = monde.groupes.map((g: GroupeMonde) => ({
    id: g.id,
    libelle: libelleGroupe(g.id),
    identiteAffichee: arrondirDizaine(g.identiteActive),
    basculeAffichee: arrondirDizaine(g.bascule),
    receptiviteAffichee: arrondirDizaine(g.receptiviteOrdre),
    source: "sondage approximatif et rapports retardés",
  }));
  const mesDecisions = monde.decisions.filter((d) => d.acteurId === "joueur");
  const evenements: EvenementCausal[] = monde.evenements;
  return {
    tick: monde.tick,
    groupes,
    mesDecisions,
    chronologie: raconterChronologie(evenements, mesDecisions),
    avertissement: "Simulation émergente : trajectoires possibles, jamais de prédiction du réel ni de recommandation.",
  };
}
