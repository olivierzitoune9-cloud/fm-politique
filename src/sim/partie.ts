// Orchestrateur V1 : une partie = monde (moteur seedé) + carrière + personnages + calendrier réel.
// Une action principale par semaine, une interaction facultative, puis le monde tourne et les
// adversaires réagissent. Fins multiples évaluées chaque semaine, jamais scriptées.
import { actionParId, type ActionJeu } from "./actions.js";
import { creerMonde, pas, type Monde } from "./engine.js";
import {
  AMBITIONS,
  AVERTISSEMENT_OUVERTURE,
  clamp01b,
  creerCarriere,
  libelleStatut,
  regenererHebdo,
  statutCible,
  STATUTS,
  type Carriere,
  type ConfigCarriere,
} from "./carriere.js";
import { appliquerInteraction, type InteractionId } from "./interactions.js";
import { echeancesAPartirDe, dateISO as dateISODe, libelleSemaine as libelleSemaineDe, tickDeDate } from "./temps.js";
import { filtrerVueJoueur } from "./joueur.js";
import { genererPersonnages, type Personnage } from "./personnages.js";
import { creerRng } from "./rng.js";

export const VERSION_PARTIE = "p1.0.0"; // moteur m0.5.0

export type FinId =
  | "elu"
  | "president"
  | "chef-parti"
  | "proposition-imposee"
  | "marginalise"
  | "brule"
  | "sous-enquete"
  | "echec-echeance"
  | "retour-ordinaire";

export interface Fin {
  id: FinId;
  tick: number;
  titre: string;
  detail: string;
  victoire: boolean;
}

export interface JournalPartie {
  tick: number;
  texte: string;
}

export interface Partie {
  version: string;
  graine: number;
  tick: number;
  monde: Monde;
  carriere: Carriere;
  personnages: Personnage[];
  journal: JournalPartie[];
  fin: Fin | null;
}

export interface TourSemaine {
  actionId: string;
  interaction?: { persoId: string; interactionId: InteractionId; promesse?: string };
}

export function creerPartie(graine: number, config: ConfigCarriere): Partie {
  return {
    version: VERSION_PARTIE,
    graine,
    tick: 0,
    monde: creerMonde(graine),
    carriere: creerCarriere(config, creerRng(graine + 0x5bf03635)),
    personnages: genererPersonnages(creerRng(graine + 0x9e3779b9)),
    journal: [
      { tick: 0, texte: "Semaine 0. Tu regardes le monde depuis ton poste de travail, et le monde ne te regarde pas." },
    ],
    fin: null,
  };
}

function creerFin(id: FinId, tick: number, titre: string, detail: string, victoire: boolean): Fin {
  return { id, tick, titre, detail, victoire };
}

// Application bornée des deltas sur la progression et les ressources.
function appliquerDelta(c: Carriere, champ: keyof Carriere["progression"], delta: number): Carriere {
  const progression = { ...c.progression, [champ]: clamp01b(c.progression[champ] + delta) };
  return { ...c, progression };
}

function appliquerEffets(c: Carriere, e: ActionJeu["effets"], multiplicateur: number): Carriere {
  let s = c;
  if (e.soutiens !== undefined) s = appliquerDelta(s, "soutiens", e.soutiens * multiplicateur);
  if (e.organisation !== undefined) s = appliquerDelta(s, "organisation", e.organisation * multiplicateur);
  if (e.audience !== undefined)
    s = { ...s, ressources: { ...s.ressources, audience: clamp01b(s.ressources.audience + e.audience * multiplicateur) } };
  if (e.militants !== undefined)
    s = { ...s, ressources: { ...s.ressources, militants: clamp01b(s.ressources.militants + e.militants * multiplicateur) } };
  if (e.notoriete !== undefined) s = appliquerDelta(s, "notoriete", e.notoriete * multiplicateur);
  if (e.legitime !== undefined) s = appliquerDelta(s, "legitime", e.legitime * multiplicateur);
  if (e.reputation !== undefined) s = appliquerDelta(s, "reputation", e.reputation);
  if (e.argent !== undefined)
    s = { ...s, ressources: { ...s.ressources, argent: clamp01b(s.ressources.argent + e.argent) } };
  if (e.exposition !== undefined)
    s = { ...s, ressources: { ...s.ressources, audience: clamp01b(s.ressources.audience + e.exposition * 0.3) } };
  if (e.risque !== undefined)
    s = { ...s, risqueEnquete: clamp01b(s.risqueEnquete + e.risque * (1 - s.progression.reputation * 0.3)) };
  return s;
}

function rangStatut(statut: Carriere["statut"]): number {
  return STATUTS.findIndex((s) => s.id === statut);
}

export function evaluerFins(c: Carriere, tick: number): Fin | null {
  const p = c.progression;
  const ambition = AMBITIONS.find((a) => a.id === c.ambition)!;
  const tickLegislativesT1 = tickDeDate(2027, 6, 6);
  const tickLegislativesT2 = tickDeDate(2027, 6, 20);
  const tickPresidentielleT1 = tickDeDate(2027, 4, 11);
  const tickPresidentielleT2 = tickDeDate(2027, 4, 25);

  if (c.risqueEnquete >= 1) {
    return creerFin("sous-enquete", tick, "Sous enquête", "Le cumul des coups risqués a fini par attirer une enquête. La carrière s'arrête dans un dossier.", false);
  }
  if (p.reputation < 0.15) {
    return creerFin("brule", tick, "Brûlé", "Plus personne ne prête foi à ta parole. Sans réputation, une carrière politique est finie.", false);
  }
  if (p.soutiens < 0.06 && p.notoriete < 0.06) {
    if (c.semainesMarginalise >= 7) {
      return creerFin("marginalise", tick, "Marginalisé", "Huit semaines sans soutiens ni notoriété. Le monde a continué sans toi.", false);
    }
  }

  switch (c.ambition) {
    case "elu":
      if (tick === tickLegislativesT1 && p.soutiens >= ambition.seuil) {
        return creerFin("elu", tick, "Élu député", "Tu entres à l'Assemblée en juin 2027. Un banc, un micro, un pouvoir réel.", true);
      }
      if (tick === tickLegislativesT2) {
        return creerFin("echec-echeance", tick, "Battu aux législatives", "Juin 2027 est passé sans siège. La carrière s'arrête ici, ou ailleurs.", false);
      }
      break;
    case "presidentiel":
      if (tick === tickPresidentielleT2 && p.soutiens >= ambition.seuil) {
        return creerFin("president", tick, "Au pouvoir", "Le chemin improbable a abouti. Ce qui suit dépendra de ce que tu en feras.", true);
      }
      if (tick === tickPresidentielleT1 && p.soutiens < 0.1) {
        return creerFin("echec-echeance", tick, "Hors course", "Avril 2027 : trop peu de soutiens pour peser. La partie s'arrête avant le second tour.", false);
      }
      break;
    case "chef-parti":
      if (p.soutiens >= 0.5 && p.legitime >= 0.6 && p.organisation >= 0.5) {
        return creerFin("chef-parti", tick, "À la tête d'un parti", "Ton nom ouvre les listes et ferme les réunions. Le parti est ton instrument.", true);
      }
      if (tick === tickLegislativesT2) {
        return creerFin("echec-echeance", tick, "Resté en coulisses", "Juin 2027 sans la main sur un parti. La fenêtre s'est refermée.", false);
      }
      break;
    case "proposition":
      if (p.notoriete >= 0.65 && p.legitime >= 0.5) {
        return creerFin("proposition-imposee", tick, "Ta proposition est dans le débat", "Ce qui était indicible se discute partout. Personne ne peut plus faire comme si.", true);
      }
      if (tick === tickLegislativesT2) {
        return creerFin("echec-echeance", tick, "Proposition restée marginale", "Fin du cycle 2027 : ton idée n'a pas franchi la fenêtre.", false);
      }
      break;
  }

  if (tick > tickDeDate(2029, 1, 7)) {
    return creerFin("retour-ordinaire", tick, "Retour à la vie ordinaire", "Début 2029, sans objectif atteint ni chute spectaculaire : la vie reprend son cours.", false);
  }
  return null;
}

export function jouerSemaine(partie: Partie, tour: TourSemaine): Partie {
  if (partie.fin !== null) {
    throw new Error(`La partie est terminée (${partie.fin.titre}). Recommence avec une nouvelle partie.`);
  }
  const action = actionParId(tour.actionId);
  const c0 = partie.carriere;
  if (action.coutTemps > c0.ressources.temps + 1e-9) {
    throw new Error(`Pas assez de temps cette semaine pour « ${action.libelle} ».`);
  }
  if (action.coutArgent > c0.ressources.argent + 1e-9) {
    throw new Error(`Pas assez d'argent cette semaine pour « ${action.libelle} ».`);
  }
  const tick = partie.tick + 1;
  const rng = creerRng((partie.graine * 2654435761 + tick) >>> 0);

  // 1. Le monde tourne : ton coup passe dans la boucle, les adversaires arbitrent après.
  const monde = pas(partie.monde, { optionId: action.moteur ?? "preparer-silencieux" });

  // 2. Multiplicateurs : caution savante R14 sur les actions média, micro ciblage IA.
  const cautionVive = partie.personnages.some(
    (p) => p.cautionActive !== null && p.cautionActive.jusqua >= tick && action.categorie === "media",
  );
  const multiplicateurCaution = cautionVive ? 1.6 : 1;
  const multiplicateurMedia = action.categorie === "media" ? 1 + c0.bonusMedia : 1;
  const multiplicateur = Math.min(2.6, multiplicateurCaution * multiplicateurMedia);

  // 3. Effets de l'action, risque amorti par les contacts croisés (atténuateur R1).
  let carriere = appliquerEffets(c0, action.effets, multiplicateur);
  if (action.effets.risque !== undefined && action.regle === "R1") {
    carriere = {
      ...carriere,
      risqueEnquete: clamp01b(carriere.risqueEnquete * (1 - Math.min(0.5, c0.contactsCroises * 0.3))),
    };
  }
  const journal: JournalPartie[] = [{ tick, texte: `${action.libelle} : fait.` }];

  // 4. Interaction humaine facultative.
  let personnages = partie.personnages;
  if (tour.interaction !== undefined) {
    const perso = personnages.find((p) => p.id === tour.interaction!.persoId);
    if (perso === undefined) throw new Error(`Personnage inconnu : ${tour.interaction.persoId}`);
    const r = appliquerInteraction(carriere, perso, tour.interaction.interactionId, tick, rng, partie.graine, tour.interaction.promesse);
    carriere = r.carriere;
    personnages = personnages.map((p) => (p.id === perso.id ? r.perso : p));
    journal.push({ tick, texte: r.resultat.message });
    if (r.resultat.effet !== null) {
      const e = r.resultat.effet;
      if (e.soutiens !== undefined) carriere = appliquerDelta(carriere, "soutiens", e.soutiens);
      if (e.organisation !== undefined) carriere = appliquerDelta(carriere, "organisation", e.organisation);
      if (e.notoriete !== undefined) carriere = appliquerDelta(carriere, "notoriete", e.notoriete);
      if (e.legitime !== undefined) carriere = appliquerDelta(carriere, "legitime", e.legitime);
      if (e.reputation !== undefined) carriere = appliquerDelta(carriere, "reputation", e.reputation);
      if (e.argent !== undefined)
        carriere = { ...carriere, ressources: { ...carriere.ressources, argent: clamp01b(carriere.ressources.argent + e.argent) } };
      if (e.exposition !== undefined)
        carriere = { ...carriere, ressources: { ...carriere.ressources, audience: clamp01b(carriere.ressources.audience + e.exposition * 0.3) } };
      if (e.microCiblage === true) {
        carriere = {
          ...carriere,
          bonusMedia: Math.min(1, carriere.bonusMedia + 0.6),
          risqueEnquete: clamp01b(carriere.risqueEnquete + 0.05),
        };
      }
      if (e.infoPrecise === true) carriere = { ...carriere, infoPrecise: true };
    }
  }

  // 5. Coûts de la semaine puis régénération pour la suivante.
  const coutTemps = action.coutTemps + (tour.interaction !== undefined ? 0.2 : 0);
  carriere = {
    ...carriere,
    ressources: {
      ...carriere.ressources,
      temps: Math.max(0, carriere.ressources.temps - coutTemps),
      argent: Math.max(0, carriere.ressources.argent - action.coutArgent),
    },
  };
  carriere = regenererHebdo(carriere);

  // 6. Progression de statut.
  const cible = statutCible(carriere.progression);
  if (rangStatut(cible) > rangStatut(carriere.statut)) {
    carriere = { ...carriere, statut: cible };
    journal.push({ tick, texte: `Nouveau statut : ${libelleStatut(cible)}.` });
  }

  // 7. Marginalisation comptée puis fins évaluées sur l'état final de la semaine.
  carriere = evaluerMarginalisation(carriere);
  const fin = evaluerFins(carriere, tick);
  if (fin !== null) journal.push({ tick, texte: `Fin de partie : ${fin.titre}. ${fin.detail}` });

  return { ...partie, tick, monde, carriere, personnages, journal: [...partie.journal, ...journal], fin };
}

function evaluerMarginalisation(c: Carriere): Carriere {
  const p = c.progression;
  if (p.soutiens < 0.06 && p.notoriete < 0.06) {
    return { ...c, semainesMarginalise: c.semainesMarginalise + 1 };
  }
  return { ...c, semainesMarginalise: 0 };
}

export interface VuePartie {
  version: string;
  tick: number;
  semaine: number;
  libelleSemaine: string;
  dateISO: string;
  avertissement: string;
  carriere: Carriere;
  personnages: Personnage[];
  groupes: ReturnType<typeof filtrerVueJoueur>["groupes"];
  echeances: ReturnType<typeof echeancesAPartirDe>;
  journal: JournalPartie[];
  fin: Fin | null;
}

export function vuePartie(partie: Partie): VuePartie {
  const semaine = partie.tick + 1;
  return {
    version: partie.version,
    tick: partie.tick,
    semaine,
    libelleSemaine: libelleSemaineDe(semaine),
    dateISO: dateISODe(semaine),
    avertissement: AVERTISSEMENT_OUVERTURE,
    carriere: partie.carriere,
    personnages: partie.personnages,
    groupes: filtrerVueJoueur(partie.monde).groupes,
    echeances: echeancesAPartirDe(semaine).slice(0, 5),
    journal: partie.journal.slice(-30),
    fin: partie.fin,
  };
}
