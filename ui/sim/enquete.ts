// Enquête P2 (vision gameplay §14-16, design §14, §32, §80) : la boucle observer, identifier,
// enquêter. Un dossier est la fiche approfondie d'un nœud du graphe social : ses faits viennent
// de la mémoire datée du nœud, ses liens du graphe, jamais d'une invention. Module pur, testé.
// Règle §118 : une mécanique générale (le dossier), pas trois.
import { idOrganisation, memoireLisible, noeudsVisiblesDuPalier, type MondeSocial, type NoeudType } from "./monde-social.js";
import { libelleMetier, type Personnage } from "./personnages.js";
import { palierDeStatut } from "./carriere.js";

// Un dossier ouvert persiste dans la partie : uniquement la référence, les faits restent
// dérivés de la mémoire du graphe à la lecture, pour ne jamais figer une copie périmée.
export interface DossierRef {
  sujetId: string;
  tickOuverture: number;
}

export interface FaitEnquete {
  tick: number;
  texte: string;
  source: string; // le type d'événement social qui a produit le fait
}

export interface LienDossier {
  id: string;
  nom: string;
  type: string; // libellé brut du lien (appartenance, influence, information, alliance, rivalite)
  force: number;
}

export interface Dossier {
  sujetId: string;
  titre: string;
  type: NoeudType;
  tickOuverture: number | null; // null : dossier jamais ouvert, vue de recherche seulement
  complet: boolean; // faux : le sujet est hors de ta portée, la fiche reste mince
  note: string | null;
  faits: FaitEnquete[];
  liens: LienDossier[];
}

// Les huit dernières semaines sont l'horizon d'un signal faible. Au delà, ce n'est plus un
// signal, c'est de l'histoire. Hypothèse de modélisation P2, calibrée sur le rythme hebdo.
export const HORIZON_SIGNAL = 8;

// La partie vue par l'enquête : le strict minimum, pour rester un module pur.
export interface PartieEnquete {
  tick: number;
  carriere: { statut: string };
  dossiers: DossierRef[];
  mondeSocial: MondeSocial;
}

// Le joueur peut ouvrir un dossier sur tout nœud existant du graphe, même hors de sa portée :
// la fiche restera mince jusqu'à ce que le sujet devienne visible. Rien n'est refusé, tout est
// proportionné. Générique : une Partie complète rentre et ressort, sans perte de champs.
export function ouvrirDossier<T extends PartieEnquete>(partie: T, sujetId: string, tick: number): T {
  const existe = partie.mondeSocial.noeuds.some((n) => n.id === sujetId);
  if (!existe) throw new Error(`Sujet inconnu : ${sujetId}`);
  if (partie.dossiers.some((d) => d.sujetId === sujetId)) return partie;
  return { ...partie, dossiers: [...partie.dossiers, { sujetId, tickOuverture: tick }] };
}

export function dossierOuvert(partie: PartieEnquete, sujetId: string): DossierRef | null {
  return partie.dossiers.find((d) => d.sujetId === sujetId) ?? null;
}

// Miroir des règles de visibilité J7 (métiers de proximité, premier média), sans import
// circulaire vers partie.js. Si les métiers de proximité changent, les deux fichiers suivent.
const METIERS_PROXIMITE: string[] = [
  "elu-local",
  "syndicaliste",
  "figure-associative",
  "fonctionnaire",
  "entrepreneur",
  "chercheur",
  "historien",
];
const MEDIAS_IDS: string[] = ["med.quotidien-regional", "med.radio-matin", "med.flux-numerique"];

function visiblesAuPalier(partie: PartieEnquete, personnages: Personnage[], palier: number): Set<string> {
  const visiblesPersonnes = (
    palier <= 1 ? personnages.filter((p) => METIERS_PROXIMITE.includes(p.metier)) : personnages
  ).map((p) => p.id);
  const visiblesMedias = palier <= 1 ? [MEDIAS_IDS[0]] : MEDIAS_IDS;
  return new Set(noeudsVisiblesDuPalier(partie.mondeSocial, palier, visiblesPersonnes, visiblesMedias));
}


// La fiche approfondie : faits = mémoire datée du nœud, liens = graphe, complet selon le palier.
export function lireDossier(partie: PartieEnquete, sujetId: string, personnages: Personnage[]): Dossier | null {
  const noeud = partie.mondeSocial.noeuds.find((n) => n.id === sujetId);
  if (noeud === undefined) return null;
  const palier = palierDeStatut(partie.carriere.statut as Parameters<typeof palierDeStatut>[0]);
  const visibles = visiblesAuPalier(partie, personnages, palier);
  const ref = dossierOuvert(partie, sujetId);
  const liens = partie.mondeSocial.liens
    .filter((l) => l.de === sujetId || l.vers === sujetId)
    .map((l) => {
      const autre = l.de === sujetId ? l.vers : l.de;
      const nom = partie.mondeSocial.noeuds.find((n) => n.id === autre)?.nom ?? autre;
      return { id: autre, nom, type: l.type, force: l.force };
    });
  if (!visibles.has(sujetId)) {
    return {
      sujetId,
      titre: noeud.nom,
      type: noeud.type,
      tickOuverture: ref?.tickOuverture ?? null,
      complet: false,
      note: "Hors de ta portée : tu sais que ça existe, pas ce que ça fait. Monte de palier ou rapproche-toi.",
      faits: [],
      liens: [],
    };
  }
  const faits = memoireLisible(partie.mondeSocial, sujetId).map((e) => ({
    tick: e.tick,
    texte: e.texte,
    source: e.type,
  }));
  return {
    sujetId,
    titre: noeud.nom,
    type: noeud.type,
    tickOuverture: ref?.tickOuverture ?? null,
    complet: true,
    note: null,
    faits,
    liens,
  };
}

// Signaux faibles : des choses bougent récemment hors de ta carte. Le monde te parvient en
// nom et en rumeur, jamais en détail tant que le sujet reste hors de portée (design §16).
export interface SignalFaible {
  sujetId: string;
  nom: string;
  type: NoeudType;
  dernierTick: number;
  mouvements: number;
}

export function signalFaibles(partie: PartieEnquete, personnages: Personnage[]): SignalFaible[] {
  const palier = palierDeStatut(partie.carriere.statut as Parameters<typeof palierDeStatut>[0]);
  const visibles = visiblesAuPalier(partie, personnages, palier);
  const seuil = partie.tick - HORIZON_SIGNAL + 1;
  const parNoeud = new Map<string, { dernierTick: number; mouvements: number }>();
  for (const e of partie.mondeSocial.evenements) {
    if (e.tick <= 0 || e.tick < seuil || e.tick > partie.tick || visibles.has(e.noeudId)) continue;
    const noeud = partie.mondeSocial.noeuds.find((n) => n.id === e.noeudId);
    if (noeud === undefined || noeud.type === "groupe") continue;
    const courant = parNoeud.get(e.noeudId);
    parNoeud.set(e.noeudId, {
      dernierTick: Math.max(e.tick, courant?.dernierTick ?? 0),
      mouvements: (courant?.mouvements ?? 0) + 1,
    });
  }
  return [...parNoeud.entries()]
    .map(([sujetId, v]) => {
      const noeud = partie.mondeSocial.noeuds.find((n) => n.id === sujetId)!;
      return { sujetId, nom: noeud.nom, type: noeud.type, dernierTick: v.dernierTick, mouvements: v.mouvements };
    })
    .sort((a, b) => b.dernierTick - a.dernierTick)
    .slice(0, 8);
}

// Recherche interne (gameplay §16, design §80) : toute personne, organisation ou média du
// graphe, par nom, organisation ou métier. Deux lettres minimum, huit résultats maximum.
export interface ResultatRecherche {
  id: string;
  nom: string;
  type: NoeudType;
  visible: boolean;
}

export function rechercherSujets(partie: PartieEnquete, personnages: Personnage[], requete: string): ResultatRecherche[] {
  const q = requete.trim().toLowerCase();
  if (q.length < 2) return [];
  const palier = palierDeStatut(partie.carriere.statut as Parameters<typeof palierDeStatut>[0]);
  const visibles = visiblesAuPalier(partie, personnages, palier);
  const resultats: ResultatRecherche[] = [];
  const vus = new Set<string>();
  const pousser = (id: string, nom: string, type: NoeudType) => {
    if (vus.has(id) || resultats.length >= 8) return;
    vus.add(id);
    resultats.push({ id, nom, type, visible: visibles.has(id) });
  };
  for (const n of partie.mondeSocial.noeuds) {
    if (n.type === "groupe") continue;
    if (n.nom.toLowerCase().includes(q)) pousser(n.id, n.nom, n.type);
  }
  for (const p of personnages) {
    if (libelleMetier(p.metier).toLowerCase().includes(q)) pousser(p.id, `${p.prenom} ${p.nom}`, "personne");
    if (p.organisation.toLowerCase().includes(q)) {
      pousser(p.id, `${p.prenom} ${p.nom}`, "personne");
      pousser(idOrganisation(p.organisation), p.organisation, "organisation");
    }
  }
  return resultats;
}

// Courrier d'enquête : les événements récents des nœuds visibles arrivent dans l'inbox,
// reliés à leur dossier par un clic. Source = le graphe social, jamais une génération libre.
export interface CourrielEnquete {
  tick: number;
  sujetId: string;
  sujetNom: string;
  objet: string;
  corps: string;
}

export function courrierEnquete(partie: PartieEnquete, personnages: Personnage[]): CourrielEnquete[] {
  const palier = palierDeStatut(partie.carriere.statut as Parameters<typeof palierDeStatut>[0]);
  const visibles = visiblesAuPalier(partie, personnages, palier);
  const seuil = partie.tick - 3;
  return partie.mondeSocial.evenements
    .filter((e) => e.tick > 0 && e.tick >= seuil && e.tick <= partie.tick && visibles.has(e.noeudId))
    .sort((a, b) => b.tick - a.tick)
    .slice(0, 10)
    .map((e) => {
      const noeud = partie.mondeSocial.noeuds.find((n) => n.id === e.noeudId)!;
      return {
        tick: e.tick,
        sujetId: e.noeudId,
        sujetNom: noeud.nom,
        objet: `${noeud.nom} : ${e.type.replace(/-/g, " ")}`,
        corps: e.texte,
      };
    });
}

