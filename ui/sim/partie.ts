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
  persuasionJoueur,
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
import { ajusterEconomie, chomagePourTick } from "./data/economie.js";
import { MEDIAS, mediaParId, routerMedia, type Media } from "./medias.js";
import { creerProposition, dicibiliteMoyenne, pousserProposition, type Proposition } from "./propositions.js";
import {
  manoeuvresPartis,
  majPartis,
  relationsInitialesPartis,
  type ManoeuvreParti,
} from "./partis.js";

export const VERSION_PARTIE = "p2.0.0"; // moteur m0.4.0, partie V2 monde qui vit

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
  proposition: Proposition;
  relationsPartis: Record<string, number>;
  journal: JournalPartie[];
  fin: Fin | null;
}

export interface TourSemaine {
  actionId: string;
  mediaId?: string; // routage des actions média, défaut le quotidien régional
  pousserProposition?: boolean; // R9 : pousser ta proposition en même temps
  interaction?: { persoId: string; interactionId: InteractionId; promesse?: string };
}

export function creerPartie(graine: number, config: ConfigCarriere): Partie {
  const monde = creerMonde(graine);
  return {
    version: VERSION_PARTIE,
    graine,
    tick: 0,
    monde,
    carriere: creerCarriere(config, creerRng(graine + 0x5bf03635)),
    personnages: genererPersonnages(creerRng(graine + 0x9e3779b9)),
    proposition: creerProposition(
      config.propositionTexte && config.propositionTexte.trim().length > 0
        ? config.propositionTexte.trim()
        : "organiser la démocratie locale : tirage au sort d'un conseil citoyen",
      "joueur",
      monde.groupes.map((g) => g.id),
    ),
    relationsPartis: relationsInitialesPartis(),
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

export function evaluerFins(c: Carriere, tick: number, dicibilite: number | null = null): Fin | null {
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
      if ((dicibilite ?? p.notoriete) >= ambition.seuil && p.legitime >= 0.5) {
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

  // 1. Le monde tourne : économie mensuelle branchée (R4), ton coup passe dans la boucle.
  const monde = pas(ajusterEconomie(partie.monde, tick), { optionId: action.moteur ?? "preparer-silencieux" });

  // 2. Multiplicateurs : caution savante R14, micro ciblage IA, routage média avec fact checking.
  const cautionVive = partie.personnages.some(
    (p) => p.cautionActive !== null && p.cautionActive.jusqua >= tick && action.categorie === "media",
  );
  const multiplicateurCaution = cautionVive ? 1.6 : 1;
  const multiplicateurMedia = action.categorie === "media" ? 1 + c0.bonusMedia : 1;
  let multiplicateur = Math.min(2.6, multiplicateurCaution * multiplicateurMedia);
  const journal: JournalPartie[] = [{ tick, texte: `${action.libelle} : fait.` }];
  let risqueFactCheck = 0;
  if (action.categorie === "media") {
    const media = mediaParId(tour.mediaId ?? "med.quotidien-regional");
    const routage = routerMedia(media, "media", c0.bonusMedia, partie.proposition.statutPreuve);
    multiplicateur = Math.min(2.6, multiplicateur * routage.multiplicateur);
    risqueFactCheck = routage.risqueFactCheck;
    journal.push({ tick, texte: `Passage par ${routage.detail}.` });
  }

  // 3. Effets de l'action, risque amorti par les contacts croisés (atténuateur R1).
  let carriere = appliquerEffets(c0, action.effets, multiplicateur);
  if (action.effets.risque !== undefined && action.regle === "R1") {
    carriere = {
      ...carriere,
      risqueEnquete: clamp01b(carriere.risqueEnquete * (1 - Math.min(0.5, c0.contactsCroises * 0.3))),
    };
  }

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

  // 4bis. Proposition poussée (R9) et fact checking des médias.
  let proposition = partie.proposition;
  const veutPousser = tour.pousserProposition === true || action.regle === "R9";
  if (veutPousser) {
    const force = persuasionJoueur(carriere) * 0.5 + carriere.progression.notoriete * 0.5;
    const deni = carriere.progression.reputation * 0.6 + 0.2;
    let deltas: string[] = [];
    for (const g of partie.monde.groupes) {
      const p = pousserProposition(proposition, g.id, force, deni, rng, partie.graine);
      proposition = p.proposition;
      deltas.push(`${g.id} ${p.delta >= 0 ? "+" : ""}${p.delta.toFixed(3)}`);
    }
    journal.push({ tick, texte: `Proposition « ${proposition.texte} » poussée (${deltas.join(", ")}).` });
  }
  if (risqueFactCheck > 0) {
    carriere = { ...carriere, risqueEnquete: clamp01b(carriere.risqueEnquete + risqueFactCheck * 0.3) };
    if (risqueFactCheck > 0.4) {
      carriere = appliquerDelta(carriere, "reputation", -risqueFactCheck * 0.1);
      journal.push({ tick, texte: "Vérification de faits : ton propos a été repris et corrigé." });
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

  // 7. Partis : manoeuvres lues dans le moteur, relations évolutives (trahisons des leaders comprises).
  const trahisonsLeaders = personnages
    .filter((p) => p.metier === "leader-parti")
    .reduce((s, p) => s + p.memoire.filter((m) => m.type === "trahison").length, 0);
  const relationsPartis = majPartis(partie.relationsPartis, action.moteur, trahisonsLeaders);
  for (const m of manoeuvresPartis(monde, personnages, true)) {
    journal.push({ tick, texte: m.texte });
  }

  // 8. Marginalisation comptée puis fins évaluées sur l'état final de la semaine.
  carriere = evaluerMarginalisation(carriere);
  const fin = evaluerFins(carriere, tick, dicibiliteMoyenne(proposition));
  if (fin !== null) journal.push({ tick, texte: `Fin de partie : ${fin.titre}. ${fin.detail}` });

  return {
    ...partie,
    tick,
    monde,
    carriere,
    personnages,
    proposition,
    relationsPartis,
    journal: [...partie.journal, ...journal],
    fin,
  };
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
  medias: Media[];
  proposition: Proposition;
  manoeuvres: ManoeuvreParti[];
  relationsPartis: Record<string, number>;
  chomage: number;
  sourceChomage: string;
}

export function vuePartie(partie: Partie): VuePartie {
  const semaine = partie.tick + 1;
  const eco = chomagePourTick(semaine);
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
    medias: MEDIAS,
    proposition: partie.proposition,
    manoeuvres: manoeuvresPartis(partie.monde, partie.personnages, true),
    relationsPartis: partie.relationsPartis,
    chomage: eco.chomage,
    sourceChomage: eco.source,
  };
}
