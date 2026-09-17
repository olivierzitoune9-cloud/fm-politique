// Orchestrateur V1 : une partie = monde (moteur seedé) + carrière + personnages + calendrier réel.
// Une action principale par semaine, une interaction facultative, puis le monde tourne et les
// adversaires réagissent. Fins multiples évaluées chaque semaine, jamais scriptées.
import { actionParId, type ActionJeu } from "./actions.js";
import { creerMonde, pas, type Monde } from "./engine.js";
import {
  ACTIVITES_SEMAINE,
  AMBITIONS,
  AVERTISSEMENT_OUVERTURE,
  clamp01b,
  coutPalier,
  corruptionExpansion,
  avancerEffetsDurees,
  surcoutEffetsDurees,
  efficaciteSemaine,
  appliquerFatigue,
  gagnerCompetence,
  competenceDeCategorie,
  activiteParId,
  appliquerActivite,
  type ActiviteSemaine,
  creerCarriere,
  libelleStatut,
  palierDeStatut,
  persuasionJoueur,
  regenererHebdo,
  statutCible,
  STATUTS,
  type Carriere,
  type ConfigCarriere,
} from "./carriere.js";
import { appliquerInteraction, interactionParId, type InteractionId } from "./interactions.js";
import { dateISO as dateISODe, libelleSemaine as libelleSemaineDe, LIBELLES_SAISON, saisonDuTick, tickDeDate } from "./temps.js";
import { filtrerVueJoueur } from "./joueur.js";
import { genererPersonnages, nomComplet, poidsTraits, type Personnage } from "./personnages.js";
import { creerRng } from "./rng.js";
import { ajusterEconomie, chomagePourTick } from "./data/economie.js";
import { MEDIAS, mediaParId, routerMedia, type Media } from "./medias.js";
import { creerProposition, dicibiliteMoyenne, pousserProposition, type Proposition } from "./propositions.js";
import {
  adoptionMoyenne,
  matchingMarqueEnjeu,
  propagerTerritoires,
  sondageParId,
  territoiresInitiaux,
  type Territoire,
} from "./courrier.js";
import {
  manoeuvresPartis,
  majPartis,
  relationsInitialesPartis,
  frappeAdverse,
  type ManoeuvreParti,
} from "./partis.js";
import { genererDilemmes, resoudreDilemme, promesseDepuisDilemme, type Dilemme } from "./dilemmes.js";
import { echeancesAPartirDe } from "./temps.js";
import {
  carteVisible,
  creerMondeSocial,
  enregistrerEvenement,
  idOrganisation,
  noeudsVisiblesDuPalier,
  NOEUD_JOUEUR,
  type MondeSocial,
  type VueMondeSocial,
} from "./monde-social.js";
import { avancerMissions, type Mission } from "./missions.js";
import { tenirReunion, coutReunion, type OrdreReunion, type CompteRenduReunion } from "./reunions.js";
import { avancerInitiatives } from "./initiatives.js";
import type { DossierRef } from "./enquete.js";

export const VERSION_PARTIE = "p3.4.0"; // P3 : réunions, initiatives et missions persistantes

export type FinId =
  | "elu"
  | "president"
  | "chef-parti"
  | "proposition-imposee"
  | "marginalise"
  | "brule"
  | "sous-enquete"
  | "echec-echeance"
  | "investiture-ratee"
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
  territoires: Territoire[]; // J3 : carte d'adoption, douze territoires types
  mondeSocial: MondeSocial; // P1 : le graphe du monde, avec la mémoire datée de chaque nœud
  missions: Mission[];
  reunions: CompteRenduReunion[];
  dossiers: DossierRef[]; // P2 : les dossiers d'enquête ouverts, rechargés avec la partie
  dilemmesPasses: string[]; // J16 : ids des dilemmes déjà sortis, un par partie au plus
  dilemmeOuvert: Dilemme | null; // le carrefour en attente de choix, bloquant pour la semaine
  journal: JournalPartie[];
  fin: Fin | null;
}

export interface CoupSemaine {
  actionId: string;
  mediaId?: string;
  pousserProposition?: boolean;
}

export interface TourSemaine {
  reunions?: OrdreReunion[];
  actionId: string; // conservé : premier coup, compatibilité p3.0.0
  actions?: CoupSemaine[]; // C1 : la semaine multi coups, dans l'ordre choisi
  activiteId?: string; // J15 F1 : la seconde étage de la semaine, activité de fond
  mediaId?: string; // routage des actions média, défaut le quotidien régional
  pousserProposition?: boolean; // R9 : pousser ta proposition en même temps
  sondageId?: string; // J4 : sondage commandé, débité chaque semaine
  interaction?: { persoId: string; interactionId: InteractionId; promesse?: string; categorieAttendue?: "terrain" | "media" | "coalition" | "institution" | "preparation" };
  choixDilemme?: { dilemmeId: string; optionId: string }; // F4 : carrefour à trancher
}

export function creerPartie(graine: number, config: ConfigCarriere): Partie {
  const monde = creerMonde(graine);
  const personnages = genererPersonnages(creerRng(graine + 0x9e3779b9));
  return {
    version: VERSION_PARTIE,
    graine,
    tick: 0,
    monde,
    carriere: creerCarriere(config, creerRng(graine + 0x5bf03635)),
    personnages,
    mondeSocial: creerMondeSocial(personnages, monde, graine, config.nom),
    dossiers: [],
    reunions: [],
    missions: [],
    proposition: creerProposition(
      config.propositionTexte && config.propositionTexte.trim().length > 0
        ? config.propositionTexte.trim()
        : "organiser la démocratie locale : tirage au sort d'un conseil citoyen",
      "joueur",
      monde.groupes.map((g) => g.id),
    ),
    relationsPartis: relationsInitialesPartis(),
    territoires: territoiresInitiaux(graine),
    dilemmesPasses: [],
    dilemmeOuvert: null,
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
      // F9 (J17) : les choix anciens conditionnent l'option tardive. Sans investiture, pas de banc.
      if (tick === tickLegislativesT1 && c.investiture === "obtenue" && p.soutiens >= ambition.seuil) {
        return creerFin("elu", tick, "Élu député", "Tu entres à l'Assemblée en juin 2027. Un banc, un micro, un pouvoir réel.", true);
      }
      if (tick === tickLegislativesT1 && c.investiture === "ratee") {
        return creerFin("investiture-ratee", tick, "Non investi", "Ton propre camp a arbitré entre toi et un autre nom en mai 2027. Sans investiture, pas de banc en juin.", false);
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
    case "maire":
      if (tick === tickDeDate(2032, 3, 14) && p.soutiens >= ambition.seuil && p.legitime >= 0.4) {
        return creerFin("elu", tick, "Élu maire", "Mars 2032 : ta ville t'a confié les clés. Le long chemin local a payé.", true);
      }
      if (tick === tickDeDate(2032, 3, 14)) {
        return creerFin("echec-echeance", tick, "Battu aux municipales", "Mars 2032 sans mairie. L'ancrage n'a pas suffi.", false);
      }
      break;
    case "europeen":
      if (tick === tickDeDate(2029, 6, 10) && p.soutiens >= ambition.seuil) {
        return creerFin("elu", tick, "Élu au Parlement européen", "Juin 2029 : ta liste siège. Le discours porte au delà du clocher.", true);
      }
      if (tick === tickDeDate(2029, 6, 10)) {
        return creerFin("echec-echeance", tick, "Manqué les européennes", "Juin 2029 sans siège. La liste n'a pas pris.", false);
      }
      break;
  }

  if (tick >= tickDeDate(2032, 4, 2)) {
    // >= et non > : tickDeDate arrondit à la semaine, le 1er et le 2 avril 2032 partagent
    // le même tick, et la fin doit bien s'ouvrir dès ce printemps 2032.
    return creerFin("retour-ordinaire", tick, "Retour à la vie ordinaire", "Printemps 2032, sans objectif atteint ni chute spectaculaire : la vie reprend son cours.", false);
  }
  return null;
}

export function listeCoupsSemaine(tour: TourSemaine): CoupSemaine[] {
  // C1 : la semaine multi coups. Ancien format (actionId seul) = un seul coup, comportement p3.0.0 conservé.
  // Aucun plafond de coups dans le moteur : la limite du monde est le temps et l'argent, jamais un nombre.
  // Le garde anti-spam reste un choix d'écran (MAX_COUPS_ECRAN dans ui/app/partie/page.tsx).
  if (tour.actions !== undefined && tour.actions.length > 0) return tour.actions;
  return [{ actionId: tour.actionId, mediaId: tour.mediaId, pousserProposition: tour.pousserProposition }];
}

// C2 : le risque affiché avant le clic. Même calcul que l'application à efficacité 1,
// sans le bruit du monde. Fonction pure, testée contre jouerSemaine.
export interface RisqueAffiche {
  risqueEnquete: number; // 0..1 ajouté au risque d'enquête
  exposition: number; // 0..1 d'audience gagnée par surexposition
  reputation: number; // delta négatif possible sur la réputation
  force: boolean; // vrai si le coup dépasse le temps ou l'argent disponibles
  detail: string; // phrase lisible pour la liste des coups
}

export function risqueAction(
  actionId: string,
  tempsDisponible: number,
  argentDisponible: number,
  palier: number,
): RisqueAffiche {
  const action = actionParId(actionId);
  const cout = coutPalier(palier);
  const coutTemps = action.coutTemps * cout.temps;
  const coutArgent = action.coutArgent * cout.argent;
  const force = coutTemps > tempsDisponible + 1e-9 || coutArgent > argentDisponible + 1e-9;
  let risqueEnquete = (action.effets.risque ?? 0) * 0.7; // à efficacité 1, sans amorti réputation
  let reputation = action.effets.reputation ?? 0;
  if (force) {
    if (coutArgent > argentDisponible + 1e-9) {
      risqueEnquete += 0.06;
      reputation += -0.03;
    }
    if (coutTemps > tempsDisponible + 1e-9) {
      risqueEnquete += 0.03;
      reputation += -0.02;
    }
  }
  const exposition = (action.effets.exposition ?? 0) * 0.3;
  const morceaux: string[] = [];
  if (risqueEnquete > 0.005) morceaux.push(`risque +${(risqueEnquete * 100).toFixed(0)}`);
  if (exposition > 0.005) morceaux.push(`exposition +${(exposition * 100).toFixed(0)}`);
  if (reputation < -0.005) morceaux.push(`réputation ${(reputation * 100).toFixed(0)}`);
  if (force) morceaux.push("coup forcé : dette et fatigue");
  return {
    risqueEnquete: Math.max(0, risqueEnquete),
    exposition: Math.max(0, exposition),
    reputation: Math.min(0, reputation),
    force,
    detail: morceaux.length > 0 ? morceaux.join(", ") : "coup propre",
  };
}

// C4 : l'agenda comme file. Total temps et argent de la semaine avant validation. Fonction pure.
export interface TotalSemaine {
  temps: number;
  argent: number;
  coups: number;
}

export function totalSemaine(tour: TourSemaine, palier: number): TotalSemaine {
  const coups = listeCoupsSemaine(tour);
  const cout = coutPalier(palier);
  let temps = 0;
  let argent = 0;
  for (const c of coups) {
    const a = actionParId(c.actionId);
    temps += a.coutTemps * cout.temps;
    argent += a.coutArgent * cout.argent;
  }
  if (tour.sondageId !== undefined) {
    try {
      const s = sondageParId(tour.sondageId);
      temps += s.coutTemps;
      argent += s.coutArgent;
    } catch {
      // sondage illisible : la semaine l'écrira, le total ne bloque pas
    }
  }
  if (tour.interaction !== undefined) {
    try {
      const def = interactionParId(tour.interaction.interactionId);
      temps += def.coutTemps;
    } catch {
      // interaction inconnue : la semaine lèvera, le total ne bloque pas
    }
  }
  for (const ordre of tour.reunions ?? []) {
    const cout = coutReunion(ordre);
    temps += cout.temps;
    argent += cout.argent;
  }
  return { temps, argent, coups: coups.length };
}

export function jouerSemaine(partie: Partie, tour: TourSemaine): Partie {
  if (partie.fin !== null) {
    throw new Error(`La partie est terminée (${partie.fin.titre}). Recommence avec une nouvelle partie.`);
  }
  const coups = listeCoupsSemaine(tour);
  const action = actionParId(coups[0].actionId); // premier coup, pour le monde et le journal
  const c0 = partie.carriere;
  const tick = partie.tick + 1;
  const rng = creerRng((partie.graine * 2654435761 + tick) >>> 0);

  // 1. Le monde tourne : économie mensuelle branchée (R4), ton premier coup passe dans la boucle.
  // J4 : le sondage commandé est débité chaque semaine, même gratuit au bar en temps passé à écouter.
  let carriereSondee = c0;
  const journal: JournalPartie[] = [{ tick, texte: `${action.libelle} : fait.` }];
  if (tour.sondageId !== undefined) {
    try {
      const s = sondageParId(tour.sondageId);
      carriereSondee = {
        ...carriereSondee,
        ressources: {
          ...carriereSondee.ressources,
          temps: Math.max(0, carriereSondee.ressources.temps - s.coutTemps),
          argent: Math.max(0, carriereSondee.ressources.argent - s.coutArgent),
        },
      };
      journal.push({ tick, texte: `${s.libelle} commandé : ${s.precision}.` });
    } catch {
      journal.push({ tick, texte: "Sondage illisible : tu avances à l'aveugle cette semaine." });
    }
  }
  const monde = pas(ajusterEconomie(partie.monde, tick), { optionId: action.moteur ?? "preparer-silencieux" });

  // 2. Multi coups (C1, C5) : chaque coup se résout dans l'ordre choisi, la fatigue
  // et l'efficacité se mettent à jour entre deux coups. Le 3e coup d'une semaine
  // chargée paie moins que le 1er. Coûts croissants par palier (E4).
  const coutPalierActuel = coutPalier(palierDeStatut(c0.statut));
  const surcoutDurees = surcoutEffetsDurees(c0);
  let carriere = carriereSondee;
  let coupsForces = 0;
  coups.forEach((coup, index) => {
    const a = actionParId(coup.actionId);
    const coutTempsCoup = a.coutTemps * coutPalierActuel.temps + (index === 0 ? surcoutDurees : 0);
    const manqueArgent = a.coutArgent * coutPalierActuel.argent > carriere.ressources.argent + 1e-9;
    const manqueTemps = coutTempsCoup > carriere.ressources.temps + 1e-9;
    const coupForce = manqueTemps || manqueArgent;
    if (coupForce) coupsForces += 1;
    const competenceJouee = carriere.competences[competenceDeCategorie(a.categorie)] ?? 0;
    const cautionVive = partie.personnages.some(
      (p) => p.cautionActive !== null && p.cautionActive.jusqua >= tick && a.categorie === "media",
    );
    const multiplicateurCaution = cautionVive ? 1.6 : 1;
    const multiplicateurMedia = a.categorie === "media" ? 1 + carriere.bonusMedia : 1;
    const multiplicateurCompetence = 1 + 0.25 * competenceJouee; // J15 F3 : la répétition paie
    let multiplicateur = Math.min(
      3.2,
      multiplicateurCaution * multiplicateurMedia * multiplicateurCompetence * efficaciteSemaine(carriere),
    );
    if (coupForce) {
      journal.push({
        tick,
        texte: manqueArgent && manqueTemps
          ? `Tu as forcé « ${a.libelle} » sans temps ni argent : dette, fatigue et réputation entamée.`
          : manqueArgent
            ? `Tu as forcé « ${a.libelle} » sans argent : tu t'endettes et ta réputation s'entame.`
            : `Tu as forcé « ${a.libelle} » sans temps : semaine bâclée, soutiens et réputation en berne.`,
      });
    }
    let risqueFactCheck = 0;
    if (a.categorie === "media") {
      const media = mediaParId(coup.mediaId ?? tour.mediaId ?? "med.quotidien-regional");
      const routage = routerMedia(media, "media", carriere.bonusMedia, partie.proposition.statutPreuve);
      multiplicateur = Math.min(2.6, multiplicateur * routage.multiplicateur);
      risqueFactCheck = routage.risqueFactCheck;
      journal.push({ tick, texte: `Passage par ${routage.detail}.` });
    }

    // 3. Effets du coup, risque amorti par les contacts croisés (atténuateur R1).
    // R7 J8 : le coup forcé paie en dette d'argent, risque d'enquête et réputation entamée.
    carriere = appliquerEffets(carriere, a.effets, multiplicateur * (coupForce ? 0.5 : 1));
    if (coupForce) {
      if (manqueArgent) {
        carriere = {
          ...carriere,
          ressources: { ...carriere.ressources, argent: clamp01b(carriere.ressources.argent - 0.08) },
          risqueEnquete: clamp01b(carriere.risqueEnquete + 0.06),
        };
        carriere = appliquerDelta(carriere, "reputation", -0.03);
      }
      if (manqueTemps) {
        carriere = appliquerDelta(carriere, "soutiens", -0.02);
        carriere = appliquerDelta(carriere, "reputation", -0.02);
        carriere = { ...carriere, risqueEnquete: clamp01b(carriere.risqueEnquete + 0.03) };
      }
    }
    if (a.effets.risque !== undefined && a.regle === "R1") {
      carriere = {
        ...carriere,
        risqueEnquete: clamp01b(carriere.risqueEnquete * (1 - Math.min(0.5, c0.contactsCroises * 0.3))),
      };
    }
    // J15 F3 : la répétition construit la compétence, quel que soit le résultat du coup.
    carriere = gagnerCompetence(carriere, competenceDeCategorie(a.categorie));
    // J15 F2 + C5 : le coup fatigue, et la fatigue pèse le coup suivant de la même semaine.
    carriere = appliquerFatigue(carriere, coutTempsCoup, coupForce);
    // Compatibilité p3.0.0 : pousserProposition au niveau du tour = poussée du premier coup.
    const pousserPremier = tour.pousserProposition === true && coups.length > 0 && coups[0].pousserProposition !== true;
    // Proposition poussée avec ce coup (R9), fact checking des médias.
    if (coup.pousserProposition === true || a.regle === "R9" || (pousserPremier && index === 0)) {
      const force = persuasionJoueur(carriere) * 0.5 + carriere.progression.notoriete * 0.5;
      const deni = carriere.progression.reputation * 0.6 + 0.2;
      for (const g of partie.monde.groupes) {
        const poussee = pousserProposition(partie.proposition, g.id, force, deni, rng, partie.graine);
        partie.proposition = poussee.proposition;
      }
    }
    if (index === 0) {
      journal.unshift({ tick, texte: `${a.libelle} : fait.` });
    } else {
      journal.push({ tick, texte: `${a.libelle} : fait aussi (coup ${index + 1} de la semaine).` });
    }
    void risqueFactCheck;
    void coupsForces;
  });
  // E5 (J13) : croître en soutiens sans croître en organisation convertit la dette en risque.
  const corruption = corruptionExpansion(carriere.progression);
  if (corruption > 0) {
    carriere = { ...carriere, risqueEnquete: clamp01b(carriere.risqueEnquete + corruption) };
    journal.push({
      tick,
      texte: "Ta croissance dépasse ton organisation : trop de soutiens, trop peu de relais. Des questions commencent à circuler.",
    });
  }

  // 4. Interaction humaine facultative. Traits pondérés (J16 F5), connaissance qui monte (J17 F7),
  // promesse à échéance enregistrée (E10), dons nommés tracés (E7).
  let messageInteraction: string | null = null; // P1 : entre en mémoire du graphe social
  let personnages = partie.personnages;
  if (tour.interaction !== undefined) {
    const perso = personnages.find((p) => p.id === tour.interaction!.persoId);
    if (perso === undefined) throw new Error(`Personnage inconnu : ${tour.interaction.persoId}`);
    const r = appliquerInteraction(
      carriere,
      perso,
      tour.interaction.interactionId,
      tick,
      rng,
      partie.graine,
      tour.interaction.promesse,
      tour.interaction.categorieAttendue,
    );
    carriere = r.carriere;
    if (r.resultat.promesse !== undefined) {
      carriere = { ...carriere, promesses: [...carriere.promesses, r.resultat.promesse] };
    }
    personnages = personnages.map((p) => (p.id === perso.id ? r.perso : p));
    journal.push({ tick, texte: r.resultat.message });
    messageInteraction = r.resultat.message;
    if (r.resultat.effet !== null) {
      const e = r.resultat.effet;
      if (e.soutiens !== undefined) carriere = appliquerDelta(carriere, "soutiens", e.soutiens);
      if (e.organisation !== undefined) carriere = appliquerDelta(carriere, "organisation", e.organisation);
      if (e.notoriete !== undefined) carriere = appliquerDelta(carriere, "notoriete", e.notoriete);
      if (e.legitime !== undefined) carriere = appliquerDelta(carriere, "legitime", e.legitime);
      if (e.reputation !== undefined) carriere = appliquerDelta(carriere, "reputation", e.reputation);
      if (e.argent !== undefined) {
        carriere = { ...carriere, ressources: { ...carriere.ressources, argent: clamp01b(carriere.ressources.argent + e.argent) } };
        // E7 (J13) : un don nommé laisse une trace et une dette, jamais un +argent anonyme.
        carriere = {
          ...carriere,
          dons: [...carriere.dons, { persoId: perso.id, nomPerso: nomComplet(perso), montant: e.argent, tick, contre: "faveur à rendre" }],
        };
      }
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

  // 4bis. Journal de la proposition : les coups l'ont déjà poussée un par un (R9),
  // on ne fait qu'écrire la ligne quand un coup l'a poussée. Le fact checking des coups
  // média s'applique ici, recalculé sur les coups média de la semaine.
  let proposition = partie.proposition;
  let risqueFactCheck = 0;
  let propositionPoussee = false;
  for (const coup of coups) {
    const a = actionParId(coup.actionId);
    if (coup.pousserProposition === true || a.regle === "R9" || tour.pousserProposition === true) propositionPoussee = true;
    if (a.categorie !== "media") continue;
    const media = mediaParId(coup.mediaId ?? tour.mediaId ?? "med.quotidien-regional");
    const routage = routerMedia(media, "media", carriere.bonusMedia, proposition.statutPreuve);
    risqueFactCheck = Math.max(risqueFactCheck, routage.risqueFactCheck);
  }
  if (propositionPoussee) {
    const deltas: string[] = [];
    for (const g of partie.monde.groupes) {
      deltas.push(`${g.id} ${(proposition.dicibilite[g.id] ?? 0).toFixed(3)}`);
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

  // 5. Coûts de la semaine (coûts croissants par palier E4, surcoûts d'effets durables F6),
  // activité de fond (J15 F1), promesses réglées (E10), régénération pour la suivante.
  // C1 : chaque coup a déjà payé sa fatigue entre deux coups, les coûts se débitent ici en une fois.
  let coutTempsSemaine = surcoutDurees + (tour.interaction !== undefined ? 0.2 : 0);
  let coutArgentSemaine = 0;
  for (const coup of coups) {
    const a = actionParId(coup.actionId);
    coutTempsSemaine += a.coutTemps * coutPalierActuel.temps;
    coutArgentSemaine += a.coutArgent * coutPalierActuel.argent;
  }
  const coutTemps = coutTempsSemaine;
  const coutArgent = coutArgentSemaine;
  carriere = {
    ...carriere,
    ressources: {
      ...carriere.ressources,
      temps: Math.max(0, carriere.ressources.temps - coutTemps),
      argent: Math.max(0, carriere.ressources.argent - coutArgent),
    },
  };
  // P3 : réunions après les dépenses des coups, avant la régénération hebdomadaire.
  let etatReunions = { ...partie, carriere, personnages, journal: [] as JournalPartie[] };
  for (const ordre of tour.reunions ?? []) etatReunions = tenirReunion(etatReunions, ordre, tick, rng);
  etatReunions = avancerMissions(etatReunions, tick, creerRng((partie.graine * 3266489917 + tick) >>> 0));
  carriere = etatReunions.carriere;
  personnages = etatReunions.personnages;
  journal.push(...etatReunions.journal);
  // J15 F1 : la seconde étage de la semaine. Une activité de fond, jamais bloquante, toujours réelle.
  const activite = activiteParId(tour.activiteId ?? "repos");
  carriere = appliquerActivite(carriere, activite);
  journal.push({ tick, texte: `À côté : ${activite.libelle.toLowerCase()}.` });
  // E10 (J11) : les promesses se règlent ici. Tenue par l'action attendue, manquée à l'échéance.
  const persoParId = (id: string) => personnages.find((p) => p.id === id);
  carriere = {
    ...carriere,
    promesses: carriere.promesses.map((pr) => {
      if (pr.statut !== "en-cours") return pr;
      const tientCetteSemaine = coups.some((coup) => {
        try {
          return actionParId(coup.actionId).categorie === pr.categorieAttendue;
        } catch {
          return false;
        }
      });
      if (tientCetteSemaine) {
        const cible = persoParId(pr.persoId);
        if (cible !== undefined) {
          const marque = cible.memoire.filter((m) => m.type === "promesse").reduce((s, m) => s + m.gravite, 0);
          const poids = poidsTraits(cible, carriere.progression.notoriete);
          // Traits : l'idéaliste note plus, l'opportuniste moins (J16 F5).
          const gainRelation = Math.min(0.15, 0.06 + marque * poids.fiabilitePromesse);
          const cibleActuelle = personnages.find((p) => p.id === pr.persoId);
          if (cibleActuelle !== undefined) {
            personnages = personnages.map((p) =>
              p.id === pr.persoId ? { ...p, relation: Math.max(-1, Math.min(1, p.relation + gainRelation)) } : p,
            );
          }
        }
        journal.push({ tick, texte: `Promesse tenue envers ${pr.texte}. Ta parole vaut plus, cette semaine.` });
        return { ...pr, statut: "tenue" as const };
      }
      if (tick > pr.tickEcheance) {
        const cible = persoParId(pr.persoId);
        if (cible !== undefined) {
          const poids = poidsTraits(cible, carriere.progression.notoriete);
          personnages = personnages.map((p) =>
            p.id === pr.persoId
              ? { ...p, memoire: [...p.memoire, { type: "attaque" as const, gravite: 0.5 * poids.fiabilitePromesse, tick, detail: "promesse manquée" }] }
              : p,
          );
        }
        journal.push({ tick, texte: `Promesse manquée : ${pr.texte}. Ça se sait, et ça se garde.` });
        return { ...pr, statut: "manquee" as const };
      }
      return pr;
    }),
  };
  carriere = regenererHebdo(carriere);
  // F6 : les effets durables pèsent chaque semaine puis s'éteignent à échéance.
  carriere = avancerEffetsDurees(carriere, tick);

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

  // P1 : le graphe social reçoit la mémoire de la semaine. Chaque nœud retient ce qui lui est
  // arrivé, daté : la mémoire des organisations survit aux personnages (design §36-37).
  let mondeSocial = avancerInitiatives(
    etatReunions.mondeSocial, personnages, tick,
    creerRng((partie.graine * 2246822519 + tick) >>> 0),
  );
  const initiative = mondeSocial.evenements.find((e) => e.tick === tick && e.type === "initiative-autonome");
  if (initiative !== undefined) journal.push({ tick, texte: initiative.texte });
  mondeSocial = enregistrerEvenement(mondeSocial, {
    tick,
    noeudId: NOEUD_JOUEUR,
    type: "decisions",
    texte: `Semaine ${tick} : ${action.libelle.toLowerCase()}.`,
  });
  for (const e of monde.evenements.filter((ev) => ev.tick === tick)) {
    mondeSocial = enregistrerEvenement(mondeSocial, {
      tick,
      noeudId: e.groupeId,
      type: "evenement-monde",
      texte: `${e.type} (${e.cause}).`,
    });
  }
  for (const p of personnages) {
    const recent = p.memoire.find((m) => m.tick === tick);
    const textePerso =
      tour.interaction !== undefined && tour.interaction.persoId === p.id && messageInteraction !== null
        ? messageInteraction
        : recent?.detail;
    if (textePerso !== undefined) {
      mondeSocial = enregistrerEvenement(mondeSocial, {
        tick,
        noeudId: p.id,
        type: "rencontre",
        texte: textePerso,
      });
      // La mémoire du nœud organisation : ce qui arrive à un membre marque la maison.
      mondeSocial = enregistrerEvenement(mondeSocial, {
        tick,
        noeudId: idOrganisation(p.organisation),
        type: "rencontre",
        texte: `${p.prenom} ${p.nom} : ${recent?.detail ?? textePerso}`,
      });
    }
  }
  for (const m of MEDIAS) {
    if (coups.some((coup) => {
      try {
        return actionParId(coup.actionId).categorie === "media";
      } catch {
        return false;
      }
    })) {
      mondeSocial = enregistrerEvenement(mondeSocial, {
        tick,
        noeudId: m.id,
        type: "passage-media",
        texte: `A relayé « ${action.libelle} » cette semaine.`,
      });
    }
  }
  if (chocEcoFort(monde, tick)) {
    for (const g of monde.groupes) {
      mondeSocial = enregistrerEvenement(mondeSocial, {
        tick,
        noeudId: g.id,
        type: "choc-eco",
        texte: `Satisfaction économique à ${(g.satisfactionEco * 100).toFixed(0)} sur 100.`,
      });
    }
  }

  // J3 plus E2/E3/E6 : la carte propage ton idée (matching marque-enjeu par territoire, J11),
  // et le monde te répond : relations dégradées plus notoriété, un parti coalisé riposte (J12).
  let territoires = propagerTerritoires(
    partie.territoires,
    carriere.progression.soutiens,
    carriere.ressources.audience,
    carriere.progression.notoriete,
    partie.territoires.map((t) => matchingMarqueEnjeu(c0.ideologie, t.enjeu)),
  );
  const riposte = frappeAdverse(territoires, relationsPartis, carriere.progression.notoriete, rng);
  if (riposte.frappes.length > 0) {
    territoires = territoires.map((t) => ({
      ...t,
      adoption: clamp01b(t.adoption + (riposte.territoires.get(t.id) ?? 0)),
      reponseAdverse: clamp01b(t.reponseAdverse + (riposte.reponses.get(t.id) ?? 0)),
    }));
    for (const f of riposte.frappes) journal.push({ tick, texte: f.texte });
  }

  // E8/F9 (J13, J17) : l'investiture, échéance intermédiaire. Ton propre camp arbitre en mai 2027.
  // Ce que tu as fait aux paliers 1 et 2 conditionne cette option des paliers 4 et 5.
  let investiture = c0.investiture;
  const tickInvestiture = tickDeDate(2027, 5, 10);
  if (investiture === "non-posee" && tick >= tickInvestiture) {
    const relationMeilleure = Math.max(...Object.values(relationsPartis), -1);
    const conditionsOk =
      carriere.progression.soutiens >= 0.3 && trahisonsLeaders === 0 && relationMeilleure >= 0.15;
    if (conditionsOk) {
      investiture = "obtenue";
      journal.push({ tick, texte: "Investiture obtenue : ton camp te confie une circonscription pour juin." });
    } else {
      investiture = "ratee";
      journal.push({
        tick,
        texte: trahisonsLeaders > 0
          ? "Investiture ratée : tes trahisons pesaient plus que tes soutiens dans la salle des directions."
          : carriere.progression.soutiens < 0.3
            ? "Investiture ratée : trop peu de soutiens pour défendre un nom en réunion de direction."
            : "Investiture ratée : aucun courant ne s'est porté garant de ton nom.",
      });
    }
  }
  carriere = { ...carriere, investiture };

  // F10 (J17) : les saisons se sentent. Une entrée de journal à chaque changement de saison.
  const saison = saisonDuTick(tick);
  if (saison !== null && saison !== saisonDuTick(tick - 1)) {
    journal.push({ tick, texte: `${saison} : ${LIBELLES_SAISON[saison] ?? ""}` });
  }

  // E11 (J12) : les médias et partis vivent sans toi. Une enquête indépendante de temps en temps.
  if (rng.next() < 0.08) {
    const sujets = [
      "Le Quotidien régional publie une enquête indépendante sur la dette d'un grand groupe local.",
      "Une chaîne nationale décortique les comptes de campagnes, tous partis confondus.",
      "Le Front de l'ordre (fictif) s'affiche en couverture, sans lien avec toi.",
      "Un député éminent est mis en cause par une révélation journalistique, l'onde de choc traverse tous les partis.",
    ];
    journal.push({ tick, texte: sujets[Math.floor(rng.next() * sujets.length) % sujets.length] });
  }

  // 8. Marginalisation comptée, dilemmes (résolution du choix puis génération), fins évaluées.
  carriere = evaluerMarginalisation(carriere);

  // F4/E9 (J16, J11) : le carrefour en cours est tranché, l'effet est révélé en texte, jamais chiffré avant.
  let dilemmesPasses = [...partie.dilemmesPasses];
  let dilemmeOuvert: Dilemme | null = partie.dilemmeOuvert;
  if (tour.choixDilemme !== undefined && partie.dilemmeOuvert !== null) {
    const d = partie.dilemmeOuvert;
    if (d.id !== tour.choixDilemme.dilemmeId) {
      throw new Error("Le dilemme choisi ne correspond pas au carrefour ouvert.");
    }
    const persoCible = d.persoId !== undefined ? personnages.find((p) => p.id === d.persoId) : undefined;
    const resolution = resoudreDilemme(d, tour.choixDilemme.optionId, carriere, persoCible, tick, rng);
    journal.push({ tick, texte: resolution.texteChoix });
    const delta = resolution.delta;
    if (delta.soutiens !== undefined) carriere = appliquerDelta(carriere, "soutiens", delta.soutiens);
    if (delta.organisation !== undefined) carriere = appliquerDelta(carriere, "organisation", delta.organisation);
    if (delta.notoriete !== undefined) carriere = appliquerDelta(carriere, "notoriete", delta.notoriete);
    if (delta.legitime !== undefined) carriere = appliquerDelta(carriere, "legitime", delta.legitime);
    if (delta.reputation !== undefined) carriere = appliquerDelta(carriere, "reputation", delta.reputation);
    if (delta.audience !== undefined)
      carriere = { ...carriere, ressources: { ...carriere.ressources, audience: clamp01b(carriere.ressources.audience + delta.audience) } };
    if (delta.risque !== undefined)
      carriere = { ...carriere, risqueEnquete: clamp01b(carriere.risqueEnquete + delta.risque) };
    if (delta.argent !== undefined)
      carriere = { ...carriere, ressources: { ...carriere.ressources, argent: clamp01b(carriere.ressources.argent + delta.argent) } };
    if (resolution.effetDurable !== null) {
      carriere = { ...carriere, effetsDurees: [...carriere.effetsDurees, resolution.effetDurable] };
    }
    const promesseDil = promesseDepuisDilemme(d, tour.choixDilemme.optionId, d.persoId, tick);
    if (promesseDil !== null) carriere = { ...carriere, promesses: [...carriere.promesses, promesseDil] };
    dilemmesPasses.push(d.id);
    dilemmeOuvert = null;
  }

  // F8 : un dilemme peut naître de la semaine écoulée, si aucun carrefour n'est déjà ouvert.
  if (dilemmeOuvert === null) {
    const candidats = genererDilemmes(tick, monde, carriere, personnages, dilemmesPasses);
    if (candidats.length > 0) {
      dilemmeOuvert = candidats[0];
      journal.push({ tick, texte: `Un carrefour s'ouvre : ${dilemmeOuvert.titre}.` });
    }
  }

  // E13 (J14) : le bruit de la semaine ressort des semaines plus tard. Effet retardé annoncé.
  // C1 : n'importe quel coup média fort de la semaine peut faire résonner l'écho.
  const coupMediaFort = coups.some((coup) => {
    try {
      if (actionParId(coup.actionId).categorie !== "media") return false;
    } catch {
      return false;
    }
    const risque = risqueAction(coup.actionId, carriere.ressources.temps, carriere.ressources.argent, 1);
    return risque.exposition > 0.02;
  });
  if (coupMediaFort) {
    journal.push({
      tick,
      texte: `L'écho de « ${action.libelle} » ressortira : des relais le reprendront, le monde s'y référera.`,
    });
  }

  if (tick % 4 === 0) {
    journal.push({
      tick,
      texte: `Carte : ton idée est entendue en moyenne à ${(adoptionMoyenne(territoires) * 100).toFixed(0)} sur 100 sur douze territoires.`,
    });
  }
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
    territoires,
    mondeSocial,
    reunions: etatReunions.reunions,
    missions: etatReunions.missions,
    dilemmesPasses,
    dilemmeOuvert,
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

// P1 : un choc économique marquant entre en mémoire de groupe. Seuil haut, pour que la mémoire
// porte les vrais bouleversements et pas le bruit hebdomadaire.
function chocEcoFort(monde: Monde, tick: number): boolean {
  return monde.groupes.some((g) => g.satisfactionEco < 0.25) && tick > 0;
}

export interface VuePartie {
  version: string;
  tick: number;
  semaine: number;
  libelleSemaine: string;
  dateISO: string;
  avertissement: string;
  palier: number; // J7 : le joueur ne voit que son palier et avant
  carriere: Carriere;
  activites: ActiviteSemaine[]; // J15 F1 : le second étage de la semaine
  dilemmeOuvert: Dilemme | null; // F4 : le carrefour en attente de choix
  saison: string | null; // F10 : la saison du calendrier réel
  coutPalier: { temps: number; argent: number }; // E4 : le coût croissant affiché
  coutSurcoutDurees: number; // F6 : le poids des effets durables sur tes semaines
  personnages: Personnage[];
  personnagesVisibles: Personnage[]; // J7 : au palier 1, figures de proximité seulement
  groupes: ReturnType<typeof filtrerVueJoueur>["groupes"];
  echeances: ReturnType<typeof echeancesAPartirDe>;
  journal: JournalPartie[];
  fin: Fin | null;
  medias: Media[];
  mediasVisibles: Media[]; // J7 : médias nationaux masqués au palier 1
  proposition: Proposition;
  manoeuvres: ManoeuvreParti[];
  manoeuvresVisibles: ManoeuvreParti[]; // J7 : partis rivaux cachés au palier 1
  relationsPartis: Record<string, number>;
  partisVisibles: boolean; // J7 : faux au palier 1, les partis existent mais ne s'affichent pas
  territoires: Territoire[]; // J3 : carte d'adoption visible dès le palier 1, c'est ton terrain
  carte: VueMondeSocial; // P1 : le sous-graphe visible, piloté par le palier (nœuds, liens, mémoire)
  dossiers: DossierRef[]; // P2 : les dossiers d'enquête ouverts
  chomage: number;
  sourceChomage: string;
}

// Métiers visibles au palier 1 : proximité et terrain, jamais les états-majors ni les médias nationaux.
const METIERS_PALIER_1: Personnage["metier"][] = [
  "elu-local",
  "syndicaliste",
  "figure-associative",
  "fonctionnaire",
  "entrepreneur",
  "chercheur",
  "historien",
];

export function vuePartie(partie: Partie): VuePartie {
  const semaine = partie.tick + 1;
  const eco = chomagePourTick(semaine);
  const palier = palierDeStatut(partie.carriere.statut);
  const personnagesVisibles = palier <= 1
    ? partie.personnages.filter((p) => METIERS_PALIER_1.includes(p.metier))
    : partie.personnages;
  const mediasVisibles = palier <= 1 ? MEDIAS.slice(0, 1) : MEDIAS;
  const manoeuvresToutes = manoeuvresPartis(partie.monde, partie.personnages, true);
  const manoeuvresVisibles = palier <= 1 ? [] : manoeuvresToutes;
  // P1 : la carte du monde social visible suit les mêmes règles J7 que le reste de la vue.
  const carte = carteVisible(
    partie.mondeSocial,
    noeudsVisiblesDuPalier(
      partie.mondeSocial,
      palier,
      personnagesVisibles.map((p) => p.id),
      mediasVisibles.map((m) => m.id),
    ),
  );
  return {
    version: partie.version,
    tick: partie.tick,
    semaine,
    libelleSemaine: libelleSemaineDe(semaine),
    dateISO: dateISODe(semaine),
    avertissement: AVERTISSEMENT_OUVERTURE,
    palier,
    carriere: partie.carriere,
    activites: ACTIVITES_SEMAINE,
    dilemmeOuvert: partie.dilemmeOuvert,
    saison: saisonDuTick(semaine),
    coutPalier: coutPalier(palier),
    coutSurcoutDurees: surcoutEffetsDurees(partie.carriere),
    personnages: partie.personnages,
    personnagesVisibles,
    groupes: filtrerVueJoueur(partie.monde).groupes,
    echeances: echeancesAPartirDe(semaine).slice(0, 5),
    journal: partie.journal.slice(-30),
    fin: partie.fin,
    medias: MEDIAS,
    mediasVisibles,
    proposition: partie.proposition,
    manoeuvres: manoeuvresToutes,
    manoeuvresVisibles,
    relationsPartis: partie.relationsPartis,
    partisVisibles: palier > 1,
    territoires: partie.territoires,
    carte,
    dossiers: partie.dossiers,
    chomage: eco.chomage,
    sourceChomage: eco.source,
  };
}
