// Carrière du joueur : palier FM neutre, métier d'origine affiché, ambition choisie, progression.
// Le joueur est une instance d'Acteur au sens de l'ontologie, sans jauge unique de pouvoir.
// R2 J10 : le statut est un palier neutre (jamais un métier), le métier vient de l'origine.
import { nomJoueurAleatoire } from "./personnages.js";
import type { CategorieAction } from "./actions.js";
import type { Rng } from "./rng.js";

export type Ambition = "elu" | "chef-parti" | "proposition" | "presidentiel" | "maire" | "europeen";

export interface AmbitionDef {
  id: Ambition;
  libelle: string;
  description: string;
  echeanceId: string;
  seuil: number;
}

export const AMBITIONS: AmbitionDef[] = [
  {
    id: "elu",
    libelle: "Se faire élire député en 2027",
    description: "Passer de l'arrière-bureau au banc de l'Assemblée aux législatives de juin 2027.",
    echeanceId: "legislatives-2027-t1",
    seuil: 0.45,
  },
  {
    id: "chef-parti",
    libelle: "Prendre la tête d'un parti",
    description: "Devenir incontournable dans un parti existant d'ici juin 2027.",
    echeanceId: "legislatives-2027-t2",
    seuil: 0.5,
  },
  {
    id: "proposition",
    libelle: "Imposer ta proposition",
    description: "Faire de ton idée une chose dicible partout puis un texte discuté d'ici la fin 2027.",
    echeanceId: "legislatives-2027-t2",
    seuil: 0.65,
  },
  {
    id: "presidentiel",
    libelle: "Viser la présidentielle en outsider",
    description: "Le chemin le plus improbable : être en lice ou au pouvoir en avril 2027.",
    echeanceId: "presidentielle-2027-t2",
    seuil: 0.6,
  },
  {
    id: "maire",
    libelle: "Devenir maire en 2032",
    description: "Le chemin long par le local : ancrage, salle des fêtes, municipales de mars 2032.",
    echeanceId: "municipales-2032",
    seuil: 0.5,
  },
  {
    id: "europeen",
    libelle: "Peser aux européennes 2029",
    description: "Construire une liste et un discours qui portent en juin 2029.",
    echeanceId: "europeennes-2029",
    seuil: 0.45,
  },
];

// J9 : projection longue. Chaque ambition porte ses paliers intermédiaires sur le calendrier réel.
export interface ObjectifPalier {
  palier: number;
  libelle: string;
  seuilSoutiens: number;
}

export const OBJECTIFS_PAR_AMBITION: Record<Ambition, ObjectifPalier[]> = {
  elu: [
    { palier: 1, libelle: "Se faire connaître du quartier", seuilSoutiens: 0.05 },
    { palier: 2, libelle: "Tenir une antenne locale", seuilSoutiens: 0.15 },
    { palier: 3, libelle: "Être investi pour les législatives", seuilSoutiens: 0.3 },
    { palier: 5, libelle: "Siéger à l'Assemblée en juin 2027", seuilSoutiens: 0.45 },
  ],
  "chef-parti": [
    { palier: 1, libelle: "Prendre sa carte et se faire voir", seuilSoutiens: 0.05 },
    { palier: 2, libelle: "Tenir un courant local", seuilSoutiens: 0.2 },
    { palier: 4, libelle: "Entrer à la direction", seuilSoutiens: 0.4 },
    { palier: 5, libelle: "Prendre la tête d'ici juin 2027", seuilSoutiens: 0.5 },
  ],
  proposition: [
    { palier: 1, libelle: "Formuler l'idée au marché", seuilSoutiens: 0.05 },
    { palier: 2, libelle: "La rendre dicible localement", seuilSoutiens: 0.15 },
    { palier: 3, libelle: "La porter dans la presse", seuilSoutiens: 0.3 },
    { palier: 5, libelle: "L'imposer dans le débat fin 2027", seuilSoutiens: 0.4 },
  ],
  presidentiel: [
    { palier: 1, libelle: "Exister dans une salle des fêtes", seuilSoutiens: 0.05 },
    { palier: 3, libelle: "Devenir un nom national", seuilSoutiens: 0.3 },
    { palier: 4, libelle: "Tenir une candidature crédible", seuilSoutiens: 0.45 },
    { palier: 5, libelle: "Peser en avril 2027", seuilSoutiens: 0.6 },
  ],
  maire: [
    { palier: 1, libelle: "Connaître chaque rue", seuilSoutiens: 0.08 },
    { palier: 2, libelle: "Mener une liste d'opposition", seuilSoutiens: 0.25 },
    { palier: 3, libelle: "Siéger au conseil municipal", seuilSoutiens: 0.4 },
    { palier: 5, libelle: "Remporter la mairie en 2032", seuilSoutiens: 0.5 },
  ],
  europeen: [
    { palier: 1, libelle: "Trouver des soutiens au delà du clocher", seuilSoutiens: 0.08 },
    { palier: 2, libelle: "Monter une liste locale crédible", seuilSoutiens: 0.2 },
    { palier: 4, libelle: "Porter un discours européen", seuilSoutiens: 0.35 },
    { palier: 5, libelle: "Peser en juin 2029", seuilSoutiens: 0.45 },
  ],
};

export function objectifsPour(ambition: Ambition): ObjectifPalier[] {
  return OBJECTIFS_PAR_AMBITION[ambition];
}


export type StatutCarriere = "employe" | "militant" | "responsable-local" | "conseiller" | "elu";

export const STATUTS: {
  id: StatutCarriere;
  libelle: string;
  seuilSoutiens: number;
  seuilOrganisation: number;
  seuilLegitime: number;
}[] = [
  { id: "employe", libelle: "Citoyen sans mandat", seuilSoutiens: 0, seuilOrganisation: 0, seuilLegitime: 0 },
  { id: "militant", libelle: "Militant connu localement", seuilSoutiens: 0.1, seuilOrganisation: 0.05, seuilLegitime: 0 },
  { id: "responsable-local", libelle: "Responsable d'antenne locale", seuilSoutiens: 0.2, seuilOrganisation: 0.25, seuilLegitime: 0.1 },
  { id: "conseiller", libelle: "Conseiller de figure en place", seuilSoutiens: 0.3, seuilOrganisation: 0.35, seuilLegitime: 0.25 },
  { id: "elu", libelle: "Élu", seuilSoutiens: 0.4, seuilOrganisation: 0.4, seuilLegitime: 0.4 },
];

// J7 : palier d'accès adossé au statut. Le joueur ne voit que son palier et les précédents.
// Palier 1 l'insignifiant, palier 5 l'élu. Jamais de saut.
export function palierDeStatut(statut: StatutCarriere): number {
  switch (statut) {
    case "employe": return 1;
    case "militant": return 2;
    case "responsable-local": return 3;
    case "conseiller": return 4;
    case "elu": return 5;
  }
}

export interface Progression {
  soutiens: number; // 0..1, ressource mobilisable
  legitime: number; // 0..1, droit à commander (M13 M14)
  organisation: number; // 0..1
  notoriete: number; // 0..1, chaleur sondagière (M22)
  reputation: number; // 0..1, mémoire de fiabilité
}

// J15 F3 : compétences construites par la répétition, jamais achetées. Hypothèse de gameplay.
export const COMPETENCES = ["terrain", "parole", "medias", "relation", "institution", "strategie"] as const;
export type CompetenceId = (typeof COMPETENCES)[number];

export const LIBELLES_COMPETENCE: Record<CompetenceId, string> = {
  terrain: "Terrain",
  parole: "Parole",
  medias: "Médias",
  relation: "Relations",
  institution: "Institutions",
  strategie: "Stratégie",
};

// Une catégorie d'action entraîne une compétence. Combinatoire assumée : peu de règles, beaucoup d'usages.
export function competenceDeCategorie(c: CategorieAction): CompetenceId {
  switch (c) {
    case "terrain": return "terrain";
    case "media": return "medias";
    case "coalition": return "relation";
    case "institution": return "institution";
    case "preparation": return "strategie";
  }
}

export interface Carriere {
  nom: string;
  origine: string;
  traits: string[];
  ideologie: { gaucheDroite: number; ouvertFerme: number }; // -1..1
  ambition: Ambition;
  statut: StatutCarriere;
  ressources: { temps: number; argent: number; audience: number; militants: number }; // 0..1
  progression: Progression;
  // J15 F2 : état intérieur. L'énergie se fatigue à chaque coup, le moral suit les échecs et la vie.
  etat: { energie: number; moral: number }; // 0..1
  competences: Record<CompetenceId, number>; // 0..1, construites par la répétition (J15 F3)
  risqueEnquete: number; // 0..1, cumul des coups risqués
  semainesMarginalise: number;
  bonusMedia: number; // micro ciblage experte IA, décroît chaque semaine
  infoPrecise: boolean; // fact-checker ou fonctionnaire, consommé au prochain regard
  contactsCroises: number; // atténuateur R1 via figure associative
  // J16 F6 : effets durables nommés. Pas un delta invisible : une trace qui pèse tant qu'elle vit.
  effetsDurees: EffetDurable[];
  // E10 (J11) : promesses à échéance datée. Manquer une échéance coûte la relation et la réputation.
  promesses: Promesse[];
  // E8 (J13 F9) : l'investiture des législatives 2027, échéance intermédiaire décidée par ton propre camp.
  investiture: "non-posee" | "obtenue" | "ratee";
  // E7 (J13) : dons de campagne tracés, personne nommée, dette enregistrée.
  dons: DonCampagne[];
}

// J16 F6 : un effet durable porte son nom, sa durée et son poids hebdomadaire, jamais une jauge muette.
export interface EffetDurable {
  id: string;
  libelle: string;
  detail: string;
  tickFin: number | null; // null = à vie
  reputationHebdo?: number; // appliqué chaque semaine tant que l'effet vit
  risqueHebdo?: number;
  surcoutTemps?: number; // ajouté au coût des actions tant que l'effet vit
}

// E10 (J11) : une promesse a un texte, une échéance et une catégorie d'action attendue.
export interface Promesse {
  id: string;
  persoId: string;
  texte: string;
  tickPrise: number;
  tickEcheance: number;
  categorieAttendue: CategorieAction;
  statut: "en-cours" | "tenue" | "manquee";
}

// E7 (J13) : un don nommé laisse une trace et une dette, jamais un +argent anonyme.
export interface DonCampagne {
  persoId: string;
  nomPerso: string;
  montant: number; // 0..1
  tick: number;
  contre: string; // la contrepartie demandée, à mémoire
}

// E4 (J13) : plus tu montes, plus chaque semaine coûte. Le bas de carrière reste bon marché.
export function coutPalier(palier: number): { temps: number; argent: number } {
  const m = 1 + 0.15 * Math.max(0, palier - 1);
  return { temps: m, argent: m };
}

// E5 (J13) : croissance de soutiens sans croissance d'organisation = dette convertie en risque.
// Hypothèse de gameplay (Rebel Inc, E5). Retourne le risque ajouté, 0 si la croissance est saine.
export function corruptionExpansion(p: Progression): number {
  const seuil = 0.12 + 2.5 * p.organisation;
  if (p.soutiens > seuil) return Math.min(0.05, (p.soutiens - seuil) * 0.3);
  return 0;
}

export const AVERTISSEMENT_OUVERTURE =
  "Simulation émergente : trajectoires possibles, jamais de prédiction du réel ni de recommandation. " +
  "Certaines trajectoires d'accession au pouvoir, y compris autoritaires, sont simulées pour être comprises, jamais proposées comme des modèles.";

// R8 J10 : la mention déontologique discrète vit ici, affichée en pied de page, jamais en écran de jeu.
export const MENTION_DISCRETE =
  "Jeu de simulation. Monde, groupes et personnages fictifs, aucune personne réelle. Les trajectoires autoritaires y sont simulées pour être comprises, jamais recommandées.";

export const ORIGINES = [
  "bureau",
  "atelier",
  "quartier-populaire",
  "province",
  "enseignant",
  "soignant",
  "commercant",
  "fonctionnaire-territorial",
  "journaliste-local",
  "agriculteur",
] as const;
export type Origine = (typeof ORIGINES)[number];

export const LIBELLES_ORIGINE: Record<Origine, string> = {
  bureau: "Employé de bureau en open space",
  atelier: "Ouvrier qualifié d'atelier",
  "quartier-populaire": "Vie de quartier populaire",
  province: "Vie de petite ville de province",
  enseignant: "Enseignant dans un collège",
  soignant: "Soignant en hôpital public",
  commercant: "Commerçant de centre-ville",
  "fonctionnaire-territorial": "Agent territorial en mairie",
  "journaliste-local": "Journaliste local indépendant",
  agriculteur: "Agriculteur en zone rurale",
};

// J9 : chaque origine porte son vecteur d'accès au pouvoir, affiché à la création et en jeu.
export const VECTEURS_ORIGINE: Record<Origine, string> = {
  bureau: "Le réseau de bureau : discrets, efficaces, invisibles. Tu avances par l'organisation.",
  atelier: "La solidarité d'atelier : les soutiens d'abord, la parole ensuite.",
  "quartier-populaire": "La rue et les associations : la légitimité du terrain.",
  province: "La petite ville : tout le monde se connaît, la réputation y vaut de l'or.",
  enseignant: "La salle de classe et les parents d'élèves : la parole qui porte.",
  soignant: "L'hôpital et le soin : la confiance des gens quand tout lâche.",
  commercant: "La boutique et les clients : le bouche à oreille quotidien.",
  "fonctionnaire-territorial": "La mairie de l'intérieur : tu connais les guichets avant les discours.",
  "journaliste-local": "Le journal local : tu sais écrire et tu connais les médias.",
  agriculteur: "La terre et le marché : l'ancrage rural que personne ne voit venir.",
};

export function vecteurOrigine(origine: Origine): string {
  return VECTEURS_ORIGINE[origine];
}

// R2 J10 : libellé du métier d'origine, affiché dans le bandeau d'identité à côté du statut.
export function libelleMetierOrigine(origine: ConfigCarriere["origine"]): string {
  const o = origine as Origine;
  return LIBELLES_ORIGINE[o] ?? String(origine);
}

export const TRAITS_JOUEUR = ["empathique", "travailleur", "bagoureux", "discret", "obstiné", "caméléon"] as const;

export interface ConfigCarriere {
  nom?: string;
  origine: Origine;
  traits: string[];
  ideologie: { gaucheDroite: number; ouvertFerme: number };
  ambition: Ambition;
  propositionTexte?: string;
}

export function creerCarriere(config: ConfigCarriere, rng: Rng): Carriere {
  return {
    nom: config.nom && config.nom.trim().length > 0 ? config.nom.trim() : nomJoueurAleatoire(rng),
    origine: config.origine,
    traits: config.traits.slice(0, 2),
    ideologie: {
      gaucheDroite: Math.max(-1, Math.min(1, config.ideologie.gaucheDroite)),
      ouvertFerme: Math.max(-1, Math.min(1, config.ideologie.ouvertFerme)),
    },
    ambition: config.ambition,
    statut: "employe",
    ressources: { temps: 1, argent: 0.2, audience: 0.05, militants: 0.05 },
    progression: { soutiens: 0.02, legitime: 0.02, organisation: 0.02, notoriete: 0.01, reputation: 0.5 },
    etat: { energie: 1, moral: 0.6 },
    competences: { terrain: 0, parole: 0, medias: 0, relation: 0, institution: 0, strategie: 0 },
    risqueEnquete: 0,
    semainesMarginalise: 0,
    bonusMedia: 0,
    infoPrecise: false,
    contactsCroises: 0,
    effetsDurees: [],
    promesses: [],
    investiture: "non-posee",
    dons: [],
  };
}

export function libelleStatut(statut: StatutCarriere): string {
  return STATUTS.find((s) => s.id === statut)!.libelle;
}

// Promotion quand les seuils du statut le plus haut atteint sont franchis.
export function statutCible(p: Progression): StatutCarriere {
  let cible: StatutCarriere = "employe";
  for (const s of STATUTS) {
    if (p.soutiens >= s.seuilSoutiens && p.organisation >= s.seuilOrganisation && p.legitime >= s.seuilLegitime) {
      cible = s.id;
    }
  }
  return cible;
}

// Persuasion du joueur : traits, notoriété, audience et compétences de parole. Bornée, hypothèse de gameplay.
export function persuasionJoueur(c: Carriere): number {
  const bonusTrait = c.traits.includes("empathique") ? 0.1 : 0;
  const bonusBagou = c.traits.includes("bagoureux") ? 0.08 : 0;
  const bonusCompetence = (c.competences?.parole ?? 0) * 0.08 + (c.competences?.relation ?? 0) * 0.04;
  return Math.min(0.9, 0.15 + c.progression.notoriete * 0.3 + c.ressources.audience * 0.3 + bonusTrait + bonusBagou + bonusCompetence);
}

// J15 F2 : efficacité de la semaine, produit énergie et moral, plancher 0.5. Jamais zéro : on force toujours.
export function efficaciteSemaine(c: Carriere): number {
  const e = c.etat?.energie ?? 1;
  const m = c.etat?.moral ?? 0.6;
  return Math.max(0.5, 0.4 + 0.4 * e + 0.2 * m);
}

// J15 F2 : un coup fatigue. Le cumul de coups forcés use le moral en plus.
export function appliquerFatigue(c: Carriere, coutTemps: number, coupForce: boolean): Carriere {
  const energie = Math.max(0, (c.etat?.energie ?? 1) - coutTemps * 0.5);
  const moral = Math.max(0, (c.etat?.moral ?? 0.6) - coutTemps * 0.05 - (coupForce ? 0.08 : 0));
  return { ...c, etat: { energie, moral } };
}

// J15 F3 : la répétition construit la compétence, deux centièmes par usage, plafond 1.
export function gagnerCompetence(c: Carriere, competence: CompetenceId): Carriere {
  const actuel = c.competences?.[competence] ?? 0;
  return { ...c, competences: { ...(c.competences ?? {}), [competence]: Math.min(1, actuel + 0.02) } };
}

// J15 F1 : la seconde étage de la semaine. Une activité, jamais la même contrainte que l'action.
export interface ActiviteSemaine {
  id: string;
  libelle: string;
  description: string;
  effets: { energie?: number; moral?: number; competence?: CompetenceId; soutiens?: number; notoriete?: number };
}

export const ACTIVITES_SEMAINE: ActiviteSemaine[] = [
  {
    id: "repos",
    libelle: "Te reposer",
    description: "Rien de politique cette semaine-là. L'énergie remonte, le moral aussi un peu.",
    effets: { energie: 0.35, moral: 0.08 },
  },
  {
    id: "proches",
    libelle: "Voir tes proches",
    description: "Ceux qui te connaissaient avant. Le moral remonte vraiment, la fatigue part.",
    effets: { energie: 0.15, moral: 0.22 },
  },
  {
    id: "associatif",
    libelle: "Soirée associative",
    description: "Des visages, des liens faibles. Un peu de soutiens, un peu de relations, un peu de fatigue.",
    effets: { energie: -0.1, moral: 0.1, competence: "relation", soutiens: 0.01 },
  },
  {
    id: "etude",
    libelle: "Lire et analyser",
    description: "Rapports, presse, archives. La stratégie progresse, l'énergie descend.",
    effets: { energie: -0.08, competence: "strategie", notoriete: 0 },
  },
];

export function activiteParId(id: string): ActiviteSemaine {
  const a = ACTIVITES_SEMAINE.find((x) => x.id === id);
  if (a === undefined) throw new Error(`Activité inconnue : ${id}`);
  return a;
}

export function appliquerActivite(c: Carriere, a: ActiviteSemaine): Carriere {
  let s = c;
  const e = s.etat ?? { energie: 1, moral: 0.6 };
  s = {
    ...s,
    etat: {
      energie: clamp01b(e.energie + (a.effets.energie ?? 0)),
      moral: clamp01b(e.moral + (a.effets.moral ?? 0)),
    },
  };
  if (a.effets.competence !== undefined) s = gagnerCompetence(s, a.effets.competence);
  if (a.effets.soutiens !== undefined) s = { ...s, progression: { ...s.progression, soutiens: clamp01b(s.progression.soutiens + a.effets.soutiens) } };
  if (a.effets.notoriete !== undefined) s = { ...s, progression: { ...s.progression, notoriete: clamp01b(s.progression.notoriete + a.effets.notoriete) } };
  return s;
}

// J16 F6 : les effets durables pèsent chaque semaine puis s'éteignent à échéance.
export function avancerEffetsDurees(c: Carriere, tick: number): Carriere {
  let risque = 0;
  let reputation = 0;
  const vivants: EffetDurable[] = [];
  for (const e of c.effetsDurees) {
    if (e.tickFin !== null && tick >= e.tickFin) continue;
    vivants.push(e);
    if (e.risqueHebdo !== undefined) risque += e.risqueHebdo;
    if (e.reputationHebdo !== undefined) reputation += e.reputationHebdo;
  }
  let s: Carriere = { ...c, effetsDurees: vivants };
  if (risque !== 0) s = { ...s, risqueEnquete: clamp01b(s.risqueEnquete + risque) };
  if (reputation !== 0) s = { ...s, progression: { ...s.progression, reputation: clamp01b(s.progression.reputation + reputation) } };
  return s;
}

// J16 F6 : surcoût de temps des actions tant qu'un effet durable le demande.
export function surcoutEffetsDurees(c: Carriere): number {
  return c.effetsDurees.reduce((s, e) => s + (e.surcoutTemps ?? 0), 0);
}

// Régénération hebdomadaire : le temps revient, l'audience et les militants s'usent, le corps récupère (J15 F2).
export function regenererHebdo(c: Carriere): Carriere {
  return {
    ...c,
    ressources: {
      temps: 1,
      argent: Math.min(1, c.ressources.argent + 0.02),
      audience: c.ressources.audience * 0.9,
      militants: c.ressources.militants * 0.95,
    },
    etat: {
      energie: clamp01b((c.etat?.energie ?? 1) + 0.4),
      moral: clamp01b((c.etat?.moral ?? 0.6) + 0.15),
    },
    bonusMedia: c.bonusMedia * 0.5,
    infoPrecise: false,
  };
}

export function clamp01b(x: number): number {
  if (Number.isNaN(x)) return 0;
  return x < 0 ? 0 : x > 1 ? 1 : x;
}
