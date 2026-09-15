// Boucle minimale du moteur FM politique.
// Ordre fixe : chocs exogènes seedés, décisions des acteurs (R1 R9 via exposition),
// interactions (R3 R4 R5), mise à jour d'état, détection d'événements, écriture mémoire.
// Seed plus version moteur égale même simulation. Pur sans React.
import { clamp01, creerRng, type Rng } from "./rng.js";
import { appliquerEtiquetage } from "./rules/r1-etiquetage.js";
import { appliquerMenace } from "./rules/r3-menace.js";
import { appliquerDetresse } from "./rules/r4-detresse.js";
import { appliquerMasseCritique } from "./rules/r5-masse-critique.js";

export const VERSION_MOTEUR = "m0.1.0";

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
      },
    ],
    evenements: [],
    tirages: 0,
  };
}

function journaliser(monde: Monde, e: EvenementCausal): void {
  monde.evenements.push(e);
}

export function pas(monde: Monde): Monde {
  const rng: Rng = creerRng(monde.graine * 100000 + monde.tick + 1);
  const tick = monde.tick + 1;
  const sortie: Monde = { ...monde, tick, groupes: [], evenements: [...monde.evenements], tirages: monde.tirages };

  for (const g of monde.groupes) {
    // 1. Choc exogène seedé : secousse éco et menace, bornées.
    const chocEco = (rng.next() - 0.5) * 0.6;
    const chocMenace = (rng.next() - 0.5) * 0.4;
    sortie.tirages += 2;

    // 2. Décision d'un acteur abstrait : étiquetage modéré et constant au prototype.
    const etiq = appliquerEtiquetage(
      {
        id: g.id,
        identiteActive: g.identiteActive,
        menacePercue: g.menace,
        exposition: g.exposition,
        contactsCroises: 0.3,
        interetsPartages: 0.3,
      },
      { id: "act.abstrait", credibilite: 0.6, reputation: 0.6 },
      { grossierete: 0.25, repetition: 0.5, marqueForce: 0.4 },
      rng,
      sortie.graine,
    );

    // 3. Interactions : menace, détresse, masse critique, en ordre fixe.
    const men = appliquerMenace(
      { id: g.id, predispo: 0.55, menace: g.menace, bascule: g.bascule },
      chocMenace,
      rng,
      sortie.graine,
    );
    const det = appliquerDetresse(
      { id: g.id, satisfactionEco: g.satisfactionEco, perteControle: g.perteControle, receptiviteOrdre: g.receptiviteOrdre },
      chocEco,
      rng,
      sortie.graine,
    );
    const nor = appliquerMasseCritique(
      { id: g.id, partMinorite: g.partMinorite, adoption: g.adoption, seuil: 0.25 },
      rng,
      sortie.graine,
    );
    sortie.tirages += 4;

    const suivant: GroupeMonde = {
      id: g.id,
      identiteActive: etiq.groupe.identiteActive,
      menace: men.etat.menace,
      bascule: men.etat.bascule,
      satisfactionEco: det.etat.satisfactionEco,
      perteControle: det.etat.perteControle,
      receptiviteOrdre: det.etat.receptiviteOrdre,
      partMinorite: g.partMinorite,
      adoption: nor.etat.adoption,
      exposition: g.exposition,
    };
    sortie.groupes.push(suivant);

    // 4. Détection d'événements émergents, jamais scénarisés : seuils franchis avec cause.
    if (suivant.bascule > 0.5 && g.bascule <= 0.5) {
      journaliser(sortie, { tick, type: "bascule-normative", groupeId: g.id, cause: `menace=${suivant.menace.toFixed(2)} choc=${chocMenace.toFixed(2)}`, valeur: suivant.bascule });
    }
    if (suivant.adoption > 0.5 && g.adoption <= 0.5) {
      journaliser(sortie, { tick, type: "bascule-norme", groupeId: g.id, cause: `partMinorite=${g.partMinorite}`, valeur: suivant.adoption });
    }
    if (suivant.receptiviteOrdre > 0.6 && g.receptiviteOrdre <= 0.6) {
      journaliser(sortie, { tick, type: "demande-sauveur", groupeId: g.id, cause: `satisfaction=${suivant.satisfactionEco.toFixed(2)} choc=${chocEco.toFixed(2)}`, valeur: suivant.receptiviteOrdre });
    }
  }

  void clamp01;
  return sortie;
}

export function simuler(graine: number, pasDeTemps: number): Monde {
  let monde = creerMonde(graine);
  for (let i = 0; i < pasDeTemps; i += 1) {
    monde = pas(monde);
  }
  return monde;
}
