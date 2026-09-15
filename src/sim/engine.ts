// Boucle moteur FM politique avec IA branchée et joueur jouable.
// Ordre fixe : chocs exogènes seedés, décisions (IA ou coup joueur forcé),
// interactions selon l'option, mise à jour d'état, détection d'événements, écriture mémoire.
// Seed plus version moteur égale même simulation. Pur sans React.
import { creerRng, type Rng } from "./rng.js";
import { arbitrer, OPTIONS_PROTOTYPE } from "./ai/arbitrage.js";
import { appliquerEtiquetage } from "./rules/r1-etiquetage.js";
import { appliquerMenace } from "./rules/r3-menace.js";
import { appliquerDetresse } from "./rules/r4-detresse.js";
import { appliquerMasseCritique } from "./rules/r5-masse-critique.js";
import { appliquerPreparation } from "./rules/r22-preparation.js";

export const VERSION_MOTEUR = "m0.4.0";

export const ACTIONS_JOUABLES = [
  "preparer-silencieux",
  "etiquetage-modere",
  "etiquetage-agressif",
  "chercher-coalition",
  "attaquer-institution",
] as const;

export type ActionJouable = (typeof ACTIONS_JOUABLES)[number];

export interface GroupeMonde {
  id: string;
  identiteActive: number;
  menace: number;
  bascule: number;
  satisfactionEco: number;
  perteControle: number;
  receptiviteOrdre: number;
  partMinorite: number;
  adoption: number;
  exposition: number;
  ressourcesActeur: number;
}

export interface ActeurMonde {
  id: string;
  groupeId: string;
  estJoueur: boolean;
  ambition: number;
  aversionRisque: number;
  poids: {
    popularite: number;
    coalition: number;
    base: number;
    institution: number;
    ressources: number;
    risque: number;
  };
  credibilite: number;
  reputation: number;
}

export interface DecisionIA {
  tick: number;
  acteurId: string;
  groupeId: string;
  optionId: string;
}

export interface EvenementCausal {
  tick: number;
  type: string;
  groupeId: string;
  cause: string;
  valeur: number;
}

export interface Monde {
  version: string;
  graine: number;
  tick: number;
  groupes: GroupeMonde[];
  acteurs: ActeurMonde[];
  decisions: DecisionIA[];
  evenements: EvenementCausal[];
  tirages: number;
}

function groupeInitial(id: string, surcharge: Partial<GroupeMonde> = {}): GroupeMonde {
  return {
    id,
    identiteActive: 0.2,
    menace: 0.4,
    bascule: 0.1,
    satisfactionEco: 0.6,
    perteControle: 0.4,
    receptiviteOrdre: 0.2,
    partMinorite: 0.2,
    adoption: 0.05,
    exposition: 0.7,
    ressourcesActeur: 0.2,
    ...surcharge,
  };
}

export function creerMonde(graine: number): Monde {
  return {
    version: VERSION_MOTEUR,
    graine,
    tick: 0,
    groupes: [
      groupeInitial("grp.centre"),
      groupeInitial("grp.peripherie", {
        identiteActive: 0.25,
        menace: 0.5,
        bascule: 0.12,
        satisfactionEco: 0.45,
        perteControle: 0.55,
        receptiviteOrdre: 0.3,
        partMinorite: 0.28,
        adoption: 0.08,
        exposition: 0.8,
      }),
    ],
    acteurs: [
      {
        id: "act.prudent",
        groupeId: "grp.centre",
        estJoueur: false,
        ambition: 0.4,
        aversionRisque: 0.8,
        poids: { popularite: 0.4, coalition: 0.9, base: 0.4, institution: 0.6, ressources: 0.6, risque: 1 },
        credibilite: 0.65,
        reputation: 0.6,
      },
      {
        id: "act.fonceur",
        groupeId: "grp.peripherie",
        estJoueur: false,
        ambition: 0.85,
        aversionRisque: 0.2,
        poids: { popularite: 1, coalition: 0.3, base: 0.9, institution: 0.3, ressources: 0.5, risque: 0.2 },
        credibilite: 0.55,
        reputation: 0.55,
      },
      {
        id: "joueur",
        groupeId: "grp.centre",
        estJoueur: true,
        ambition: 0.7,
        aversionRisque: 0.5,
        poids: { popularite: 0.6, coalition: 0.6, base: 0.6, institution: 0.4, ressources: 0.7, risque: 0.6 },
        // Insignifiant au départ : peu crédible, peu de ressources.
        credibilite: 0.3,
        reputation: 0.4,
      },
    ],
    decisions: [],
    evenements: [],
    tirages: 0,
  };
}

function journaliser(monde: Monde, e: EvenementCausal): void {
  monde.evenements.push(e);
}

function paramsEtiquetage(optionId: string): { grossierete: number; repetition: number; marque: number; actif: boolean } {
  switch (optionId) {
    case "etiquetage-agressif":
      return { grossierete: 0.7, repetition: 0.7, marque: 0.6, actif: true };
    case "etiquetage-modere":
      return { grossierete: 0.25, repetition: 0.5, marque: 0.4, actif: true };
    default:
      return { grossierete: 0, repetition: 0, marque: 0, actif: false };
  }
}

export interface CoupJoueur {
  optionId: ActionJouable;
}

function appliquerActeur(
  sortie: Monde,
  tick: number,
  rng: Rng,
  groupe: GroupeMonde,
  acteur: ActeurMonde,
  optionId: string,
): GroupeMonde {
  const p = paramsEtiquetage(optionId);
  let identite = groupe.identiteActive;
  if (p.actif) {
    // Le joueur insignifiant frappe moins fort : crédibilité faible = effet réduit et risque de réactance.
    const etiq = appliquerEtiquetage(
      {
        id: groupe.id,
        identiteActive: groupe.identiteActive,
        menacePercue: groupe.menace,
        exposition: groupe.exposition,
        contactsCroises: 0.3,
        interetsPartages: 0.3,
      },
      { id: acteur.id, credibilite: acteur.credibilite, reputation: acteur.reputation },
      { grossierete: p.grossierete, repetition: p.repetition, marqueForce: p.marque },
      rng,
      sortie.graine,
    );
    identite = etiq.groupe.identiteActive;
    sortie.tirages += 1;
  }

  let ressources = groupe.ressourcesActeur;
  if (optionId === "preparer-silencieux") {
    const prep = appliquerPreparation({ id: acteur.id, ressources, visibilite: 0.2 }, 0.7, rng, sortie.graine);
    ressources = prep.etat.ressources;
    sortie.tirages += 1;
  }

  sortie.decisions.push({ tick, acteurId: acteur.id, groupeId: groupe.id, optionId });
  return { ...groupe, identiteActive: identite, ressourcesActeur: ressources };
}

// Phase 12. Adversaires réactifs : la mémoire des coups du joueur module les IA.
// Agressivité répétée du joueur durcit le fonceur et fait prendre ses distances au prudent.
// Borné à plus ou moins 0.2, déterministe, sans rng.
export function ajusterAdversaires(monde: Monde): ActeurMonde[] {
  const agressifs = monde.decisions.filter(
    (d) => d.acteurId === "joueur" && (d.optionId === "etiquetage-agressif" || d.optionId === "attaquer-institution"),
  ).length;
  const dose = Math.min(1, agressifs / 6) * 0.2;
  return monde.acteurs.map((a) => {
    if (a.estJoueur) return a;
    if (a.id === "act.fonceur") {
      return { ...a, ambition: Math.min(1, a.ambition + dose), aversionRisque: Math.max(0, a.aversionRisque - dose) };
    }
    return { ...a, poids: { ...a.poids, coalition: Math.min(1, a.poids.coalition + dose) } };
  });
}

export function pas(monde: Monde, coupJoueur?: CoupJoueur): Monde {
  const rng: Rng = creerRng(monde.graine * 100000 + monde.tick + 1);
  const tick = monde.tick + 1;
  const sortie: Monde = {
    ...monde,
    tick,
    groupes: [],
    decisions: [...monde.decisions],
    evenements: [...monde.evenements],
    tirages: monde.tirages,
  };

  // 1. Chocs exogènes seedés, une fois par groupe.
  const chocs = new Map<string, { eco: number; menace: number }>();
  for (const g of monde.groupes) {
    chocs.set(g.id, { eco: (rng.next() - 0.5) * 0.6, menace: (rng.next() - 0.5) * 0.4 });
    sortie.tirages += 2;
  }

  // 2 et 3. Décisions puis interactions, un acteur après l'autre dans l'ordre du tableau.
  // Les adversaires ont intégré la mémoire de tes coups avant d'arbitrer.
  const acteursAjustes = ajusterAdversaires(monde);
  const etatGroupes = new Map<string, GroupeMonde>(monde.groupes.map((g) => [g.id, { ...g }]));
  for (const acteur of acteursAjustes) {
    const g = etatGroupes.get(acteur.groupeId);
    if (g === undefined) continue;
    let optionId: string;
    if (acteur.estJoueur && coupJoueur !== undefined) {
      optionId = coupJoueur.optionId;
    } else {
      const choix = arbitrer(
        { id: acteur.id, ambition: acteur.ambition, aversionRisque: acteur.aversionRisque, croyances: {} },
        acteur.poids,
        OPTIONS_PROTOTYPE,
        rng,
        sortie.graine,
      );
      sortie.tirages += 1;
      optionId = choix.optionId;
    }
    etatGroupes.set(acteur.groupeId, appliquerActeur(sortie, tick, rng, g, acteur, optionId));
  }

  // 4. Menace, détresse et norme par groupe, puis événements.
  for (const g0 of monde.groupes) {
    const g = etatGroupes.get(g0.id) ?? g0;
    const choc = chocs.get(g0.id) ?? { eco: 0, menace: 0 };
    const men = appliquerMenace({ id: g.id, predispo: 0.55, menace: g.menace, bascule: g.bascule }, choc.menace, rng, sortie.graine);
    const det = appliquerDetresse(
      { id: g.id, satisfactionEco: g.satisfactionEco, perteControle: g.perteControle, receptiviteOrdre: g.receptiviteOrdre },
      choc.eco,
      rng,
      sortie.graine,
    );
    const nor = appliquerMasseCritique({ id: g.id, partMinorite: g.partMinorite, adoption: g.adoption, seuil: 0.25 }, rng, sortie.graine);
    sortie.tirages += 3;

    const suivant: GroupeMonde = {
      ...g,
      menace: men.etat.menace,
      bascule: men.etat.bascule,
      satisfactionEco: det.etat.satisfactionEco,
      perteControle: det.etat.perteControle,
      receptiviteOrdre: det.etat.receptiviteOrdre,
      adoption: nor.etat.adoption,
    };
    sortie.groupes.push(suivant);

    if (suivant.bascule > 0.5 && g0.bascule <= 0.5) {
      journaliser(sortie, { tick, type: "bascule-normative", groupeId: g.id, cause: `menace=${suivant.menace.toFixed(2)}`, valeur: suivant.bascule });
    }
    if (suivant.adoption > 0.5 && g0.adoption <= 0.5) {
      journaliser(sortie, { tick, type: "bascule-norme", groupeId: g.id, cause: `part=${g.partMinorite}`, valeur: suivant.adoption });
    }
    if (suivant.receptiviteOrdre > 0.6 && g0.receptiviteOrdre <= 0.6) {
      journaliser(sortie, { tick, type: "demande-sauveur", groupeId: g.id, cause: `satisfaction=${suivant.satisfactionEco.toFixed(2)}`, valeur: suivant.receptiviteOrdre });
    }
  }

  return sortie;
}

export function simuler(graine: number, pasDeTemps: number, coupsJoueur: CoupJoueur[] = []): Monde {
  let monde = creerMonde(graine);
  for (let i = 0; i < pasDeTemps; i += 1) {
    monde = pas(monde, coupsJoueur[i]);
  }
  return monde;
}
