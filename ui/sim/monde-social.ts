// Monde social P1 (vision design §Entités) : le graphe du monde, pas des listes juxtaposées.
// Personnes, organisations, médias et groupes d'opinion sont des nœuds reliés par des liens typés,
// et chaque nœud porte une mémoire d'événements datée. L'UI n'y touche qu'en lecture : ce module
// est pur, seedé, sans React, testé. Les liens issus des personnages proviennent de leurs
// organisations réelles (personnages.ts), jamais d'une décorrelation inventée.
import type { Metier, Personnage } from "./personnages.js";
import type { Monde } from "./engine.js";
import { MEDIAS } from "./medias.js";

export type NoeudType = "personne" | "organisation" | "media" | "groupe";

// P1 : alliances et rivalités initiales (reprises du brouillon supprimé mondeSocial.ts) vivent
// dans le même graphe, comme liens typés entre organisations.
export type LienType = "appartenance" | "influence" | "information" | "alliance" | "rivalite";

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
  type: string; // "rencontre" | "passage-media" | "choc-eco" | "decisions" | "evenement-monde" | "relation-initiale"
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

// Reprise du brouillon supprimé mondeSocial.ts : la mémoire de chaque nœud vit en fenêtre
// glissante. Un nœud ne retient que ses MEMOIRE_LIMITE événements les plus récents : les plus
// vieux sortent, rien n'est jamais écrasé ni réécrit.
export const MEMOIRE_LIMITE = 40;

export function idOrganisation(org: string): string {
  return `org.${org.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

export const NOEUD_JOUEUR = "pers.joueur";

// Construction depuis les entités réelles du monde : personnages (avec leurs organisations),
// médias, groupes d'opinion du moteur, plus le nœud du joueur nommé. Les liens personne↔organisation
// sont des appartenances à force forte, les liens entre collègues de la même organisation des
// liens d'information faibles.
export function creerMondeSocial(
  personnages: Personnage[],
  monde: Monde,
  graine: number,
  nomJoueur: string = "Toi",
): MondeSocial {
  void graine; // la construction est déterministe ; la graine reste pour les extensions futures
  const noeuds: NoeudSocial[] = [];
  const liens: LienSocial[] = [];
  const evenements: EvenementSocial[] = [];
  const vus = new Set<string>();
  const ajouterNoeud = (n: NoeudSocial) => {
    if (vus.has(n.id)) return;
    vus.add(n.id);
    noeuds.push(n);
  };

  // Le joueur est un nœud comme les autres : il porte ses propres décisions datées.
  ajouterNoeud({ id: NOEUD_JOUEUR, type: "personne", nom: nomJoueur });

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

  // Alliances et rivalités initiales (reprise du brouillon supprimé mondeSocial.ts, datées au
  // tick 0). Hypothèse de modélisation P1 ancrée dans les organisations réelles du monde :
  // les trois états-majors de partis se font la guerre, le syndicat affronte le patronat et
  // s'allie au terrain associatif, le courant parlementaire modéré est lié à la chambre.
  // Une paire n'existe que si les deux organisations sont bien des nœuds du graphe.
  const orgDe = (metier: Metier): string | undefined => personnages.find((p) => p.metier === metier)?.organisation;
  const leadersParti = personnages.filter((p) => p.metier === "leader-parti");
  const relationsInitiales: {
    a: string | undefined;
    b: string | undefined;
    type: LienType;
    force: number;
    texte: string;
  }[] = [
    ...leadersParti.flatMap((a, i) =>
      leadersParti.slice(i + 1).map((b) => ({
        a: a.organisation,
        b: b.organisation,
        type: "rivalite" as const,
        force: 0.5,
        texte: "Rivalité d'états-majors, vieille comme les courants.",
      })),
    ),
    {
      a: orgDe("syndicaliste"),
      b: orgDe("entrepreneur"),
      type: "rivalite",
      force: 0.6,
      texte: "Le syndicat contre le groupe industriel : la ligne de front locale.",
    },
    {
      a: orgDe("syndicaliste"),
      b: orgDe("figure-associative"),
      type: "alliance",
      force: 0.5,
      texte: "Le terrain partagé des quartiers populaires.",
    },
    {
      a: orgDe("depute"),
      b: leadersParti.find((l) => l.id === "pers.leader-modere")?.organisation,
      type: "alliance",
      force: 0.4,
      texte: "Le courant parlementaire modéré et la chambre.",
    },
  ];
  for (const r of relationsInitiales) {
    if (r.a === undefined || r.b === undefined || r.a === r.b) continue;
    const idA = idOrganisation(r.a);
    const idB = idOrganisation(r.b);
    if (!vus.has(idA) || !vus.has(idB)) continue;
    const libelle = r.type === "alliance" ? "Alliance" : "Rivalité";
    liens.push({ de: idA, vers: idB, type: r.type, force: r.force });
    evenements.push({ tick: 0, noeudId: idA, type: "relation-initiale", texte: `${libelle} avec ${r.b} : ${r.texte}` });
    evenements.push({ tick: 0, noeudId: idB, type: "relation-initiale", texte: `${libelle} avec ${r.a} : ${r.texte}` });
  }

  return { noeuds, liens, evenements };
}

// La mémoire : un événement daté apposé sur un nœud, en fenêtre glissante. Le nœud ne garde
// que ses MEMOIRE_LIMITE événements les plus récents ; le reste sort, jamais écrasé en route.
export function enregistrerEvenement(ms: MondeSocial, e: EvenementSocial): MondeSocial {
  const duNoeud = ms.evenements.filter((x) => x.noeudId === e.noeudId);
  const fenetre = duNoeud.length >= MEMOIRE_LIMITE ? duNoeud.slice(duNoeud.length - MEMOIRE_LIMITE + 1) : duNoeud;
  const autres = ms.evenements.filter((x) => x.noeudId !== e.noeudId);
  return { ...ms, evenements: [...autres, ...fenetre, e] };
}

// Chronologie inversée d'un nœud : les événements les plus récents d'abord.
export function memoireLisible(ms: MondeSocial, noeudId: string): EvenementSocial[] {
  return ms.evenements.filter((e) => e.noeudId === noeudId).sort((a, b) => b.tick - a.tick);
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

// J7 : au palier 1, le joueur, les visages de proximité, leurs organisations, les médias
// accessibles et les groupes perçus. Au delà, tout le graphe. Les organisations suivent
// leurs membres visibles : une organisation n'apparaît que si une personne visible y appartient.
export function noeudsVisiblesDuPalier(
  ms: MondeSocial,
  palier: number,
  idsPersonnes: string[],
  idsMedias: string[],
): string[] {
  if (palier > 1) return ms.noeuds.map((n) => n.id);
  const visibles = new Set<string>([NOEUD_JOUEUR, ...idsPersonnes, ...idsMedias]);
  const types = new Map(ms.noeuds.map((n) => [n.id, n.type] as const));
  for (const l of ms.liens) {
    if (l.type !== "appartenance") continue;
    if (visibles.has(l.de) && types.get(l.vers) === "organisation") visibles.add(l.vers);
    if (visibles.has(l.vers) && types.get(l.de) === "organisation") visibles.add(l.de);
  }
  for (const n of ms.noeuds) {
    if (n.type === "groupe") visibles.add(n.id);
  }
  return [...visibles];
}
