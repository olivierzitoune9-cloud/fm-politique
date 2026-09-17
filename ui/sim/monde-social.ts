// Monde social P1 (vision design §Entités) : le graphe du monde, pas des listes juxtaposées.
// Personnes, organisations, médias et groupes d'opinion sont des nœuds reliés par des liens typés,
// et chaque nœud porte une mémoire d'événements datée. L'UI n'y touche qu'en lecture : ce module
// est pur, seedé, sans React, testé. Les liens issus des personnages proviennent de leurs
// organisations réelles (personnages.ts), jamais d'une décorrelation inventée.
import type { Personnage } from "./personnages.js";
import type { Monde } from "./engine.js";
import { MEDIAS } from "./medias.js";

export type NoeudType = "personne" | "organisation" | "media" | "groupe";

export type LienType = "appartenance" | "influence" | "information";

export interface NoeudSocial {
  id: string;
  type: NoeudType;
  nom: string;
}

export interface LienSocial {
  de: string;
  vers: string;
  type: LienType;
  force: number; // 0..1
}

export interface EvenementSocial {
  tick: number;
  noeudId: string;
  type: string; // "rencontre" | "passage-media" | "choc-eco" | "decisions" | "evenement-monde"
  texte: string;
}

export interface MondeSocial {
  noeuds: NoeudSocial[];
  liens: LienSocial[];
  evenements: EvenementSocial[];
}

export interface VueMondeSocial {
  noeuds: NoeudSocial[];
  liens: LienSocial[];
  evenements: EvenementSocial[];
}

function idOrganisation(org: string): string {
  return `org.${org.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

// Construction depuis les entités réelles du monde : personnages (avec leurs organisations),
// médias, groupes d'opinion du moteur. Les liens personne↔organisation sont des appartenances
// à force forte, les liens entre collègues de la même organisation des liens d'information faibles.
export function creerMondeSocial(personnages: Personnage[], monde: Monde, graine: number): MondeSocial {
  void graine; // la construction est déterministe ; la graine reste pour les extensions futures
  const noeuds: NoeudSocial[] = [];
  const liens: LienSocial[] = [];
  const vus = new Set<string>();
  const ajouterNoeud = (n: NoeudSocial) => {
    if (vus.has(n.id)) return;
    vus.add(n.id);
    noeuds.push(n);
  };

  const orgsRencontres = new Map<string, string[]>(); // id org -> ids personnes
  for (const p of personnages) {
    const idOrg = idOrganisation(p.organisation);
    ajouterNoeud({ id: p.id, type: "personne", nom: `${p.prenom} ${p.nom}` });
    ajouterNoeud({ id: idOrg, type: "organisation", nom: p.organisation });
    liens.push({ de: p.id, vers: idOrg, type: "appartenance", force: 0.8 });
    const collègues = orgsRencontres.get(idOrg) ?? [];
    for (const c of collègues) liens.push({ de: c, vers: p.id, type: "information", force: 0.3 });
    orgsRencontres.set(idOrg, [...collègues, p.id]);
  }

  for (const m of MEDIAS) {
    ajouterNoeud({ id: m.id, type: "media", nom: m.nom });
  }

  for (const g of monde.groupes) {
    ajouterNoeud({ id: g.id, type: "groupe", nom: g.id.replace("grp.", "Groupe ") });
  }

  // Influence : les leaders de partis pèsent sur les groupes d'opinion (hypothèse de modélisation P1,
  // à affiner en P2 avec les relations partis). Force modérée, jamais déterminante seule.
  for (const p of personnages) {
    if (p.metier !== "leader-parti") continue;
    for (const g of monde.groupes) {
      liens.push({ de: p.id, vers: g.id, type: "influence", force: 0.4 });
    }
  }

  // Les médias diffusent vers tous les groupes (canal d'information, pas d'influence directe).
  for (const m of MEDIAS) {
    for (const g of monde.groupes) {
      liens.push({ de: m.id, vers: g.id, type: "information", force: 0.5 });
    }
  }

  return { noeuds, liens, evenements: [] };
}

// La mémoire : un événement daté apposé sur un nœud. Jamais écrasé, jamais réécrit.
export function enregistrerEvenement(ms: MondeSocial, e: EvenementSocial): MondeSocial {
  return { ...ms, evenements: [...ms.evenements, e] };
}

export function voisins(ms: MondeSocial, noeudId: string): NoeudSocial[] {
  const ids = ms.liens.filter((l) => l.de === noeudId || l.vers === noeudId).map((l) => (l.de === noeudId ? l.vers : l.de));
  return ms.noeuds.filter((n) => ids.includes(n.id));
}

// La carte vue par le joueur : sous-graphe induit par les nœuds visibles. Un lien n'apparaît
// que si ses deux extrémités sont visibles, les événements idem. J7 : la visibilité reste
// pilotée par le palier, jamais par une règle d'affichage d'écran.
export function carteVisible(ms: MondeSocial, noeudsVisibles: string[]): VueMondeSocial {
  const visibles = new Set(noeudsVisibles);
  const noeuds = ms.noeuds.filter((n) => visibles.has(n.id));
  const liens = ms.liens.filter((l) => visibles.has(l.de) && visibles.has(l.vers));
  const evenements = ms.evenements.filter((e) => visibles.has(e.noeudId));
  return { noeuds, liens, evenements };
}
