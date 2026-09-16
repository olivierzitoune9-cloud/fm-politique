// Personnages fictifs nommés, prénoms et noms français aléatoires seedés, jamais de personne réelle.
// Pas d'image ni d'avatar : nom, métier, traits, relation, mémoire. Les métiers portent des hooks mécaniques.
import type { Rng } from "./rng.js";

export type Metier =
  | "leader-parti"
  | "journaliste"
  | "fact-checker"
  | "chercheur"
  | "experte-ia"
  | "ingenieur"
  | "historien"
  | "elu-local"
  | "depute"
  | "syndicaliste"
  | "entrepreneur"
  | "fonctionnaire"
  | "figure-associative";

export interface MemoirePerso {
  type: "promesse" | "dette" | "trahison" | "soutien" | "attaque";
  gravite: number; // 0..1
  tick: number;
  detail: string;
}

export interface Personnage {
  id: string;
  prenom: string;
  nom: string;
  metier: Metier;
  organisation: string;
  age: number;
  traits: string[];
  expertise: number; // 0..1
  persuasion: number; // 0..1
  relation: number; // -1..1 envers le joueur
  memoire: MemoirePerso[];
  cautionActive: { jusqua: number; multiplicateur: number } | null; // R14 via chercheur
  // J17 F7 : connaissance mutuelle. On n'affiche jamais la relation exacte tant qu'on ne connaît pas la personne.
  connaissance: number; // 0..1
}

const PRENOMS = [
  "Camille", "Sofia", "Yasmine", "Julien", "Marc", "Léa", "Thomas", "Inès",
  "Rémi", "Océane", "Karim", "Antoine", "Claire", "Nadia", "Émile", "Zoé",
  "Bastien", "Anaïs", "Mehdi", "Claire-Marie", "Victor", "Amélie", "Hugo", "Farida",
  "Pauline", "Sébastien", "Coline", "Ibrahim", "Judith", "Romain", "Salomé", "Nils",
  "Élise", "Gabin", "Maiwenn", "Adrien", "Chloé", "Dimitri", "Rose", "Yanis",
];

const NOMS = [
  "Barrère", "Nkoulou", "Vasseur", "Da Costa", "Mercier", "Lyautey-Pons", "Chapdelaine", "Rahmani",
  "Steinberg", "Aubrun", "Gélin", "Ozenda", "Traoré", "Marchal", "Bisset", "Kraus",
  "Delaleu", "Ferrandis", "Ouazzani", "Prigent", "Sauvageot", "Toledano", "Vigneron", "Yildiz",
  "Berthelot", "Casanova", "Dewerpe", "Estival", "Ganne", "Hourcade", "Jouanneau", "Kergoat",
  "Lombard", "Moatti", "Nivaggioli", "Piazzesi", "Quirion", "Rousselet", "Siri", "Tessonneau",
  "Ughetto", "Vasseur-Nadal", "Wahl", "Xardel", "Zamboni", "Berger", "Coustal", "Rivière",
];

export interface Profil {
  id: string;
  metier: Metier;
  organisation: string;
  ageMoyen: number;
}

export const PROFILS: Profil[] = [
  { id: "pers.leader-radical", metier: "leader-parti", organisation: "Front de l'ordre (fictif)", ageMoyen: 52 },
  { id: "pers.leader-modere", metier: "leader-parti", organisation: "Alliance parlementaire (fictif)", ageMoyen: 55 },
  { id: "pers.leader-syndical", metier: "leader-parti", organisation: "Mouvement populaire uni (fictif)", ageMoyen: 48 },
  { id: "pers.journaliste", metier: "journaliste", organisation: "Le Quotidien régional", ageMoyen: 41 },
  { id: "pers.fact-checker", metier: "fact-checker", organisation: "Bureau de vérification des faits", ageMoyen: 35 },
  { id: "pers.chercheur", metier: "chercheur", organisation: "Laboratoire d'économie appliquée", ageMoyen: 47 },
  { id: "pers.experte-ia", metier: "experte-ia", organisation: "Studio de données", ageMoyen: 34 },
  { id: "pers.ingenieur", metier: "ingenieur", organisation: "Coopérative numérique", ageMoyen: 38 },
  { id: "pers.historien", metier: "historien", organisation: "Université régionale", ageMoyen: 58 },
  { id: "pers.elue", metier: "elu-local", organisation: "Conseil municipal", ageMoyen: 45 },
  { id: "pers.depute", metier: "depute", organisation: "Assemblée nationale", ageMoyen: 50 },
  { id: "pers.syndicaliste", metier: "syndicaliste", organisation: "Union intersyndicale", ageMoyen: 44 },
  { id: "pers.entrepreneur", metier: "entrepreneur", organisation: "Groupe industriel local", ageMoyen: 57 },
  { id: "pers.fonctionnaire", metier: "fonctionnaire", organisation: "Préfecture", ageMoyen: 43 },
  { id: "pers.associative", metier: "figure-associative", organisation: "Collectif de quartier", ageMoyen: 39 },
];

const TRAITS = [
  "loyal", "ambitieux", "susceptible", "idealiste", "opportuniste", "discret",
  "bavard", "rigoureux", "cynique", "empathique", "rigide",
];

function arrondi2(x: number): number {
  return Math.round(x * 100) / 100;
}

export function nomJoueurAleatoire(rng: Rng): string {
  const prenom = PRENOMS[Math.floor(rng.next() * PRENOMS.length)];
  const nom = NOMS[Math.floor(rng.next() * NOMS.length)];
  return `${prenom} ${nom}`;
}

export function nomComplet(p: Personnage): string {
  return `${p.prenom} ${p.nom}`;
}

function tirerNom(rng: Rng): { prenom: string; nom: string } {
  const prenom = PRENOMS[Math.floor(rng.next() * PRENOMS.length)];
  const nom = NOMS[Math.floor(rng.next() * NOMS.length)];
  return { prenom, nom };
}

export function genererPersonnages(rng: Rng): Personnage[] {
  return PROFILS.map((p) => {
    const { prenom, nom } = tirerNom(rng);
    const traits: string[] = [];
    while (traits.length < 2) {
      const t = TRAITS[Math.floor(rng.next() * TRAITS.length)];
      if (!traits.includes(t)) traits.push(t);
    }
    const age = Math.round(p.ageMoyen + (rng.next() - 0.5) * 14);
    return {
      id: p.id,
      prenom,
      nom,
      metier: p.metier,
      organisation: p.organisation,
      age,
      traits,
      expertise: arrondi2(0.3 + rng.next() * 0.65),
      persuasion: arrondi2(0.3 + rng.next() * 0.5),
      relation: arrondi2((rng.next() - 0.5) * 0.4),
      memoire: [],
      cautionActive: null,
      connaissance: arrondi2(0.1 + rng.next() * 0.2),
    };
  });
}

// J17 F7 : chaque interaction rapproche, la fiche s'affine au fil des semaines.
export function gagnerConnaissance(p: Personnage, gain: number): Personnage {
  return { ...p, connaissance: Math.min(1, p.connaissance + gain) };
}

export interface EstimationRelation {
  libelle: string; // ce qu'on lit sur le visage
  fiabilite: string; // vague, approximative, sure
  min: number;
  max: number;
}

// J17 F7 : la fiche n'affiche jamais la relation exacte avant une vraie connaissance.
// Fourchette large au début, resserrée par les interactions, exacte au delà de 0.9.
export function estimationRelation(p: Personnage): EstimationRelation {
  const c = p.connaissance;
  const demiLargeur = 0.5 * (1 - c);
  const centre = p.relation;
  const min = Math.max(-1, Math.round((centre - demiLargeur) * 100) / 100);
  const max = Math.min(1, Math.round((centre + demiLargeur) * 100) / 100);
  const fiabilite = c >= 0.9 ? "sûre" : c >= 0.5 ? "approximative" : "vague";
  let libelle: string;
  if (p.relation < -0.25) libelle = "hostile";
  else if (p.relation < 0.1) libelle = "distant";
  else if (p.relation < 0.4) libelle = "tiède";
  else libelle = "chaud";
  if (c >= 0.5) {
    // Avec la connaissance, la lecture gagne la nuance du doute : on montre la fourchette.
    libelle = `${libelle} (entre ${min.toFixed(2)} et ${max.toFixed(2)})`;
  }
  return { libelle, fiabilite, min, max };
}

// J16 F5 : les traits pèsent dans les interactions. La mémoire existait, les personnalités manquaient.
// Hypothèse de gameplay (King of Dragon Pass) : jamais de blocage, des poids.
export interface PoidsTraits {
  convaincre: number; // modificateur de la base de persuasion
  graviteMemoire: number; // multiplicateur de gravité des souvenirs posés
  refusSeuil: number; // modificateur du seuil de refus d'un coup de main
  fiabilitePromesse: number; // pondère la gravité d'une promesse manquée
}

export function poidsTraits(perso: Personnage, notorieteJoueur: number): PoidsTraits {
  const base: PoidsTraits = { convaincre: 0, graviteMemoire: 1, refusSeuil: 0, fiabilitePromesse: 1 };
  for (const t of perso.traits) {
    switch (t) {
      case "loyal":
        base.convaincre += 0.04;
        base.graviteMemoire *= 1.15; // blessé plus durablement, fidèle plus longtemps
        break;
      case "ambitieux":
        base.convaincre += notorieteJoueur * 0.15; // il te suit si tu montes
        break;
      case "susceptible":
        base.graviteMemoire *= 1.3;
        base.refusSeuil += 0.05;
        break;
      case "idealiste":
        base.convaincre += 0.03;
        base.fiabilitePromesse *= 1.3; // une promesse manquée le touche vraiment
        break;
      case "opportuniste":
        base.convaincre += 0.05;
        base.fiabilitePromesse *= 0.7; // une promesse manquée glisse
        break;
      case "discret":
        base.refusSeuil -= 0.03;
        break;
      case "bavard":
        base.convaincre += 0.02;
        break;
      case "rigoureux":
      case "rigide":
        base.convaincre -= 0.04;
        base.refusSeuil += 0.04;
        base.graviteMemoire *= 0.9; // froid, durable, sans rancune excessive
        break;
      case "cynique":
        base.convaincre -= 0.05;
        base.graviteMemoire *= 0.8;
        break;
      case "empathique":
        base.convaincre += 0.05;
        break;
    }
  }
  return base;
}

export interface EffetHook {
  detail: string;
  soutiens?: number;
  organisation?: number;
  notoriete?: number;
  legitime?: number;
  reputation?: number;
  argent?: number;
  exposition?: number;
  caution?: boolean;
  infoPrecise?: boolean;
  microCiblage?: boolean;
}

// Hooks mécaniques des métiers, hypothèses de gameplay nées des règles R1 R2 R9 R12 R14 et de l'info interne.
export function effetHook(metier: Metier): EffetHook {
  switch (metier) {
    case "leader-parti":
      return { notoriete: 0.08, detail: "une ligne du parti te cite, te voilà visible" };
    case "journaliste":
      return { notoriete: 0.12, detail: "portrait flatteur dans le quotidien régional" };
    case "fact-checker":
      return { infoPrecise: true, detail: "il t'apprend à vérifier : ton prochain regard sera plus net" };
    case "chercheur":
      return { caution: true, legitime: 0.08, detail: "caution savante : ta parole porte plus loin (R14)" };
    case "experte-ia":
      return {
        microCiblage: true,
        detail: "micro ciblage : tes actions média portent plus, au prix d'une méfiance en hausse",
      };
    case "ingenieur":
      return { exposition: 0.1, detail: "ta plateforme numérique amplifie le bouche à oreille (R2)" };
    case "historien":
      return {
        reputation: 0.06,
        detail: "il te met en garde sur les pentes savonneuses et te prête une respectabilité (R12)",
      };
    case "elu-local":
      return { organisation: 0.08, detail: "carnet d'adresses municipales et salle prêtée" };
    case "depute":
      return { legitime: 0.05, detail: "une question écrite à l'Assemblée, voilà du papier officiel" };
    case "syndicaliste":
      return { soutiens: 0.08, detail: "la rue derrière toi pour une semaine" };
    case "entrepreneur":
      return { argent: 0.3, detail: "don de campagne, tu lui dois une faveur" };
    case "fonctionnaire":
      return { infoPrecise: true, detail: "copie d'un rapport interne : ton regard se précise" };
    case "figure-associative":
      return {
        soutiens: 0.05,
        detail: "le collectif te prête ses ponts entre groupes, tes coups secs passeront moins mal (atténuateur R1)",
      };
  }
}

export function libelleMetier(metier: Metier): string {
  switch (metier) {
    case "leader-parti": return "Leader de parti";
    case "journaliste": return "Journaliste";
    case "fact-checker": return "Vérificateur de faits";
    case "chercheur": return "Chercheur économiste";
    case "experte-ia": return "Experte IA et données";
    case "ingenieur": return "Ingénieur plateforme";
    case "historien": return "Historien";
    case "elu-local": return "Élue locale";
    case "depute": return "Député";
    case "syndicaliste": return "Syndicaliste";
    case "entrepreneur": return "Entrepreneur";
    case "fonctionnaire": return "Fonctionnaire";
    case "figure-associative": return "Figure associative";
  }
}
