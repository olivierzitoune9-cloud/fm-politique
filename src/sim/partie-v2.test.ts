import { describe, expect, it } from "vitest";
import { creerPartie, evaluerFins, jouerSemaine, vuePartie, type Partie } from "./partie.js";
import { deserialiser, serialiser } from "./sauvegarde.js";
import { tickDeDate } from "./temps.js";
import type { ConfigCarriere } from "./carriere.js";

const CONFIG: ConfigCarriere = {
  nom: "Test Personne",
  origine: "bureau",
  traits: ["empathique"],
  ideologie: { gaucheDroite: 0, ouvertFerme: 0 },
  ambition: "proposition",
  propositionTexte: "conscription du conseil citoyen",
};

function partir(graine = 42): Partie {
  return creerPartie(graine, CONFIG);
}

describe("partie V2 : monde qui vit", () => {
  it("proposition créée avec ton texte, économie affichée avec source", () => {
    const vue = vuePartie(partir());
    expect(vue.proposition.texte).toBe("conscription du conseil citoyen");
    expect(vue.proposition.dicibilite["grp.centre"]).toBe(0.15);
    expect(vue.medias).toHaveLength(3);
    expect(vue.chomage).toBe(8.2);
    expect(vue.sourceChomage).toContain("Insee");
    expect(vue.relationsPartis["parti.radical"]).toBe(0);
  });

  it("pousser la proposition monte la dicibilité, journal écrit", () => {
    const p = jouerSemaine(partir(), { actionId: "tractage-marche", pousserProposition: true });
    expect(p.proposition.dicibilite["grp.centre"]).toBeGreaterThan(0.15);
    expect(p.journal.some((j) => j.texte.includes("Proposition"))).toBe(true);
  });

  it("action R9 pousse automatiquement la proposition", () => {
    const p = jouerSemaine(partir(), { actionId: "promo-proposition" });
    expect(p.proposition.dicibilite["grp.centre"]).toBeGreaterThan(0.15);
  });

  it("média routé : le quotidien régional fait peser du fact checking, journal le dit", () => {
    const p = jouerSemaine(partir(), { actionId: "interview-radio", mediaId: "med.quotidien-regional" });
    expect(p.journal.some((j) => j.texte.includes("Quotidien régional"))).toBe(true);
    expect(p.carriere.risqueEnquete).toBeGreaterThanOrEqual(0);
    const flux = jouerSemaine(partir(), { actionId: "interview-radio", mediaId: "med.flux-numerique" });
    expect(JSON.stringify(flux.carriere)).not.toBe(JSON.stringify(p.carriere));
  });

  it("manoeuvres des partis dans le journal, relations bougent avec l'agressif", () => {
    const p = jouerSemaine(partir(), { actionId: "etiquetage-agressif" });
    expect(p.journal.some((j) => j.texte.includes("(Alliance parlementaire (fictif))") || j.texte.includes("Front de l'ordre"))).toBe(true);
    expect(p.relationsPartis["parti.modere"]).toBeLessThan(0);
    expect(p.relationsPartis["parti.radical"]).toBeGreaterThan(0);
  });

  it("fin proposition : dicibilité et légitimité suffisantes", () => {
    const p = partir();
    p.carriere.progression.legitime = 0.6;
    p.proposition.dicibilite = { "grp.centre": 0.7, "grp.peripherie": 0.7 };
    expect(evaluerFins(p.carriere, 20, 0.7)?.id).toBe("proposition-imposee");
    expect(evaluerFins(p.carriere, 20, 0.5)).toBeNull();
  });

  it("calibration V2 : 40 parties de 24 semaines restent bornées", () => {
    const actions = ["tractage-marche", "promo-proposition", "interview-radio", "preparer-silencieux", "etiquetage-modere", "designer-bouc"];
    for (let graine = 1; graine <= 40; graine += 1) {
      let p = partir(graine);
      for (let i = 0; i < 24 && p.fin === null; i += 1) {
        p = jouerSemaine(p, { actionId: actions[(graine + i) % actions.length], mediaId: graine % 2 === 0 ? "med.radio-matin" : "med.quotidien-regional" });
        const pr = p.carriere.progression;
        for (const v of [pr.soutiens, pr.legitime, pr.organisation, pr.notoriete, pr.reputation, p.carriere.risqueEnquete]) {
          expect(Number.isNaN(v)).toBe(false);
          expect(v).toBeGreaterThanOrEqual(0);
          expect(v).toBeLessThanOrEqual(1);
        }
        expect(dicibiliteBornee(p)).toBe(true);
      }
    }
  });

  it("sauvegarde V2 aller-retour", () => {
    const p = jouerSemaine(partir(), { actionId: "promo-proposition" });
    expect(deserialiser(serialiser(p))).toEqual(p);
  });
});

function dicibiliteBornee(p: Partie): boolean {
  return Object.values(p.proposition.dicibilite).every((v) => v >= 0 && v <= 1);
}
