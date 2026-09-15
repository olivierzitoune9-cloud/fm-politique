// Phase 8. IA des acteurs : arbitrages explicites, jamais de génération libre.
// Chaque acteur poursuit ses objectifs propres avec ses croyances propres.
// Utilités explicites et journalisées, tirage seedé. Pas de règle popularité > 50 donc X.
import { clamp01, type Rng } from "../rng.js";
import type { JournalTirage } from "../types.js";

export type ObjectifId =
  | "popularite"
  | "coalition"
  | "base"
  | "institution"
  | "ressources"
  | "risque";

export interface PoidsObjectifs {
  popularite: number;
  coalition: number;
  base: number;
  institution: number;
  ressources: number;
  risque: number;
}

export interface OptionAction {
  id: string;
  // Effets attendus par objectif, en -1..1 selon les croyances de l'acteur.
  effets: Record<ObjectifId, number>;
}

export interface ContexteActeur {
  id: string;
  ambition: number;
  aversionRisque: number;
  croyances: Record<string, number>;
}

export interface ChoixIA {
  optionId: string;
  utilites: Record<string, number>;
  journal: JournalTirage[];
}

function utiliteOption(option: OptionAction, poids: PoidsObjectifs, ctx: ContexteActeur): number {
  const borne = (x: number) => Math.max(-1, Math.min(1, x));
  // Le risque est un coût : aversion au risque le pénalise, ambition le relativise.
  const risque = borne(option.effets.risque) * (0.5 + clamp01(ctx.aversionRisque)) * (1.2 - clamp01(ctx.ambition) * 0.5);
  return (
    borne(option.effets.popularite) * clamp01(poids.popularite) +
    borne(option.effets.coalition) * clamp01(poids.coalition) +
    borne(option.effets.base) * clamp01(poids.base) +
    borne(option.effets.institution) * clamp01(poids.institution) +
    borne(option.effets.ressources) * clamp01(poids.ressources) -
    risque * clamp01(poids.risque)
  );
}

export const OPTIONS_PROTOTYPE: OptionAction[] = [
  {
    id: "preparer-silencieux",
    effets: { popularite: 0, coalition: 0.1, base: 0.1, institution: 0, ressources: 0.3, risque: 0.05 },
  },
  {
    id: "etiquetage-modere",
    effets: { popularite: 0.2, coalition: 0, base: 0.3, institution: 0, ressources: 0, risque: 0.2 },
  },
  {
    id: "etiquetage-agressif",
    effets: { popularite: 0.35, coalition: -0.3, base: 0.5, institution: -0.1, ressources: 0, risque: 0.6 },
  },
  {
    id: "chercher-coalition",
    effets: { popularite: 0.05, coalition: 0.5, base: -0.1, institution: 0.1, ressources: -0.1, risque: 0.15 },
  },
  {
    id: "attaquer-institution",
    effets: { popularite: 0.15, coalition: -0.2, base: 0.3, institution: -0.4, ressources: 0.1, risque: 0.7 },
  },
];

export function arbitrer(
  ctx: ContexteActeur,
  poids: PoidsObjectifs,
  options: OptionAction[],
  rng: Rng,
  graine: number,
): ChoixIA {
  const journal: JournalTirage[] = [];
  const tirage = rng.next();
  journal.push({ regle: "IA-arbitrage", graine, rang: rng.tirageRang, valeur: tirage });
  const utilites: Record<string, number> = {};
  for (const o of options) {
    // Petit bruit seedé : à utilités proches, le contexte et le hasard tranchent, jamais une règle rigide.
    const bruit = (tirage - 0.5) * 0.02;
    utilites[o.id] = utiliteOption(o, poids, ctx) + bruit;
  }
  let meilleur = options[0].id;
  for (const o of options) {
    if (utilites[o.id] > utilites[meilleur]) meilleur = o.id;
  }
  return { optionId: meilleur, utilites, journal };
}
