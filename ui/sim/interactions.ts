// Interactions humaines : convaincre, promettre, demander un coup de main, trahir, recoudre.
// La mémoire (promesses, dettes, trahisons) reste et remonte dans les comportements. E6 de l'ontologie.
import { clamp01b, persuasionJoueur, type Carriere } from "./carriere.js";
import { effetHook, nomComplet, type EffetHook, type Personnage } from "./personnages.js";
import type { Rng } from "./rng.js";

export type InteractionId = "convaincre" | "promettre" | "demander-coup-de-main" | "trahir" | "recoudre";

export interface InteractionDef {
  id: InteractionId;
  libelle: string;
  description: string;
  coutTemps: number;
}

export const INTERACTIONS: InteractionDef[] = [
  {
    id: "convaincre",
    libelle: "Convaincre",
    description: "Un café, un argument, sa propre liseuse. Ça dépend de ta persuasion et de votre relation.",
    coutTemps: 0.25,
  },
  {
    id: "promettre",
    libelle: "Promettre",
    description: "Une promesse enregistrée. Tu la tiendras ou elle te suivra.",
    coutTemps: 0.2,
  },
  {
    id: "demander-coup-de-main",
    libelle: "Demander un coup de main",
    description: "Son métier pour toi, contre une dette enregistrée. Refus si tu l'as déjà trahi.",
    coutTemps: 0.25,
  },
  {
    id: "trahir",
    libelle: "Trahir",
    description: "Gain immédiat, cicatrice durable. Le monde le saura à sa façon.",
    coutTemps: 0.2,
  },
  {
    id: "recoudre",
    libelle: "Recoudre",
    description: "Réparer avec du temps et de l'argent. Une cicatrice se fond, elle ne disparaît pas.",
    coutTemps: 0.35,
  },
];

export function interactionParId(id: string): InteractionDef {
  const i = INTERACTIONS.find((x) => x.id === id);
  if (i === undefined) throw new Error(`Interaction inconnue : ${id}`);
  return i;
}

type MemoirePersoLike = Personnage["memoire"][number]["type"];

export interface ResultatInteraction {
  perso: Personnage;
  message: string;
  effet: EffetHook | null;
  reussi: boolean;
  coutTemps: number;
}

function ajouterMemoire(p: Personnage, type: MemoirePersoLike, gravite: number, tick: number, detail: string): Personnage {
  return { ...p, memoire: [...p.memoire, { type, gravite, tick, detail }] };
}

function borner01(x: number): number {
  return Math.max(0, Math.min(1, x));
}

function clampRel(x: number): number {
  return Math.max(-1, Math.min(1, Math.round(x * 100) / 100));
}

export function appliquerInteraction(
  carriere: Carriere,
  perso: Personnage,
  interactionId: InteractionId,
  tick: number,
  rng: Rng,
  graine: number,
  promesse?: string,
): { carriere: Carriere; perso: Personnage; resultat: ResultatInteraction } {
  const def = interactionParId(interactionId);
  const tirage = rng.next();
  void graine;
  const bruit = (tirage - 0.5) * 0.2;
  let persoSuivant = perso;
  const carriereSuivante: Carriere = { ...carriere };
  let resultat: ResultatInteraction;

  switch (interactionId) {
    case "convaincre": {
      const trahisons = perso.memoire.filter((m) => m.type === "trahison").length;
      const base = persuasionJoueur(carriere) * 0.5 + ((perso.relation + 1) / 2) * 0.5 - trahisons * 0.15;
      const reussi = borner01(base + bruit) > 0.5;
      persoSuivant = reussi
        ? { ...perso, relation: clampRel(perso.relation + 0.12) }
        : ajouterMemoire({ ...perso, relation: clampRel(perso.relation - 0.04) }, "attaque", 0.2, tick, "insistance mal placée");
      resultat = {
        perso: persoSuivant,
        message: reussi
          ? `${nomComplet(perso)} te réécoute. La relation monte.`
          : `${nomComplet(perso)} a jugé ton argument à la hausse et t'a cru naïf.`,
        effet: null,
        reussi,
        coutTemps: def.coutTemps,
      };
      break;
    }
    case "promettre": {
      const detail = promesse && promesse.trim().length > 0 ? promesse.trim() : "soutien contre soutien";
      persoSuivant = ajouterMemoire(perso, "promesse", 0.4, tick, detail);
      persoSuivant = { ...persoSuivant, relation: clampRel(perso.relation + 0.08) };
      resultat = {
        perso: persoSuivant,
        message: `Promesse enregistrée auprès de ${nomComplet(perso)} : ${detail}. Elle te suivra.`,
        effet: null,
        reussi: true,
        coutTemps: def.coutTemps,
      };
      break;
    }
    case "demander-coup-de-main": {
      const trahison = perso.memoire.some((m) => m.type === "trahison" && m.gravite >= 0.5);
      if (trahison) {
        resultat = {
          perso,
          message: `${nomComplet(perso)} ne te salue plus. Les trahisons ne s'effacent pas en demandant.`,
          effet: null,
          reussi: false,
          coutTemps: def.coutTemps * 0.5,
        };
        break;
      }
      const base = ((perso.relation + 1) / 2) * 0.6 + 0.1 + bruit * 0.5;
      if (borner01(base) < 0.35) {
        persoSuivant = ajouterMemoire(perso, "attaque", 0.1, tick, "demande refusée");
        resultat = {
          perso: persoSuivant,
          message: `${nomComplet(perso)} décline. La relation n'est pas assez solide.`,
          effet: null,
          reussi: false,
          coutTemps: def.coutTemps,
        };
        break;
      }
      const effet = effetHook(perso.metier);
      persoSuivant = ajouterMemoire(perso, "dette", 0.5, tick, effet.detail);
      persoSuivant = { ...persoSuivant, relation: clampRel(perso.relation + 0.05) };
      if (effet.caution) {
        persoSuivant = { ...persoSuivant, cautionActive: { jusqua: tick + 4, multiplicateur: 1.5 + perso.expertise } };
      }
      resultat = {
        perso: persoSuivant,
        message: `${nomComplet(perso)} répond : ${effet.detail}. Tu lui dois.`,
        effet,
        reussi: true,
        coutTemps: def.coutTemps,
      };
      break;
    }
    case "trahir": {
      persoSuivant = ajouterMemoire({ ...perso, relation: -0.6 }, "trahison", 0.8, tick, "utilisé puis abandonné");
      carriereSuivante.progression = {
        ...carriereSuivante.progression,
        notoriete: clamp01b(carriereSuivante.progression.notoriete + 0.06),
        reputation: clamp01b(carriereSuivante.progression.reputation - 0.08),
      };
      resultat = {
        perso: persoSuivant,
        message: `${nomComplet(perso)} le saura. Ton nom monte, ta parole descend.`,
        effet: null,
        reussi: true,
        coutTemps: def.coutTemps,
      };
      break;
    }
    case "recoudre": {
      const trahisons = perso.memoire.filter((m) => m.type === "trahison");
      if (trahisons.length === 0) {
        persoSuivant = { ...perso, relation: clampRel(perso.relation + 0.05) };
        resultat = {
          perso: persoSuivant,
          message: `${nomComplet(perso)} apprécie le geste. Aucune cicatrice ici.`,
          effet: null,
          reussi: true,
          coutTemps: def.coutTemps,
        };
        break;
      }
      const amorcees = perso.memoire.map((m) =>
        m.type === "trahison" ? { ...m, gravite: Math.max(0.2, m.gravite * 0.5) } : m,
      );
      persoSuivant = { ...perso, relation: clampRel(perso.relation + 0.15), memoire: amorcees };
      carriereSuivante.ressources = {
        ...carriereSuivante.ressources,
        argent: clamp01b(carriereSuivante.ressources.argent - 0.05),
      };
      resultat = {
        perso: persoSuivant,
        message: `Tu as recousu avec ${nomComplet(perso)}. La cicatrice reste, plus douce.`,
        effet: null,
        reussi: true,
        coutTemps: def.coutTemps,
      };
      break;
    }
  }

  return { carriere: carriereSuivante, perso: persoSuivant, resultat };
}