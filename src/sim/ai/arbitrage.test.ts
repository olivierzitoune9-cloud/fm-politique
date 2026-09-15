import { describe, expect, it } from "vitest";
import { creerRng } from "../rng.js";
import { arbitrer, OPTIONS_PROTOTYPE, type PoidsObjectifs } from "./arbitrage.js";

const POIDS_EQUILIBRE: PoidsObjectifs = {
  popularite: 0.5,
  coalition: 0.5,
  base: 0.5,
  institution: 0.5,
  ressources: 0.5,
  risque: 0.5,
};

describe("IA arbitrage", () => {
  it("déterministe à seed égal", () => {
    const ctx = { id: "a", ambition: 0.6, aversionRisque: 0.4, croyances: {} };
    const a = arbitrer(ctx, POIDS_EQUILIBRE, OPTIONS_PROTOTYPE, creerRng(5), 5);
    const b = arbitrer(ctx, POIDS_EQUILIBRE, OPTIONS_PROTOTYPE, creerRng(5), 5);
    expect(a.optionId).toBe(b.optionId);
    expect(a.journal).toHaveLength(1);
  });

  it("poids différents peuvent changer le choix", () => {
    const ctx = { id: "a", ambition: 0.6, aversionRisque: 0.4, croyances: {} };
    const prudent: PoidsObjectifs = { ...POIDS_EQUILIBRE, risque: 1, coalition: 0.9 };
    const fonceur: PoidsObjectifs = { ...POIDS_EQUILIBRE, risque: 0.1, popularite: 1 };
    const choixPrudent = arbitrer(ctx, prudent, OPTIONS_PROTOTYPE, creerRng(6), 6);
    const choixFonceur = arbitrer(ctx, fonceur, OPTIONS_PROTOTYPE, creerRng(6), 6);
    expect(choixPrudent.utilites).not.toEqual(choixFonceur.utilites);
  });

  it("pas de règle rigide : même popularité, contextes différents", () => {
    const ctxCalme = { id: "a", ambition: 0.3, aversionRisque: 0.9, croyances: {} };
    const ctxAmbitieux = { id: "b", ambition: 0.9, aversionRisque: 0.1, croyances: {} };
    const poidsRisque: PoidsObjectifs = { ...POIDS_EQUILIBRE, risque: 1 };
    const calme = arbitrer(ctxCalme, poidsRisque, OPTIONS_PROTOTYPE, creerRng(7), 7);
    const ambitieux = arbitrer(ctxAmbitieux, poidsRisque, OPTIONS_PROTOTYPE, creerRng(7), 7);
    // Les utilités diffèrent car ambition et aversion modulent le coût du risque.
    expect(calme.utilites["etiquetage-agressif"]).toBeLessThan(ambitieux.utilites["etiquetage-agressif"]);
  });

  it("journal explicite : toutes les utilités exposées", () => {
    const ctx = { id: "a", ambition: 0.5, aversionRisque: 0.5, croyances: {} };
    const r = arbitrer(ctx, POIDS_EQUILIBRE, OPTIONS_PROTOTYPE, creerRng(8), 8);
    expect(Object.keys(r.utilites)).toHaveLength(OPTIONS_PROTOTYPE.length);
  });
});
