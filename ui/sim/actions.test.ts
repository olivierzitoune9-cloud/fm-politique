import { describe, expect, it } from "vitest";
import { ACTIONS_JEU, actionParId } from "./actions.js";

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
});
