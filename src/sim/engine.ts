// Boucle moteur FM politique avec IA branchée.
// Ordre fixe : chocs exogènes seedés, décisions IA des acteurs (arbitrage explicite),
// interactions (R1 R3 R4 R5 selon l'option choisie), mise à jour d'état, détection d'événements, écriture mémoire.
// Seed plus version moteur égale même simulation. Pur sans React.
import { creerRng, type Rng } from "./rng.js";
import { arbitrer, OPTIONS_PROTOTYPE } from "./ai/arbitrage.js";
import { appliquerEtiquetage } from "./rules/r1-etiquetage.js";
import { appliquerMenace } from "./rules/r3-menace.js";
import { appliquerDetresse } from "./rules/r4-detresse.js";
import { appliquerMasseCritique } from "./rules/r5-masse-critique.js";
import { appliquerPreparation } from "./rules/r22-preparation.js";

export const VERSION_MOTEUR = "m0.2.0";

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

export function creerMonde(graine: number): Monde {
  return {
    version: VERSION_MOTEUR,
    graine,
    tick: 0,
    groupes: [
      {
        id: "grp.centre",
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
      },
      {
        id: "grp.peripherie",
        identiteActive: 0.25,
        menace: 0.5,
        bascule: 0.12,
        satisfactionEco: 0.45,
        perteControle: 0.55,
        receptiviteOrdre: 0.3,
        partMinorite: 0.28,
        adoption: 0.08,
        exposition: 0.8,
        ressourcesActeur: 0.2,
      },
    ],
    acteurs: [
      {
        id: "act.prudent",
        groupeId: "grp.centre",
        ambition: 0.4,
        aversionRisque: 0.8,
        poids: { popularite: 0.4, coalition: 0.9, base: 0.4, institution: 0.6, ressources: 0.6, risque: 1 },
        credibilite: 0.65,
        reputation: 0.6,
      },
      {
        id: "act.fonceur",
        groupeId: "grp.peripherie",
        ambition: 0.85,
        aversionRisque: 0.2,
        poids: { popularite: 1, coalition: 0.3, base: 0.9, institution: 0.3, ressources: 0.5, risque: 0.2 },
        credibilite: 0.55,
        reputation: 0.55,
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

// Mapping option IA vers paramètres de règles. Explicite et borné.
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

export function pas(monde: Monde): Monde {
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

  for (const g of monde.groupes) {
    const acteur = monde.acteurs.find((a) => a.groupeId === g.id) ?? monde.acteurs[0];

    // 1. Choc exogène seedé.
    const chocEco = (rng.next() - 0.5) * 0.6;
    const chocMenace = (rng.next() - 0.5) * 0.4;
    sortie.tirages += 2;

    // 2. Décision IA de l'acteur : arbitrage explicite et journalisé.
    const choix = arbitrer(
      { id: acteur.id, ambition: acteur.ambition, aversionRisque: acteur.aversionRisque, croyances: {} },
      acteur.poids,
      OPTIONS_PROTOTYPE,
      rng,
      sortie.graine,
    );
    sortie.tirages += 1;
    sortie.decisions.push({ tick, acteurId: acteur.id, groupeId: g.id, optionId: choix.optionId });

    // 3. Interactions selon l'option choisie.
    const p = paramsEtiquetage(choix.optionId);
    let identite = g.identiteActive;
    if (p.actif) {
      const etiq = appliquerEtiquetage(
        {
          id: g.id,
          identiteActive: g.identiteActive,
          menacePercue: g.menace,
          exposition: g.exposition,
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

    let ressources = g.ressourcesActeur;
    if (choix.optionId === "preparer-silencieux") {
      const prep = appliquerPreparation({ id: acteur.id, ressources, visibilite: 0.2 }, 0.7, rng, sortie.graine);
      ressources = prep.etat.ressources;
      sortie.tirages += 1;
    }

    const men = appliquerMenace({ id: g.id, predispo: 0.55, menace: g.menace, bascule: g.bascule }, chocMenace, rng, sortie.graine);
    const det = appliquerDetresse(
      { id: g.id, satisfactionEco: g.satisfactionEco, perteControle: g.perteControle, receptiviteOrdre: g.receptiviteOrdre },
      chocEco,
      rng,
      sortie.graine,
    );
    const nor = appliquerMasseCritique({ id: g.id, partMinorite: g.partMinorite, adoption: g.adoption, seuil: 0.25 }, rng, sortie.graine);
    sortie.tirages += 3;

    const suivant: GroupeMonde = {
      id: g.id,
      identiteActive: identite,
      menace: men.etat.menace,
      bascule: men.etat.bascule,
      satisfactionEco: det.etat.satisfactionEco,
      perteControle: det.etat.perteControle,
      receptiviteOrdre: det.etat.receptiviteOrdre,
      partMinorite: g.partMinorite,
      adoption: nor.etat.adoption,
      exposition: g.exposition,
      ressourcesActeur: ressources,
    };
    sortie.groupes.push(suivant);

    // 4. Événements émergents avec cause incluant le choix IA.
    if (suivant.bascule > 0.5 && g.bascule <= 0.5) {
      journaliser(sortie, { tick, type: "bascule-normative", groupeId: g.id, cause: `${choix.optionId} menace=${suivant.menace.toFixed(2)}`, valeur: suivant.bascule });
    }
    if (suivant.adoption > 0.5 && g.adoption <= 0.5) {
      journaliser(sortie, { tick, type: "bascule-norme", groupeId: g.id, cause: `${choix.optionId} part=${g.partMinorite}`, valeur: suivant.adoption });
    }
    if (suivant.receptiviteOrdre > 0.6 && g.receptiviteOrdre <= 0.6) {
      journaliser(sortie, { tick, type: "demande-sauveur", groupeId: g.id, cause: `${choix.optionId} satisfaction=${suivant.satisfactionEco.toFixed(2)}`, valeur: suivant.receptiviteOrdre });
    }
  }

  return sortie;
}

export function simuler(graine: number, pasDeTemps: number): Monde {
  let monde = creerMonde(graine);
  for (let i = 0; i < pasDeTemps; i += 1) {
    monde = pas(monde);
  }
  return monde;
}
