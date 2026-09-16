import { describe, expect, it } from "vitest";
import { ACTIONS_JEU, actionParId } from "./actions.js";
import { creerRng } from "./rng.js";
import { creerCarriere, LIBELLES_ORIGINE, ORIGINES, vecteurOrigine, type ConfigCarriere } from "./carriere.js";

describe("catalogue d'actions hebdo", () => {
  it("dix-huit actions, catégories couvertes, ids uniques", () => {
    expect(ACTIONS_JEU.length).toBeGreaterThanOrEqual(17);
    const ids = new Set(ACTIONS_JEU.map((a) => a.id));
    expect(ids.size).toBe(ACTIONS_JEU.length);
    const cats = new Set(ACTIONS_JEU.map((a) => a.categorie));
    for (const c of ["terrain", "media", "coalition", "institution", "preparation"]) {
      expect(cats.has(c as never)).toBe(true);
    }
  });

  it("J7 : chaque action porte un palier 1..5, le palier 1 n'a ni partis ni institutions lourdes", () => {
    for (const a of ACTIONS_JEU) {
      expect(a.palier).toBeGreaterThanOrEqual(1);
      expect(a.palier).toBeLessThanOrEqual(5);
    }
    const p1 = ACTIONS_JEU.filter((a) => a.palier <= 1).map((a) => a.id);
    expect(p1).toContain("tractage-marche");
    expect(p1).toContain("preparer-silencieux");
    expect(p1).not.toContain("attaquer-institution");
    expect(p1).not.toContain("designer-bouc");
  });

  it("coûts bornés et cohérents, au moins une action par règle R1 R2 R12 R14 via personnages R15 R22", () => {
    for (const a of ACTIONS_JEU) {
      expect(a.coutTemps).toBeGreaterThan(0);
      expect(a.coutTemps).toBeLessThanOrEqual(0.5);
      expect(a.coutArgent).toBeGreaterThanOrEqual(0);
      expect(a.coutArgent).toBeLessThanOrEqual(0.15);
    }
    const regles = new Set(ACTIONS_JEU.map((a) => a.regle));
    for (const r of ["R1", "R2", "R12", "R15", "R22"]) expect(regles.has(r)).toBe(true);
  });

  it("action inconnue lève", () => {
    expect(() => actionParId("n'existe-pas")).toThrow();
  });

  it("J9 : les dix origines du formulaire existent avec libellé et vecteur", () => {
    expect(ORIGINES).toHaveLength(10);
    const base: ConfigCarriere = {
      nom: "Test",
      origine: "bureau",
      traits: [],
      ideologie: { gaucheDroite: 0, ouvertFerme: 0 },
      ambition: "elu",
    };
    for (const o of ORIGINES) {
      expect(LIBELLES_ORIGINE[o].length).toBeGreaterThan(0);
      expect(vecteurOrigine(o).length).toBeGreaterThan(0);
      const c = creerCarriere({ ...base, origine: o }, creerRng(1));
      expect(c.origine).toBe(o);
    }
  });
});
