import { describe, expect, it } from "vitest";
import { creerRng } from "../rng.js";
import { arbitrerVoie } from "./r15-voie-legale.js";
import { appliquerTranche } from "./r16-salami.js";
import { appliquerLevierArmee } from "./r17-armee.js";
import { appliquerChoc } from "./r18-choc.js";
import { appliquerSoupape } from "./r19-soupape.js";
import { appliquerRally } from "./r20-rally.js";
import { appliquerCulte } from "./r21-culte.js";
import { appliquerPreparation } from "./r22-preparation.js";

describe("lot D", () => {
  it("R15 : surveillance forte pousse vers la voie légale", () => {
    let legaux = 0;
    for (let g = 0; g < 50; g += 1) {
      const r = arbitrerVoie({ surveillance: 0.9, legitimiteBonus: 0.7, coutRepression: 0.8, soutienInternational: 0 }, creerRng(g + 500), g + 500);
      if (r.choixLegal) legaux += 1;
    }
    expect(legaux).toBeGreaterThan(25);
  });
  it("R16 : tranche fine discrète, institutions fortes résistent", () => {
    const faible = appliquerTranche({ id: "i", autonomie: 0.6, cohesion: 0.9 }, 0.3, 0.9, creerRng(501), 501);
    expect(faible.etat.autonomie).toBeGreaterThan(0.55);
    const discret = appliquerTranche({ id: "i", autonomie: 0.6, cohesion: 0.2 }, 0.3, 0.1, creerRng(501), 501);
    expect(discret.discret).toBe(true);
  });
  it("R17 : misère et humiliation font monter le risque putsch", () => {
    const calme = appliquerLevierArmee({ id: "a", loyaute: 0.8, misere: 0, humiliation: 0 }, 0.5, 0.2, 0.5, creerRng(502), 502);
    const crise = appliquerLevierArmee({ id: "a", loyaute: 0.3, misere: 1, humiliation: 1 }, 0, 0.8, 0, creerRng(502), 502);
    expect(crise.risquePutsch).toBeGreaterThan(calme.risquePutsch);
  });
  it("R18 : choc sous peur ouvre l exception, cliquet si institutions faibles", () => {
    const r = appliquerChoc({ id: "e", acceptation: 0.2, institutionsRestantes: 0.3 }, 0.9, 0.8, creerRng(503), 503);
    expect(r.etat.acceptation).toBeGreaterThan(0.2);
    const fort = appliquerChoc({ id: "e", acceptation: 0.8, institutionsRestantes: 0.2 }, 1, 1, creerRng(503), 503);
    expect(fort.cliquet).toBe(true);
  });
  it("R19 : soupape fait baisser la rue mais délègitime lentement", () => {
    const r = appliquerSoupape({ id: "c", rue: 0.7, delegitimation: 0.2 }, 0.8, 0.2, creerRng(504), 504);
    expect(r.etat.rue).toBeLessThan(0.7);
    expect(r.etat.delegitimation).toBeGreaterThanOrEqual(0.2);
  });
  it("R20 : pic puis décroissance, issue compte", () => {
    const victoire = appliquerRally({ id: "s", soutien: 0.6 }, 1, 1, 1, creerRng(505), 505);
    const defaite = appliquerRally({ id: "s", soutien: 0.6 }, 1, 20, 0, creerRng(505), 505);
    expect(victoire.etat.soutien).toBeGreaterThan(defaite.etat.soutien);
  });
  it("R21 : culte concentre et fragilise", () => {
    const r = appliquerCulte({ id: "p", concentrationImage: 0.4, fragiliteSuccession: 0.2 }, 0.9, creerRng(506), 506);
    expect(r.etat.concentrationImage).toBeGreaterThan(0.4);
    expect(r.etat.fragiliteSuccession).toBeGreaterThan(0.2);
  });
  it("R22 : préparation construit, surexposition guette", () => {
    const r = appliquerPreparation({ id: "a", ressources: 0.2, visibilite: 0.1 }, 0.8, creerRng(507), 507);
    expect(r.etat.ressources).toBeGreaterThan(0.2);
    expect(r.etat.visibilite).toBeGreaterThan(0.1);
  });
});
