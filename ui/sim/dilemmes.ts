// J16 F4 / J17 F8 / J11 E9 : les dilemmes.
// Un carrefour n'est pas une récompense : deux ou trois réponses, résultat pondéré par
// compétences, traits du personnage visé et contexte, effet révélé dans le journal avec retard,
// jamais chiffré avant. Aucune chaîne scriptée : les dilemmes naissent des conditions du monde.
import type { Carriere, EffetDurable, Promesse } from "./carriere.js";
import type { Monde } from "./engine.js";
import { nomComplet, poidsTraits, type Personnage } from "./personnages.js";
import type { Rng } from "./rng.js";
import { tickDeDate } from "./temps.js";

export interface OptionDilemme {
  id: string;
  libelle: string;
  // effets de réussite et d'échec, bornés 0..1 côté orchestrateur. Pondérés par compétences.
  effets: { champ: string; valeur: number }[];
  effetsEchec: { champ: string; valeur: number }[];
}

export interface Dilemme {
  id: string; // id de catalogue, déclenché au plus une fois par partie
  titre: string;
  texte: string;
  tick: number;
  origine: "monde" | "calendrier" | "organisation" | "reputation";
  persoId?: string;
  competence: "terrain" | "parole" | "medias" | "relation" | "institution" | "strategie";
  options: OptionDilemme[];
}

export interface EffetsDelta {
  soutiens?: number;
  organisation?: number;
  notoriete?: number;
  legitime?: number;
  reputation?: number;
  risque?: number;
  argent?: number;
  audience?: number;
}

export interface ResolutionDilemme {
  perso: Personnage | undefined;
  texteChoix: string; // journalisé tout de suite, qualitatif
  delta: EffetsDelta;
  effetDurable: EffetDurable | null; // F6 : tout échec partiel laisse une trace nommée
}

interface ModeleDilemme {
  id: string;
  titre: string;
  texte: string;
  origine: Dilemme["origine"];
  persoMetier?: Personnage["metier"];
  competence: Dilemme["competence"];
  condition: (c: Carriere, monde: Monde, tick: number) => boolean;
  options: OptionDilemme[];
}

const CATALOGUE: ModeleDilemme[] = [
  {
    id: "dil.bascule",
    titre: "La bascule",
    texte:
      "Le journal de quartier titre sur la peur qui monte. On t'attend au tournant : surfer sur l'inquiétude ou tenir ta ligne ?",
    origine: "monde",
    competence: "parole",
    condition: (_c, monde, tick) => monde.evenements.some((e) => e.tick === tick - 1 && e.type === "bascule-normative"),
    options: [
      {
        id: "surfer",
        libelle: "Surfer sur la peur",
        effets: [
          { champ: "soutiens", valeur: 0.06 },
          { champ: "notoriete", valeur: 0.05 },
          { champ: "risque", valeur: 0.04 },
        ],
        effetsEchec: [
          { champ: "soutiens", valeur: 0.01 },
          { champ: "reputation", valeur: -0.05 },
        ],
      },
      {
        id: "ligne",
        libelle: "Tenir ta ligne",
        effets: [
          { champ: "legitime", valeur: 0.04 },
          { champ: "reputation", valeur: 0.03 },
        ],
        effetsEchec: [{ champ: "notoriete", valeur: -0.01 }],
      },
    ],
  },
  {
    id: "dil.sauveur",
    titre: "On te demande un sauveur",
    texte:
      "La rédaction régionale cherche une voix neuve pour une tribune sur le mécontentement. La place est tentante, la tenue fragile.",
    origine: "monde",
    persoMetier: "journaliste",
    competence: "medias",
    condition: (_c, monde, tick) => monde.evenements.some((e) => e.tick === tick - 1 && e.type === "demande-sauveur"),
    options: [
      {
        id: "enfler",
        libelle: "Enfler la cape",
        effets: [
          { champ: "notoriete", valeur: 0.07 },
          { champ: "audience", valeur: 0.06 },
          { champ: "risque", valeur: 0.05 },
        ],
        effetsEchec: [
          { champ: "notoriete", valeur: 0.02 },
          { champ: "reputation", valeur: -0.04 },
        ],
      },
      {
        id: "retenue",
        libelle: "Accepter avec retenue",
        effets: [
          { champ: "notoriete", valeur: 0.03 },
          { champ: "legitime", valeur: 0.03 },
        ],
        effetsEchec: [],
      },
      {
        id: "refuser",
        libelle: "Refuser la tribune",
        effets: [{ champ: "reputation", valeur: 0.02 }],
        effetsEchec: [{ champ: "notoriete", valeur: -0.01 }],
      },
    ],
  },
  {
    id: "dil.voeux",
    titre: "Les vœux de janvier",
    texte: "C'est la saison des promesses : tout le monde écoutera tes vœux, et personne n'oubliera ce que tu dis ce soir.",
    origine: "calendrier",
    competence: "parole",
    condition: (_c, _monde, tick) => tick === tickDeDate(2027, 1, 4),
    options: [
      {
        id: "gros",
        libelle: "Promettre gros",
        effets: [
          { champ: "soutiens", valeur: 0.05 },
          { champ: "notoriete", valeur: 0.04 },
          { champ: "risque", valeur: 0.03 },
        ],
        effetsEchec: [{ champ: "reputation", valeur: -0.03 }],
      },
      {
        id: "prudent",
        libelle: "Rester prudent",
        effets: [{ champ: "legitime", valeur: 0.02 }],
        effetsEchec: [],
      },
    ],
  },
  {
    id: "dil.escalade",
    titre: "Ton antenne veut escalader",
    texte:
      "Ton organisation locale s'impatiente : elle veut un coup d'éclat contre l'institution, sans toi derrière. La laisser faire, c'est ne plus la contrôler.",
    origine: "organisation",
    competence: "strategie",
    condition: (c) => c.progression.organisation > 0.5 && c.progression.notoriete > 0.2,
    options: [
      {
        id: "laisser",
        libelle: "Les laisser faire",
        effets: [
          { champ: "notoriete", valeur: 0.05 },
          { champ: "organisation", valeur: 0.03 },
          { champ: "risque", valeur: 0.06 },
        ],
        effetsEchec: [
          { champ: "organisation", valeur: -0.03 },
          { champ: "reputation", valeur: -0.04 },
        ],
      },
      {
        id: "freiner",
        libelle: "Freiner l'antenne",
        effets: [{ champ: "legitime", valeur: 0.03 }],
        effetsEchec: [{ champ: "organisation", valeur: -0.02 }],
      },
    ],
  },
  {
    id: "dil.passe",
    titre: "On fouille ton passé",
    texte:
      "Un journaliste remonte ton parcours : un vieux propos, un ancien employeur, une amitié embarrassante. Le nier, le plaquer, le traverser ?",
    origine: "reputation",
    persoMetier: "journaliste",
    competence: "medias",
    condition: (c) => c.progression.reputation < 0.45 && c.progression.notoriete > 0.15,
    options: [
      {
        id: "plaque",
        libelle: "Plaquer tout démenti",
        effets: [{ champ: "reputation", valeur: 0.04 }],
        effetsEchec: [
          { champ: "reputation", valeur: -0.06 },
          { champ: "risque", valeur: 0.04 },
        ],
      },
      {
        id: "traverser",
        libelle: "Assumer et traverser",
        effets: [
          { champ: "reputation", valeur: 0.02 },
          { champ: "notoriete", valeur: 0.02 },
        ],
        effetsEchec: [{ champ: "reputation", valeur: -0.02 }],
      },
    ],
  },
];
// F4/F8 : les dilemmes naissent des conditions du monde, jamais d'un aléa gratuit.
// Le persoId est lié ici, avec la liste des personnages, plutôt que dans le catalogue.
export function genererDilemmes(
  tick: number,
  monde: Monde,
  carriere: Carriere,
  personnages: Personnage[],
  passes: string[],
): Dilemme[] {
  const sortis: Dilemme[] = [];
  for (const m of CATALOGUE) {
    if (passes.includes(m.id)) continue;
    if (m.condition(carriere, monde, tick)) {
      const perso = m.persoMetier !== undefined ? personnages.find((p) => p.metier === m.persoMetier) : undefined;
      sortis.push({
        id: m.id,
        titre: m.titre,
        texte: m.texte,
        tick,
        origine: m.origine,
        persoId: perso?.id,
        competence: m.competence,
        options: m.options,
      });
    }
  }
  return sortis;
}

// E9/F4 : résolution pondérée. Compétence du joueur, traits du personnage visé, bruit seedé.
// Le résultat tombe en texte qualitatif : les chiffres, on les lira plus tard dans les faits.
export function resoudreDilemme(
  dilemme: Dilemme,
  optionId: string,
  carriere: Carriere,
  perso: Personnage | undefined,
  tick: number,
  rng: Rng,
): ResolutionDilemme {
  const option = dilemme.options.find((o) => o.id === optionId);
  if (option === undefined) throw new Error(`Option de dilemme inconnue : ${optionId}`);
  const competence = carriere.competences[dilemme.competence] ?? 0;
  const poids = perso !== undefined ? poidsTraits(perso, carriere.progression.notoriete) : null;
  const bruit = (rng.next() - 0.5) * 0.3;
  const base = 0.35 + competence * 0.35 + (poids !== null ? poids.convaincre * 0.4 : 0);
  const reussi = base + bruit > 0.45;
  const spec = reussi ? option.effets : option.effetsEchec;
  const amplitude = reussi ? 1 : 0.6; // un échec partiel ne paie pas tout, mais paie mal
  const delta: EffetsDelta = {};
  for (const e of spec) {
    (delta as Record<string, number>)[e.champ] = (e.valeur as number) * amplitude;
  }
  let texteChoix: string;
  if (reussi) {
    texteChoix = `${dilemme.titre} : ${option.libelle.toLowerCase()}. Le choix paie, au moins en apparence.`;
  } else {
    texteChoix = `${dilemme.titre} : ${option.libelle.toLowerCase()}. Le choix laisse un goût de mauvaise semaine.`;
  }
  let effetDurable: EffetDurable | null = null;
  if (!reussi && perso !== undefined) {
    effetDurable = {
      id: `dil.${dilemme.id}.porte`,
      libelle: `Porte entrouverte fermée chez ${nomComplet(perso)}`,
      detail: `Ton choix sur « ${dilemme.titre} » l'a déçu. Il prête moins l'oreille tant que ça se sait.`,
      tickFin: tick + 10,
      reputationHebdo: -0.008,
    };
  }
  return { perso, texteChoix, delta, effetDurable };
}

// E10 : un dilemme peut contracter une promesse à échéance (les vœux, par exemple).
export function promesseDepuisDilemme(
  dilemme: Dilemme,
  optionId: string,
  persoId: string | undefined,
  tick: number,
): Promesse | null {
  if (dilemme.id !== "dil.voeux" || optionId !== "gros" || persoId === undefined) return null;
  return {
    id: `prom.dil.${tick}`,
    persoId,
    texte: "les promesses des vœux de janvier",
    tickPrise: tick,
    tickEcheance: tick + 10,
    categorieAttendue: "terrain",
    statut: "en-cours",
  };
}