import { describe, expect, it } from "vitest";
import { creerPartie, jouerSemaine } from "./partie.js";
import type { ConfigCarriere } from "./carriere.js";
import { tenirReunion } from "./reunions.js";
import { creerRng } from "./rng.js";
const CONFIG: ConfigCarriere = {
  nom: "Test réunions", origine: "bureau", traits: ["empathique"],
  ideologie: { gaucheDroite: 0, ouvertFerme: 0 }, ambition: "elu",
};
const ordre = { participantsIds: ["pers.elue", "pers.associative"], preparee: false };
describe("P3 C3 : réunions à participants", () => {
  it("nomme les participants, paie les coûts et date le compte rendu sans mutation", () => {
    const p = creerPartie(42, CONFIG);
    const copie = JSON.stringify(p);
    const suite = tenirReunion(p, ordre, 1, creerRng(8));
    expect(JSON.stringify(p)).toBe(copie);
    expect(suite.reunions).toHaveLength(1);
    expect(suite.reunions[0].participantsIds).toEqual(ordre.participantsIds);
    expect(suite.reunions[0].tick).toBe(1);
    expect(suite.carriere.ressources.temps).toBeCloseTo(p.carriere.ressources.temps - 0.3);
    expect(suite.carriere.ressources.argent).toBeCloseTo(p.carriere.ressources.argent - 0.02);
    for (const id of ordre.participantsIds) expect(suite.mondeSocial.evenements.some((e) => e.noeudId === id && e.type === "reunion" && e.tick === 1)).toBe(true);
  });
  it("la préparation coûte davantage et améliore le rendement à tirage identique", () => {
    const p = creerPartie(42, CONFIG);
    const brute = tenirReunion(p, ordre, 1, creerRng(8));
    const preparee = tenirReunion(p, { ...ordre, preparee: true }, 1, creerRng(8));
    expect(preparee.reunions[0].rendement).toBeGreaterThan(brute.reunions[0].rendement);
    expect(preparee.carriere.ressources.temps).toBeLessThan(brute.carriere.ressources.temps);
  });
  it("refuse les inconnus et doublons, sanctionne le manque de moyens", () => {
    const p = creerPartie(42, CONFIG);
    expect(() => tenirReunion(p, { ...ordre, participantsIds: ["absent", "pers.elue"] }, 1, creerRng(8))).toThrow();
    expect(() => tenirReunion(p, { ...ordre, participantsIds: ["pers.elue", "pers.elue"] }, 1, creerRng(8))).toThrow();
    const pauvre = { ...p, carriere: { ...p.carriere, ressources: { ...p.carriere.ressources, temps: 0, argent: 0 } } };
    const suite = tenirReunion(pauvre, ordre, 1, creerRng(8));
    expect(suite.reunions[0].forcee).toBe(true);
    expect(suite.carriere.progression.reputation).toBeLessThan(p.carriere.progression.reputation);
  });
  it("la semaine conserve la réunion une seule fois, de façon déterministe", () => {
    const p = creerPartie(42, CONFIG);
    const tour = { actionId: "preparer-silencieux", reunions: [ordre] };
    const suite = jouerSemaine(p, tour);
    expect(suite.reunions).toHaveLength(1);
    expect(jouerSemaine(p, tour)).toEqual(suite);
    expect(jouerSemaine(suite, { actionId: "preparer-silencieux" }).reunions).toEqual(suite.reunions);
  });
});
