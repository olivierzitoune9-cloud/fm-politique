import { describe, expect, it } from "vitest";
import { creerRng } from "../rng.js";
import { appliquerEuphemisme } from "./r10-euphemisme.js";
import { appliquerBoucEmissaire } from "./r11-bouc.js";
import { evaluerMarque } from "./r12-marque.js";
import { appliquerSophisme } from "./r13-sophisme.js";
import { appliquerCaution } from "./r14-caution.js";

describe("lot C", () => {
  it("R10 : euphemisme baisse le cout, devoilement le remonte", () => {
    const base = { id: "g", coutMoralPercu: 0.6 };
    const baisse = appliquerEuphemisme(base, 0.9, 0, creerRng(81), 81);
    expect(baisse.delta).toBeLessThan(0.02);
    const remonte = appliquerEuphemisme({ ...base, coutMoralPercu: baisse.etat.coutMoralPercu }, 0.2, 1, creerRng(82), 82);
    expect(remonte.etat.coutMoralPercu).toBeGreaterThan(baisse.etat.coutMoralPercu);
  });
  it("R11 : petite cible visible rend de la cohesion mais coute", () => {
    const r = appliquerBoucEmissaire({ id: "c", taille: 0.1, visibilite: 0.9, protections: 0.1, usure: 0 }, 0.8, creerRng(83), 83);
    expect(r.cohesion).toBeGreaterThan(0.3);
    const usee = appliquerBoucEmissaire({ id: "c", taille: 0.1, visibilite: 0.9, protections: 0.1, usure: 1 }, 0.8, creerRng(83), 83);
    expect(usee.cohesion).toBeLessThan(r.cohesion);
  });
  it("R12 : marque forte recrute, lecture cachee expose au decodage", () => {
    const r = evaluerMarque({ simplicite: 0.9, reproductibilite: 0.9, respectabilite: 0.7, lectureCachee: 0.8 }, 0.9, creerRng(84), 84);
    expect(r.recrutement).toBeGreaterThan(0.5);
    expect(r.risqueDecodage).toBeGreaterThan(0.4);
  });
  it("R13 : public averti et refutation cassent la persuasion", () => {
    const naif = appliquerSophisme({ sophisticationPublic: 0.1, credibiliteEmetteur: 0.8, repetition: 0.8, refutation: 0 }, creerRng(85), 85);
    const averti = appliquerSophisme({ sophisticationPublic: 0.9, credibiliteEmetteur: 0.8, repetition: 0.8, refutation: 0.9 }, creerRng(85), 85);
    expect(naif.persuasion).toBeGreaterThan(averti.persuasion);
  });
  it("R14 : caution multiplie, vigilance debunke", () => {
    const r = appliquerCaution({ permeabiliteInstitutions: 0.9, soliditeCaution: 0.8, vigilanceMedias: 0.1 }, creerRng(86), 86);
    expect(r.multiplicateur).toBeGreaterThan(1.5);
    const surveille = appliquerCaution({ permeabiliteInstitutions: 0.9, soliditeCaution: 0.2, vigilanceMedias: 1 }, creerRng(86), 86);
    expect(surveille.risqueDebunk).toBeGreaterThan(r.risqueDebunk);
  });
});
