// J3 : carte et propagation. Douze territoires types, adoption par territoire, vecteurs et réponse adverse.
// Pur sans React, seedé. Le monde existe déjà en deux groupes, la carte compose au dessus.
// J11 E6 : chaque territoire porte un enjeu dominant, l'adoption dépend du matching entre ta marque et l'enjeu.
// Boîte mail et agenda : lecture du monde, jamais de décision.
import type { DecisionIA, EvenementCausal } from "./engine.js";
export interface Territoire {
  id: string;
  nom: string;
  adoption: number; // 0..1, part du territoire qui a entendu et retenu ton idée
  vecteur: string; // bouche à oreille, militants, médias, réseaux
  reponseAdverse: number; // 0..1, vigilance qui monte avec ta visibilité
  enjeu: EnjeuTerritoire; // E6 : l'enjeu dominant local, visible sur la carte
}

const NOMS_TERRITOIRES = [
  "Centre-ville commerçant",
  "Quartier populaire nord",
  "Lotissement pavillonnaire",
  "Petite ville de province",
  "Bourg rural",
  "Village isolé",
  "Zone d'ateliers",
  "Cité universitaire",
  "Marché hebdomadaire",
  "Vallée agricole",
  "Faubourg ouvrier",
  "Station littorale",
];

const VECTEURS = ["bouche à oreille", "militants", "médias locaux", "réseaux numériques"];

// E6 (J11) : enjeux dominants inspirés de Political Machine, transposés France 2026.
export type EnjeuTerritoire = "chomage" | "usine-fermee" | "pouvoir-achat" | "securite" | "religion" | "ecologie";

export const LIBELLES_ENJEU: Record<EnjeuTerritoire, string> = {
  chomage: "le chômage",
  "usine-fermee": "l'usine fermée",
  "pouvoir-achat": "le pouvoir d'achat",
  securite: "la sécurité",
  religion: "la question religieuse",
  ecologie: "l'écologie",
};

// Matching marque-enjeu : ton positionnement accélère ou freine l'adoption locale. 0.6..1.4.
// Hypothèse de gameplay (Political Machine) : un même discours gagne un territoire et en perd un autre.
export function matchingMarqueEnjeu(
  ideologie: { gaucheDroite: number; ouvertFerme: number },
  enjeu: EnjeuTerritoire,
): number {
  const gd = ideologie.gaucheDroite; // -1 gauche, 1 droite
  const of = ideologie.ouvertFerme; // -1 ouvert, 1 fermé
  switch (enjeu) {
    case "chomage":
      return 1.15 - gd * 0.2;
    case "usine-fermee":
      return 1.1 - gd * 0.25;
    case "pouvoir-achat":
      return 1.1 - Math.abs(gd) * 0.05; // thématique transversale, peu discriminante
    case "securite":
      return 1.1 + gd * 0.2 - of * 0.15;
    case "religion":
      return 1.05 + gd * 0.25 + of * 0.25;
    case "ecologie":
      return 1.1 - gd * 0.2 + of * 0.1;
  }
}

export function territoiresInitiaux(graine: number): Territoire[] {
  let s = graine >>> 0;
  const suivant = (): number => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  const enjeux: EnjeuTerritoire[] = ["chomage", "usine-fermee", "pouvoir-achat", "securite", "religion", "ecologie"];
  return NOMS_TERRITOIRES.map((nom, n) => ({
    id: `terr.${n + 1}`,
    nom,
    adoption: 0.02 + suivant() * 0.04,
    vecteur: VECTEURS[n % VECTEURS.length],
    reponseAdverse: 0.05 + suivant() * 0.05,
    enjeu: enjeux[n % enjeux.length],
  }));
}

// L'idée se propage par vecteurs : chaque semaine, l'adoption monte avec tes soutiens et ton audience,
// la réponse adverse monte avec ta notoriété. E6 : le matching marque-enjeu module la poussée locale.
// Borné, déterministe à graine fixée. matching optionnel : 1 par défaut (comportement p2.1.0 conservé).
export function propagerTerritoires(
  territoires: Territoire[],
  soutiens: number,
  audience: number,
  notoriete: number,
  matchingParTerritoire?: number[],
): Territoire[] {
  return territoires.map((t, i) => {
    const matching = matchingParTerritoire?.[i] ?? 1;
    const poussee = (t.id.endsWith("1") || t.id.endsWith("3") ? 1.2 : 1) * matching;
    const adoption = Math.min(1, Math.max(0, t.adoption + (soutiens * 0.06 + audience * 0.04) * poussee - t.reponseAdverse * 0.01));
    const reponseAdverse = Math.min(1, Math.max(0, t.reponseAdverse + notoriete * 0.02 - 0.005));
    return { ...t, adoption, reponseAdverse };
  });
}

export function adoptionMoyenne(territoires: Territoire[]): number {
  if (territoires.length === 0) return 0;
  return territoires.reduce((s, t) => s + t.adoption, 0) / territoires.length;
}

export interface Courriel {
  tick: number;
  de: string;
  objet: string;
  corps: string;
}

export interface Echeance {
  tick: number;
  libelle: string;
}

const EXPEDITEURS: Record<string, string> = {
  "bascule-normative": "observatoire local",
  "bascule-norme": "institut de sondage",
  "demande-sauveur": "rédaction régionale",
};

export function genererCourriels(evenements: EvenementCausal[], decisions: DecisionIA[]): Courriel[] {
  const mails: Courriel[] = [];
  for (const e of evenements) {
    mails.push({
      tick: e.tick,
      de: EXPEDITEURS[e.type] ?? "couloir",
      objet: `Signal t${e.tick} chez ${e.groupeId}`,
      corps: `${e.type} : ${e.cause}. Valeur ${e.valeur.toFixed(2)}. À croiser avant d'agir.`,
    });
  }
  const miennes = decisions.filter((d) => d.acteurId === "joueur");
  if (miennes.length > 0) {
    const derniere = miennes[miennes.length - 1];
    mails.push({
      tick: derniere.tick,
      de: "ton mouvement",
      objet: `Coup t${derniere.tick} enregistré`,
      corps: `${derniere.optionId} vers ${derniere.groupeId}. Effets à lire dans les prochains sondages.`,
    });
  }
  return mails.sort((a, b) => a.tick - b.tick);
}

export function genererAgenda(tickActuel: number): Echeance[] {
  const base: Echeance[] = [
    { tick: 5, libelle: "Débat budgétaire local" },
    { tick: 10, libelle: "Sondage trimestriel" },
    { tick: 15, libelle: "Conseil municipal décisif" },
    { tick: 20, libelle: "Revue de presse nationale" },
  ];
  return base.filter((e) => e.tick >= tickActuel);
}

// J4 : sondages commandables avec coûts, biais et précision. L'écran ne montre que la vue filtrée.
export interface Sondage {
  id: string;
  libelle: string;
  coutArgent: number;
  coutTemps: number;
  biais: number; // 0..1, erreur systématique possible
  precision: string;
}

export const SONDAGES: Sondage[] = [
  { id: "sond.bar", libelle: "Tour des bars et du marché", coutArgent: 0, coutTemps: 0.1, biais: 0.25, precision: "à la louche, biaisé par tes proches" },
  { id: "sond.local", libelle: "Sondage local commandé", coutArgent: 0.08, coutTemps: 0.1, biais: 0.1, precision: "approximatif, retardé d'une semaine" },
  { id: "sond.institut", libelle: "Institut national", coutArgent: 0.2, coutTemps: 0.15, biais: 0.05, precision: "solide mais cher, contradictoire parfois" },
];

export function sondageParId(id: string): Sondage {
  const s = SONDAGES.find((x) => x.id === id);
  if (s === undefined) throw new Error(`Sondage inconnu : ${id}`);
  return s;
}
